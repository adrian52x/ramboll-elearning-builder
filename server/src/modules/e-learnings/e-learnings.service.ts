import { Injectable, BadRequestException } from '@nestjs/common';
import { EntityManager, UniqueConstraintViolationException } from '@mikro-orm/postgresql';
import { ELearning } from './entities/e-learning.entity';
import { Step } from '../steps/entities/step.entity';
import { Block } from '../blocks/entities/block.entity';
import { StepBlock } from '../step-blocks/entities/step-block.entity';
import { UniverseELearning } from '../universe-e-learning/entities/universe-e-learning.entity';
import { Universe } from '../universes/entities/universe.entity';
import { CreateELearningDto } from './dto/create-e-learning.dto';
import { buildBlockContent } from '../../common/utils/block.utils';

@Injectable()
export class ELearningsService {
    constructor(private readonly em: EntityManager) {}

    /**
     * Create an e-learning with steps, blocks, and universe assignments in a single transaction
     * 
     * Example payload:
     * {
     *   title: "Safety Training",
     *   description: "Basic safety procedures",
     *   steps: [
     *     {
     *       title: "Introduction",
     *       orderIndex: 1,
     *       blocks: [
     *         { newBlock: { type: "video", headline: "Welcome", ... }, orderIndex: 1 },
     *         { existingBlockId: "uuid-of-existing-block", orderIndex: 2 }
     *       ]
     *     }
     *   ],
     *   universeIds: ["uuid1", "uuid2"]
     * }
     */
    async create(dto: CreateELearningDto) {
        try {
            return await this.em.transactional(async (em) => {
                // 1. Create the e-learning
                const eLearning = em.create(ELearning, {
                    title: dto.title,
                    description: dto.description,
                    coverImage: dto.coverImage,
                });

                // 2. Create steps and assign blocks
                for (const stepDto of dto.steps) {
                    const step = em.create(Step, {
                        eLearning,
                        title: stepDto.title,
                        orderIndex: stepDto.orderIndex,
                    });

                    // 3. Handle blocks (create new or reference existing)
                    for (const blockAssignment of stepDto.stepBlocks) {
                        let block: Block;

                        if (blockAssignment.existingBlockId) {
                            // Reference existing block
                            block = await em.findOneOrFail(Block, { id: blockAssignment.existingBlockId });
                        } else if (blockAssignment.newBlock) {
                            // Create new block
                            const content = buildBlockContent(blockAssignment.newBlock);
                            block = em.create(Block, {
                                type: blockAssignment.newBlock.type,
                                headline: blockAssignment.newBlock.headline,
                                description: blockAssignment.newBlock.description,
                                content,
                            });
                        } else {
                            throw new Error('Each block assignment must have either existingBlockId or newBlock');
                        }

                        // 4. Create step-block relationship
                        em.create(StepBlock, {
                            step,
                            block,
                            orderIndex: blockAssignment.orderIndex,
                        });
                    }
                }

                // 5. Assign to universes
                for (const universeId of dto.universeIds) {
                    const universe = await em.findOneOrFail(Universe, { id: universeId });
                    em.create(UniverseELearning, {
                        universe,
                        eLearning,
                    });
                }

                await em.flush();
                return { message: 'E-learning created successfully', id: eLearning.id };
            });
        } catch (error) {
            if (error instanceof UniqueConstraintViolationException) {
                throw new BadRequestException('Duplicate data detected: ensure all orderIndex values are unique and blocks are not duplicated within steps');
            }
            throw error;
        }
    }

    /**
     * Get all e-learnings with minimal data (for list view)
     */
    async findAll(): Promise<ELearning[]> {
        return this.em.find(ELearning, {}, { 
            populate: ['universeElearnings.universe'],
            orderBy: { createdAt: 'DESC' }
        });
    }

    /**
     * Get all e-learnings assigned to a specific universe (for logged-in user's universe)
     * Light population for list view - only basic info
     */
    async findAllByUniverseId(universeId: number): Promise<ELearning[]> {
        return this.em.find(ELearning, {
            universeElearnings: { universe: { id: universeId } }
        }, { 
            populate: ['universeElearnings.universe'],
            orderBy: { createdAt: 'DESC' }
        });
    }

    /**
     * Get single e-learning with full deep population (for detail view)
     * Includes steps, blocks with proper order, and universe assignments
     */
    async findOne(id: number): Promise<ELearning> {
        return this.em.findOneOrFail(ELearning, { id }, { 
            populate: ['steps.stepBlocks.block', 'universeElearnings.universe'],
            orderBy: { steps: { orderIndex: 'ASC', stepBlocks: { orderIndex: 'ASC' } } }
        });
    }

    /**
     * Update an e-learning using "replace-all" strategy
     * - Updates basic fields (title, description, coverImage)
     * - Deletes all existing Steps (cascades to StepBlocks)
     * - Deletes all existing UniverseELearnings
     * - Recreates Steps, StepBlocks, and UniverseELearnings from DTO
     * - Never deletes Blocks (they're independent, shared resources)
     */
    async update(id: number, dto: CreateELearningDto) {
        try {
            return await this.em.transactional(async (em) => {
                // 1. Fetch the existing e-learning with relationships
                const eLearning = await em.findOneOrFail(ELearning, { id }, {
                    populate: ['steps.stepBlocks', 'universeElearnings']
                });

                // 2. Update basic fields
                eLearning.title = dto.title;
                eLearning.description = dto.description;
                eLearning.coverImage = dto.coverImage;

                // 3. Remove all relationships manually in correct order
                // First: StepBlocks (children of Steps)
                for (const step of eLearning.steps.getItems()) {
                    for (const stepBlock of step.stepBlocks.getItems()) {
                        em.remove(stepBlock);
                    }
                }
                // Flush StepBlock deletions to database before deleting Steps
                await em.flush();

                // Then: Steps (children of ELearning)
                for (const step of eLearning.steps.getItems()) {
                    em.remove(step);
                }

                // 4. Clear universe assignments (orphanRemoval handles deletion)
                eLearning.universeElearnings.removeAll();

                // 5. Recreate steps and assign blocks (same logic as create)
                for (const stepDto of dto.steps) {
                    const step = em.create(Step, {
                        eLearning,
                        title: stepDto.title,
                        orderIndex: stepDto.orderIndex,
                    });

                    // 6. Handle blocks (create new or reference existing)
                    for (const blockAssignment of stepDto.stepBlocks) {
                        let block: Block;

                        if (blockAssignment.existingBlockId) {
                            // Reference existing block (doesn't delete it)
                            block = await em.findOneOrFail(Block, { id: blockAssignment.existingBlockId });
                        } else if (blockAssignment.newBlock) {
                            // Create new block
                            const content = buildBlockContent(blockAssignment.newBlock);
                            block = em.create(Block, {
                                type: blockAssignment.newBlock.type,
                                headline: blockAssignment.newBlock.headline,
                                description: blockAssignment.newBlock.description,
                                content,
                            });
                        } else {
                            throw new Error('Each block assignment must have either existingBlockId or newBlock');
                        }

                        // 7. Create step-block relationship
                        em.create(StepBlock, {
                            step,
                            block,
                            orderIndex: blockAssignment.orderIndex,
                        });
                    }
                }

                // 8. Recreate universe assignments
                for (const universeId of dto.universeIds) {
                    const universe = await em.findOneOrFail(Universe, { id: universeId });
                    em.create(UniverseELearning, {
                        universe,
                        eLearning,
                    });
                }

                await em.flush();
                return { message: 'E-learning updated successfully', id: eLearning.id };
            });
        } catch (error) {
            if (error instanceof UniqueConstraintViolationException) {
                throw new BadRequestException('Duplicate data detected: ensure all orderIndex values are unique and blocks are not duplicated within steps');
            }
            throw error;
        }
    }

    /**
     * Need to populate the relationships before deleting, 
     * so MikroORM knows what children to remove.
     */
    async remove(id: number): Promise<void> {
        const eLearning = await this.em.findOneOrFail(ELearning, { id }, {
            populate: ['steps.stepBlocks', 'universeElearnings']
        });
        await this.em.removeAndFlush(eLearning);
    }
}

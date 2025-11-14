import { Injectable } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/postgresql';
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
    async create(dto: CreateELearningDto): Promise<ELearning> {
        return await this.em.transactional(async (em) => {
            // 1. Create the e-learning
            const eLearning = em.create(ELearning, {
                title: dto.title,
                description: dto.description,
            });

            // 2. Create steps and assign blocks
            for (const stepDto of dto.steps) {
                const step = em.create(Step, {
                    eLearning,
                    title: stepDto.title,
                    orderIndex: stepDto.orderIndex,
                });

                // 3. Handle blocks (create new or reference existing)
                for (const blockAssignment of stepDto.blocks) {
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
            return eLearning;
        });
    }

    async findAll(): Promise<ELearning[]> {
        return this.em.find(ELearning, {}, { populate: ['steps'] });
    }

    async findOne(id: number): Promise<ELearning> {
        return this.em.findOneOrFail(ELearning, { id }, { populate: ['steps'] });
    }

    async remove(id: number): Promise<void> {
        const eLearning = await this.em.findOneOrFail(ELearning, { id });
        await this.em.removeAndFlush(eLearning);
    }
}

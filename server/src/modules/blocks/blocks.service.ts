import { Injectable, BadRequestException } from '@nestjs/common';
import { EntityManager, ForeignKeyConstraintViolationException } from '@mikro-orm/postgresql';
import { Block } from './entities/block.entity';
import { CreateBlockDto } from './dto/create-block.dto';
import { buildBlockContent } from '../../common/utils/block.utils';

@Injectable()
export class BlocksService {
    constructor(private readonly em: EntityManager) {}

    /**
     * Create a new reusable block (independent of any step)
     */
    async create(dto: CreateBlockDto): Promise<Block> {
        const content = buildBlockContent(dto);

        const block = this.em.create(Block, {
            type: dto.type,
            headline: dto.headline,
            description: dto.description,
            content,
        });

        await this.em.flush();
        return block;
    }

    /**
     * Get all blocks (for selection/reuse)
     */
    async findAll(): Promise<Block[]> {
        return this.em.find(Block, {});
    }

    async findOne(id: number): Promise<Block> {
        return this.em.findOneOrFail(Block, { id });
    }

    // Find blocks that are not used in any steps (orphan blocks)
    async findUnused(): Promise<Block[]> {
        // Get all blocks with their stepBlocks populated
        const blocks = await this.em.find(Block, {}, {
            populate: ['stepBlocks']
        });
        
        // Filter blocks that have no stepBlocks
        return blocks.filter(block => block.stepBlocks.length === 0);
    }

    // async findUnused(): Promise<Block[]> {
    //     const qb = this.em.createQueryBuilder(Block, 'b');
    //     qb.leftJoinAndSelect('b.stepBlocks', 'sb')
    //       .where({ 'sb.id': null });
    //     return qb.getResultList();
    // }

    /**
     * Not implemented - kept for future use
     */
    async update(id: number, dto: Partial<CreateBlockDto>): Promise<Block> {
        throw new BadRequestException('Block updates are not currently supported');
    }

    /*
        * Delete a block (only if not used in any step), else throw error
    */
    async remove(id: number): Promise<void> {
        try {
            const block = await this.em.findOneOrFail(Block, { id }, {
                populate: ['stepBlocks']
            });
            
            // Check if block is being used in any steps
            if (block.stepBlocks.length > 0) {
                throw new BadRequestException(
                    `Cannot delete block "${block.headline}". It is currently being used in ${block.stepBlocks.length} step(s).`
                );
            }
            
            await this.em.removeAndFlush(block);
        } catch (error) {
            if (error instanceof ForeignKeyConstraintViolationException) {
                throw new BadRequestException(
                    'Cannot delete this block. It is currently being used in one or more e-learnings.'
                );
            }
            throw error;
        }
    }
}

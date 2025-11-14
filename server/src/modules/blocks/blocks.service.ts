import { Injectable } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/postgresql';
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

    async findOne(id: string): Promise<Block> {
        return this.em.findOneOrFail(Block, { id });
    }

    /**
     * Update block content (affects all steps using this block)
     */
    async update(id: string, dto: Partial<CreateBlockDto>): Promise<Block> {
        const block = await this.em.findOneOrFail(Block, { id });
        
        if (dto.headline) block.headline = dto.headline;
        if (dto.description !== undefined) block.description = dto.description;
        
        // If type changes or type-specific fields change, rebuild content
        if (dto.type && dto.type !== block.type) {
            block.type = dto.type;
            block.content = buildBlockContent(dto as CreateBlockDto);
        } else if (dto.type) {
            // Same type but content might have changed
            block.content = buildBlockContent(dto as CreateBlockDto);
        }

        await this.em.flush();
        return block;
    }

    async remove(id: string): Promise<void> {
        const block = await this.em.findOneOrFail(Block, { id });
        await this.em.removeAndFlush(block);
    }
}

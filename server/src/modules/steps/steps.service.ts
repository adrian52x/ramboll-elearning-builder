import { Injectable } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/postgresql';
import { Step } from './entities/step.entity';
import { Block } from '../blocks/entities/block.entity';
import { StepBlock } from '../step-blocks/entities/step-block.entity';

@Injectable()
export class StepsService {
    // constructor(private readonly em: EntityManager) {}

    // /**
    //  * Get all blocks assigned to a step, in order
    //  */
    // async getStepBlocks(stepId: string): Promise<Block[]> {
    //     const stepBlocks = await this.em.find(
    //         StepBlock,
    //         { step: { id: stepId } },
    //         { 
    //             orderBy: { orderIndex: 'ASC' },
    //             populate: ['block']
    //         }
    //     );

    //     return stepBlocks.map(sb => sb.block);
    // }

    // /**
    //  * Assign an existing block to a step
    //  * @param stepId The step to add the block to
    //  * @param blockId The existing block to assign
    //  * @param orderIndex The position of the block in the step
    //  */
    // async addBlockToStep(stepId: string, blockId: string, orderIndex: number): Promise<StepBlock> {
    //     const step = await this.em.findOneOrFail(Step, { id: stepId });
    //     const block = await this.em.findOneOrFail(Block, { id: blockId });

    //     const stepBlock = this.em.create(StepBlock, {
    //         step,
    //         block,
    //         orderIndex,
    //     });

    //     await this.em.flush();
    //     return stepBlock;
    // }

    // /**
    //  * Update the order of a block within a step
    //  */
    // async updateBlockOrder(stepId: string, blockId: string, newOrderIndex: number): Promise<void> {
    //     const stepBlock = await this.em.findOneOrFail(
    //         StepBlock,
    //         { step: { id: stepId }, block: { id: blockId } }
    //     );

    //     stepBlock.orderIndex = newOrderIndex;
    //     await this.em.flush();
    // }

    // /**
    //  * Remove a block from a step (doesn't delete the block itself)
    //  */
    // async removeBlockFromStep(stepId: string, blockId: string): Promise<void> {
    //     const stepBlock = await this.em.findOneOrFail(
    //         StepBlock,
    //         { step: { id: stepId }, block: { id: blockId } }
    //     );

    //     await this.em.removeAndFlush(stepBlock);
    // }
}

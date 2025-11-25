import { CreateStepDto } from "@/types";

/**
 * Transforms UI state steps to API request format
 * Maps CreateStepDto array to the exact structure expected by the backend
 */
export const generateOutputJSON = (steps: CreateStepDto[]) => {
    return steps.map((step) => ({
        title: step.title,
        orderIndex: step.orderIndex,
        stepBlocks: step.stepBlocks.map((stepBlock) => {
            // Handle existing block reference
            if (stepBlock.existingBlockId !== undefined) {
                return {
                    existingBlockId: stepBlock.existingBlockId,
                    orderIndex: stepBlock.orderIndex,
                };
            }

            // Handle new block creation - spread all properties from newBlock
            return {
                newBlock: stepBlock.newBlock,
                orderIndex: stepBlock.orderIndex,
            };
        }),
    }));
};

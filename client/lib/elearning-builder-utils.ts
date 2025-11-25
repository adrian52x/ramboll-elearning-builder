import { CreateELearningDto } from "@/types";

/**
 * Transforms UI state e-learning data to API request format
 * Maps CreateELearningDto to the exact structure expected by the backend
 */
export const generateOutputJSON = (data: CreateELearningDto) => {
    return {
        title: data.title,
        description: data.description,
        universeIds: data.universeIds,
        steps: generateStepsJSON(data.steps),
    };
};

/**
 * Helper function to transform steps array
 */
export const generateStepsJSON = (steps: CreateELearningDto['steps']) => {
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

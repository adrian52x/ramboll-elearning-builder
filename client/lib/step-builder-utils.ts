import { CreateStepDto } from "@/types";

/**
 * Transforms UI state steps to API request format
 * Maps CreateStepDto array to the exact structure expected by the backend
 */
export const generateOutputJSON = (steps: CreateStepDto[]) => {
    return steps.map(step => ({
        title: step.title,
        orderIndex: step.orderIndex,
        stepBlocks: step.stepBlocks.map(stepBlock => ({
            newBlock: {
                type: stepBlock.newBlock?.type,
                headline: stepBlock.newBlock?.headline,
                description: stepBlock.newBlock?.description,
                content: stepBlock.newBlock?.content
            },
            orderIndex: stepBlock.orderIndex
        }))
    }));
};

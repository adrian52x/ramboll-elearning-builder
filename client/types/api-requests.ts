// DTO Types for API Requests
// These match the structure expected by the backend API

import { BlockType } from './enums';

// Create E-Learning
export interface CreateELearningDto {
    title: string;
    description?: string;
    steps: CreateStepDto[];
    universeIds: number[];
}

export interface CreateStepDto {
    title: string;
    orderIndex: number;
    stepBlocks: StepBlockDTO[];
}

export interface StepBlockDTO {
    //existingBlockId?: number;
    newBlock: CreateBlockDto;
    orderIndex: number;
}

export interface CreateBlockDto {
    type: BlockType;
    headline: string;
    description?: string;
    content: Record<string, any>;
}

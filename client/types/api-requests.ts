// DTO Types for API Requests
// These match the structure expected by the backend API

import { BlockType } from "./enums";

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
    existingBlockId?: number;
    newBlock?: CreateBlockDto;
    orderIndex: number;
}

export interface CreateBlockDto {
    type: BlockType;
    headline: string;
    description?: string;

    // VIDEO BLOCK FIELDS
    video_url?: string;

    // IMAGE BLOCK FIELDS
    image_urls?: string[];

    // INTERACTIVE TABS FIELDS
    tabs?: TabDto[];

    // FLIP CARDS FIELDS
    cards?: CardDto[];

    // FEEDBACK ACTIVITY FIELDS
    question?: string;
}

// Supporting types for nested structures
export interface TabDto {
    title: string;
    description: string;
    content_url: string;
}

export interface CardDto {
    front: string;
    back: string;
}

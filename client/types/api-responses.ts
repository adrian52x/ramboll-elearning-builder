// API Response Types
// These match the structure returned by the backend API

import { BlockType } from "./enums";

// Universe Types
export interface Universe {
    id: number;
    name: string;
}

export interface UniverseELearning {
    id: number;
    universe: Universe;
    eLearning: number;
    assignedAt: string;
}

// E-Learning Types
export interface ELearning {
    id: number;
    title: string;
    description?: string;
    coverImage: string;
    createdAt: string;
    updatedAt: string;
    universeElearnings: UniverseELearning[];
}

export interface ELearningById {
    id: number;
    title: string;
    description: string;
    coverImage: string;
    createdAt: string;
    updatedAt: string;
    steps: Step[];
    universeElearnings: UniverseELearning[];
}

// Step and Block Types
export interface Step {
    id: number;
    title: string;
    orderIndex: number;
    stepBlocks: StepBlock[];
}

export interface StepBlock {
    id: number;
    block: Block;
    orderIndex: number;
}

export interface Block {
    id: number;
    type: BlockType;
    headline: string;
    description?: string;
    content: Record<string, any>;
}

// API Response Types - List (without full relations)
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

export interface ELearning {
    id: number;
    title: string;
    description?: string;
    createdAt: string;
    updatedAt: string;
    universeElearnings: UniverseELearning[];
    //steps?: Step[];
}



// API Response Types - Single E-Learning by ID (with full relations)
export interface ELearningById {
    id: number;
    title: string;
    description: string;
    createdAt: string;
    updatedAt: string;
    steps: Step[];
    universeElearnings: UniverseELearning[];

}
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

// Legacy types (can be deprecated)
// export interface Step {
//     id: number;
//     title: string;
//     orderIndex: number;
//     eLearningId: number;
//     createdAt: string;
//     updatedAt: string;
//     stepBlocks?: StepBlock[];
// }

export enum BlockType {
    VIDEO = "video",
    IMAGE = "image",
    INTERACTIVE_TABS = "interactive_tabs",
    FLIP_CARDS = "flip_cards",
    FEEDBACK_ACTIVITY = "feedback_activity",
}

export interface Block {
    id: number;
    type: BlockType;
    headline: string;
    description?: string;
    content: Record<string, any>;
}

// DTO Types for Creating
export interface CreateELearningDto {
    title: string;
    description?: string;
    steps: CreateStepDto[];
    universeIds: number[];
}

export interface CreateStepDto {
    title: string;
    orderIndex: number;
    blocks: BlockAssignmentDto[];
}

export interface BlockAssignmentDto {
    existingBlockId?: number;
    newBlock?: CreateBlockDto;
    orderIndex: number;
}

export interface CreateBlockDto {
    type: BlockType;
    headline: string;
    description?: string;
    content: Record<string, any>;
}


const videoBlockJson = {
    "headline": "Sample Video",
    "description": "This is a sample video description.",
    "video_url": "https://example.com/video.mp4"
};

const imageBlockJson = {
    "headline": "Sample Image",
    "description": "This is a sample image description.",
    "image_urls": ["https://example.com/image.jpg"]
};

const interactiveTabsBlockJson = {
    "headline": "Interactive Tabs",
    "description": "This is a sample interactive tabs description.",
    "tabs": [
        {
            "title": "Box 1",
            "content": "This is the content of box 1.",
            "content_url": "https://example.com/box1-content"
        },
        {
            "title": "Box 2",
            "content": "This is the content of box 2.",
            "content_url": "https://example.com/box2-content"
        }
    ]
};

const flipCardsBlockJson = {
    "headline": "Flip Cards",
    "description": "This is a sample flip cards description.",
    "cards": [
        {
            "front": "Front of card 1",
            "back": "Back of card 1"
        },
        {
            "front": "Front of card 2",
            "back": "Back of card 2"
        }
    ]
};

const feedbackActivityBlockJson = {
    "headline": "Feedback Activity",
    "question": "This is a sample feedback activity question.",
};

export interface ELearning {
    id: string;
    title: string;
    description: string;
    created_at: Date;
    updated_at: Date;
}

export interface ELearningStep {
    id: string;
    e_learning_id: string; // refers to ELearning.id
    title: string;
    order_index: number;
    created_at: Date;
    updated_at: Date;
}

export enum BlockType {
    VIDEO = "video",
    IMAGE = "image",
    INTERACTIVE_TABS = "interactive_tabs",
    FLIP_CARDS = "flip_cards",
    FEEDBACK_ACTIVITY = "feedback_activity",
}

export interface BaseBlock {
    id: string;
    headline: string;
    description: string;
    step_id: string; // refers to ModuleStep.id
    order_index: number;
    created_at: Date;
    updated_at: Date;
}

export interface VideoBlock extends BaseBlock {
    video_url: string;
}

export interface ImageBlock extends BaseBlock {
    image_urls: string[]; // array of image URLs
}

export interface InteractiveTabsBlock extends BaseBlock {
    tabs: {
        title: string;
        content: string;
        content_url: string;
    }[];
}

export interface FlipCardsBlock extends BaseBlock {
    cards: {
        front: string;
        back: string;
    }[];
}

export interface FeedbackActivityBlock extends BaseBlock {
    question: string;
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

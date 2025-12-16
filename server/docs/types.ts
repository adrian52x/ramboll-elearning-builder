// TO DO : Deprecated - Remove unused types and interfaces

interface Universe {
    id: string;
    name: string;
}

interface Unit {
    id: string;
    universe_id: string; // refers to Universe.id
    name: string;
}

interface User {
    id: string;
    unit_id: string; // refers to Unit.id
    username: string;
    password: string; // hashed password
    role: 'user' | 'incept-admin';
    created_at: Date;
}

interface ELearningAssignment {
    id: string;
    universe_id: string; // refers to Universe.id
    e_learning_id: string; // refers to ELearning.id
    assigned_at: Date;
}

interface ELearning {
    id: string;
    title: string;
    description: string;
    created_at: Date;
    updated_at: Date;
}

interface ELearningStep {
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

interface BaseBlock {
    id: string;
    headline: string;
    description: string;
    step_id: string; // refers to ModuleStep.id
    order_index: number;
    created_at: Date;
    updated_at: Date;
}

interface VideoBlock extends BaseBlock {
    video_url: string;
}

interface ImageBlock extends BaseBlock {
    image_urls: string[]; // array of image URLs
}

interface InteractiveTabsBlock extends BaseBlock {
    tabs: {
        title: string;
        content: string;
        content_url: string;
    }[];
}

interface FlipCardsBlock extends BaseBlock {
    cards: {
        front: string;
        back: string;
    }[];
}

interface FeedbackActivityBlock extends BaseBlock {
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
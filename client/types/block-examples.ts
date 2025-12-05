// Block Content Examples
// Sample JSON structures for different block types

import { BlockType } from "./enums";

export const videoBlockExample = {
    type: BlockType.VIDEO,
    headline: "Sample Video",
    description: "This is a sample video description.",
    videoUrl: "https://example.com/video.mp4",
};

export const imageBlockExample = {
    type: BlockType.IMAGE,
    headline: "Sample Image",
    description: "This is a sample image description.",
    imageUrls: ["https://example.com/image.jpg"],
};

export const interactiveTabsBlockExample = {
    type: BlockType.INTERACTIVE_TABS,
    headline: "Interactive Tabs",
    description: "This is a sample interactive tabs description.",
    tabs: [
        {
            title: "Box 1",
            content: "This is the content of box 1.",
            contentUrl: "https://example.com/box1-content",
        },
        {
            title: "Box 2",
            content: "This is the content of box 2.",
            contentUrl: "https://example.com/box2-content",
        },
    ],
};

export const flipCardsBlockExample = {
    type: BlockType.FLIP_CARDS,
    headline: "Flip Cards",
    description: "This is a sample flip cards description.",
    cards: [
        {
            front: "Front of card 1",
            back: "Back of card 1",
        },
        {
            front: "Front of card 2",
            back: "Back of card 2",
        },
    ],
};

export const feedbackActivityBlockExample = {
    type: BlockType.FEEDBACK_ACTIVITY,
    headline: "Feedback Activity",
    question: "This is a sample feedback activity question.",
};

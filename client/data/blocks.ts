import { BlockType } from "@/types";

// Mock existing blocks
export const mockExistingBlocks = [
    {
        id: 1,
        type: BlockType.VIDEO,
        headline: "Safety Introduction Video",
        description: "Overview of workplace safety procedures",
        content: { videoUrl: "https://example.com/safety-intro.mp4" },
    },
    {
        id: 2,
        type: BlockType.VIDEO,
        headline: "Equipment Training Video",
        description: "How to use safety equipment",
        content: { videoUrl: "https://example.com/equipment-training.mp4" },
    },
    {
        id: 3,
        type: BlockType.IMAGE,
        headline: "Equipment Photos",
        description: "Essential safety equipment images",
        content: {
            imageUrls: ["https://example.com/equipment1.jpg", "https://example.com/equipment2.jpg"],
        },
    },
    {
        id: 4,
        type: BlockType.FEEDBACK_ACTIVITY,
        headline: "Safety Knowledge Check",
        description: "Test your understanding",
        content: { question: "What should you do first in case of fire?" },
    },
];

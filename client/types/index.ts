export enum BlockType {
    IMAGE = "IMAGE",
    VIDEO = "VIDEO",
    FLIPCARDS = "FLIPCARDS",
    FEEDBACK = "FEEDBACK",
}

export interface ContentBlock {
    id: string;
    type: BlockType;
    content: any;
}

export interface Step {
    id: string;
    title: string;
    blocks: ContentBlock[];
}

export interface Elearning {
    id: string;
    title: string;
    steps: Step[];
}

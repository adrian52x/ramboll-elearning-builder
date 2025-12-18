"use client";
import { useState } from "react";
import { Block, BlockType } from "@/types";
import {
    VideoBlockPreview,
    ImageBlockPreview,
    InteractiveTabsPreview,
    FlipCardsPreview,
    FeedbackActivityPreview,
} from "./block-renderers";
import { Badge } from "../ui/badge";
import { Check, ChevronDown, ChevronUp, Video, Image, SquareMousePointer, RotateCwSquare, MessageSquare, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface BlockPreviewProps {
    block: Block;
    defaultExpanded?: boolean;
}

/**
 * Main block preview component that routes to the appropriate renderer
 * based on the block type.
 */
export function BlockPreview({ block, defaultExpanded = true }: BlockPreviewProps) {
    const [isExpanded, setIsExpanded] = useState(defaultExpanded);
    const { type, headline, description, content } = block;

    const blockIconConfig = {
        [BlockType.VIDEO]: Video,
        [BlockType.IMAGE]: Image,
        [BlockType.INTERACTIVE_TABS]: SquareMousePointer,
        [BlockType.FLIP_CARDS]: RotateCwSquare,
        [BlockType.FEEDBACK_ACTIVITY]: MessageSquare,
    };

    const BlockIcon = blockIconConfig[type] || HelpCircle;

    const renderBlockContent = () => {
        switch (type) {
        case BlockType.VIDEO:
            return (
                <VideoBlockPreview
                    description={description}
                    videoUrl={content.videoUrl || ""}
                />
            );

        case BlockType.IMAGE:
            return (
                <ImageBlockPreview
                    description={description}
                    imageUrls={content.imageUrls || []}
                />
            );

        case BlockType.INTERACTIVE_TABS:
            return (
                <InteractiveTabsPreview
                    description={description}
                    tabs={content.tabs || []}
                />
            );

        case BlockType.FLIP_CARDS:
            return (
                <FlipCardsPreview
                    description={description}
                    cards={content.cards || []}
                />
            );

        case BlockType.FEEDBACK_ACTIVITY:
            return (
                <FeedbackActivityPreview
                    description={description}
                    question={content.question || ""}
                />
            );

        default:
            return (
                <div className="p-8 text-center">
                    <p className="text-muted-foreground">
                        Preview not available for block type: {type}
                    </p>
                </div>
            );
        }
    };

    return (
        <div
            className={cn(
                "mx-30 border rounded-lg transition-all duration-300 cursor-pointer hover:shadow-md bg-card"
            )}
        >
            {/* Block Header - Always Visible */}
            <div
                className="flex items-center justify-between p-4"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div className="flex items-center gap-3">
                    <Badge className="bg-incept-green w-8 h-8 p-1">
                        <Check />
                    </Badge>
                    <h4 className="font-medium">{headline}</h4>
                </div>
                <div className="flex items-center gap-2">
                    <BlockIcon />
                    {isExpanded ? (
                        <ChevronUp className="h-8 w-8 text-incept-primary" />
                    ) : (
                        <ChevronDown className="h-8 w-8 text-incept-primary" />
                    )}
                </div>
            </div>

            {/* Block Content - Expandable */}
            <div
                className={cn(
                    "overflow-hidden transition-all duration-300",
                    isExpanded ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
                )}
            >
                <div className="px-4 pb-4">
                    {renderBlockContent()}
                </div>
            </div>
        </div>
    );
}

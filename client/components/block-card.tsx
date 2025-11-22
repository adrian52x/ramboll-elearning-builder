import { BlockType } from "@/types";
import { Video, Image, TabletSmartphone, CreditCard, MessageSquare, RotateCcwSquare, RotateCwSquare, SquareMousePointer } from "lucide-react";

interface BlockCardProps {
    type: BlockType;
    onClick?: () => void;
    className?: string;
}

export function BlockCard({ type, onClick, className = "" }: BlockCardProps) {
    const blockConfig = {
        [BlockType.VIDEO]: {
            icon: Video,
            label: "Video",
            bgColor: "bg-blue-50",
            iconColor: "text-blue-600",
            borderColor: "border-blue-200"
        },
        [BlockType.IMAGE]: {
            icon: Image,
            label: "Image",
            bgColor: "bg-green-50",
            iconColor: "text-green-600",
            borderColor: "border-green-200"
        },
        [BlockType.INTERACTIVE_TABS]: {
            icon: SquareMousePointer,
            label: "Interactive Tabs",
            bgColor: "bg-purple-50",
            iconColor: "text-purple-600",
            borderColor: "border-purple-200"
        },
        [BlockType.FLIP_CARDS]: {
            icon: RotateCwSquare,
            label: "Flip Cards",
            bgColor: "bg-orange-50",
            iconColor: "text-orange-600",
            borderColor: "border-orange-200"
        },
        [BlockType.FEEDBACK_ACTIVITY]: {
            icon: MessageSquare,
            label: "Feedback",
            bgColor: "bg-pink-50",
            iconColor: "text-pink-600",
            borderColor: "border-pink-200"
        }
    };

    const config = blockConfig[type];
    const Icon = config.icon;
    //${config.bgColor} ${config.borderColor}

    return (
        <div
            onClick={onClick}
            className={`
                w-28 h-28
                flex flex-col items-center justify-center
                p-4 rounded-lg border-1
                border-gray-500 border-dashed
                cursor-pointer
                transition-all duration-200
                shadow-md
                hover:shadow-lg hover:scale-105
                active:scale-95
                ${className}
            `}
        >
            <Icon className={`h-8 w-8 ${config.iconColor} mb-2`} />
            <span className={`text-sm font-medium text-center`}>
                {config.label}
            </span>
        </div>
    );
}

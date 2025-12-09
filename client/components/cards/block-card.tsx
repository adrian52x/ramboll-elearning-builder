import { BlockType } from "@/types";
import { Video, Image, TabletSmartphone, CreditCard, MessageSquare, RotateCcwSquare, RotateCwSquare, SquareMousePointer } from "lucide-react";

interface BlockCardProps {
    type: BlockType;
    onClick?: () => void;
    className?: string;
    headline?: string;
    variant?: 'default' | 'compact' | '2nd';
}

export function BlockCard({ type, onClick, className = "", headline, variant = 'default' }: BlockCardProps) {
    const blockConfig = {
        [BlockType.VIDEO]: {
            icon: Video,
            label: "Video",
            bgColor: "bg-blue-50",
            iconColor: "text-blue-600",
            borderColor: "border-blue-200",
        },
        [BlockType.IMAGE]: {
            icon: Image,
            label: "Image",
            bgColor: "bg-green-50",
            iconColor: "text-green-600",
            borderColor: "border-green-200",
        },
        [BlockType.INTERACTIVE_TABS]: {
            icon: SquareMousePointer,
            label: "Interactive Tabs",
            bgColor: "bg-purple-50",
            iconColor: "text-purple-600",
            borderColor: "border-purple-200",
        },
        [BlockType.FLIP_CARDS]: {
            icon: RotateCwSquare,
            label: "Flip Cards",
            bgColor: "bg-orange-50",
            iconColor: "text-orange-600",
            borderColor: "border-orange-200",
        },
        [BlockType.FEEDBACK_ACTIVITY]: {
            icon: MessageSquare,
            label: "Feedback",
            bgColor: "bg-pink-50",
            iconColor: "text-pink-600",
            borderColor: "border-pink-200",
        },
    };

    const config = blockConfig[type];
    const Icon = config.icon;

    // Default variant - centered layout
    if (variant === 'default') {
        return (
            <div
                onClick={onClick}
                className={`
                    relative
                    w-24 h-24
                    flex flex-col items-center
                    ${headline ? 'justify-start pt-1' : 'justify-center'}
                    rounded-lg border-1
                    border-gray-500 border-dashed
                    cursor-pointer
                    transition-all duration-200
                    shadow-md
                    hover:shadow-lg hover:scale-105
                    active:scale-95
                    ${className}
                `}
            >
                {headline ? (
                    <div className="flex items-center gap-1 px-1">
                        <Icon className={`h-6 w-6 ${config.iconColor}`} />
                        <span className="text-xs font-medium">{config.label}</span>
                    </div>
                ) : (
                    <>
                        <Icon className={`h-8 w-8 ${config.iconColor} mb-1`} />
                        <span className="text-sm font-medium text-center">{config.label}</span>
                    </>
                )}
                
                {headline && (
                    <div 
                        className="absolute bottom-1 left-1 right-1 bg-background/80 text-white text-xs px-1 rounded text-center break-words line-clamp-4"
                        title={headline}
                    >
                        {headline}
                    </div>
                )}
            </div>
        );
    } 

    // Compact variant - icon/label in top-left, headline takes center
    // return (
    //     <div
    //         onClick={onClick}
    //         className={`
    //             relative
    //             w-24 h-24
    //             rounded-lg border-1
    //             border-gray-500 border-dashed
    //             cursor-pointer
    //             transition-all duration-200
    //             shadow-md
    //             hover:shadow-lg hover:scale-105
    //             active:scale-95
    //             p-2
    //             ${className}
    //         `}
    //     >
    //         <div className={`flex items-center justify-center gap-1 mb-1 border-b-3 ${config.borderColor} ${config.bgColor} p-1 rounded`}>
    //             <Icon className={`h-4 w-4 ${config.iconColor}`} />
    //             <span className={`text-xs font-medium`}>{config.label}</span>
    //         </div>
            
    //         {headline && (
    //             <div className="mt-6 text-sm font-medium text-center break-words line-clamp-3">
    //                 {headline}
    //             </div>
    //         )}
    //     </div>
    // );
}

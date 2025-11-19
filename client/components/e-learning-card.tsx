import { BookOpen, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ELearningCardProps {
    id: number;
    title: string;
    description?: string;
    onEdit?: (id: number) => void;
    onDelete?: (id: number) => void;
}

export function ELearningCard({
    id,
    title,
    description,
    onEdit,
    onDelete,
}: ELearningCardProps) {
    return (
        <div className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition-shadow flex flex-col h-full">
            {/* Image Placeholder */}
            <div className="bg-muted h-48 flex items-center justify-center">
                <BookOpen className="h-16 w-16 text-muted-foreground" />
            </div>

            {/* Content */}
            <div className="p-4 flex flex-col flex-1">
                <h3 className="text-lg font-semibold text-card-foreground line-clamp-2 mb-4">
                    {title}
                </h3>

                {/* Action Buttons */}
                <div className="flex gap-2 justify-end mt-auto">
                    <Button
                        onClick={() => onEdit?.(id)}
                        variant="outline"
                        size="sm"
                    >
                        <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                        onClick={() => onDelete?.(id)}
                        variant="outline"
                        size="sm"
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
}

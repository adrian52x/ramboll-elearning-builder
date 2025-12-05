import { BookOpen, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ELearning } from "@/types";
import Image from "next/image";

interface ELearningCardProps {
    eLearning: ELearning;
    onEdit?: (id: number) => void;
    onDelete?: (id: number) => void;
}

export function ELearningCard({ eLearning, onEdit, onDelete }: ELearningCardProps) {
    return (
        <div className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition-shadow flex flex-col h-full">
            {/* Cover Image */}
            <div className="bg-muted flex items-center justify-center relative py-8">
                <div className="relative w-48 h-48 rounded-full border-8 border-incept-green overflow-hidden flex items-center justify-center bg-white">
                    {eLearning.coverImage ? (
                        <Image 
                            src={eLearning.coverImage} 
                            alt={eLearning.title} 
                            fill 
                            className="object-cover" 
                            unoptimized 
                        />
                    ) : (
                        <BookOpen className="h-16 w-16 text-muted-foreground" />
                    )}
                </div>
            </div>

            {/* Content */}
            <div className="p-4 flex flex-col flex-1">
                <h3 className="text-lg font-semibold text-card-foreground line-clamp-3 mb-4 text-center">{eLearning.title}</h3>

                {/* Action Buttons */}
                <div className="flex gap-2 justify-end mt-auto">
                    <Button onClick={() => onEdit?.(eLearning.id)} variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                    </Button>
                    <Button onClick={() => onDelete?.(eLearning.id)} variant="outline" size="sm">
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
}

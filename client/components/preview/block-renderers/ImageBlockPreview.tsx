"use client";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ImageBlockPreviewProps {
    description?: string;
    imageUrls: string[];
}

export function ImageBlockPreview({ description, imageUrls }: ImageBlockPreviewProps) {
    const [currentIndex, setCurrentIndex] = useState(0);

    const nextImage = () => {
        setCurrentIndex((prev) => (prev + 1) % imageUrls.length);
    };

    const previousImage = () => {
        setCurrentIndex((prev) => (prev - 1 + imageUrls.length) % imageUrls.length);
    };

    return (
        <div className="space-y-4">
            <>
                {description && <p className="text-muted-foreground">{description}</p>}
            </>

            <div className="relative bg-neutral-100 rounded-lg overflow-hidden max-w-2xl mx-auto">
                <div className="aspect-video flex items-center justify-center">
                    <img
                        src={imageUrls[currentIndex]}
                        alt={`Image ${currentIndex + 1}`}
                        className="max-w-full max-h-full object-contain"
                    />
                </div>

                {imageUrls.length > 1 && (
                    <>
                        <Button
                            variant="secondary"
                            size="icon"
                            className="absolute left-2 top-1/2 -translate-y-1/2"
                            onClick={previousImage}
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="secondary"
                            size="icon"
                            className="absolute right-2 top-1/2 -translate-y-1/2"
                            onClick={nextImage}
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Button>

                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                            {currentIndex + 1} / {imageUrls.length}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

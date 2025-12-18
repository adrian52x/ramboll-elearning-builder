"use client";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";

interface FlipCard {
    front: string;
    back: string;
}

interface FlipCardsPreviewProps {
    description?: string;
    cards: FlipCard[];
}

export function FlipCardsPreview({ description, cards }: FlipCardsPreviewProps) {
    const [flippedCards, setFlippedCards] = useState<Set<number>>(new Set());

    const toggleFlip = (index: number) => {
        setFlippedCards((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(index)) {
                newSet.delete(index);
            } else {
                newSet.add(index);
            }
            return newSet;
        });
    };

    if (cards.length === 0) {
        return (
            <div className="space-y-4">
                {description && <p className="text-muted-foreground">{description}</p>}
                <Card>
                    <CardContent className="pt-6">
                        <p className="text-muted-foreground text-center">No cards configured</p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {description && <p>{description}</p>}

            {/* Card Grid */}
            <div className="grid grid-cols-3 gap-4">
                {cards.map((card, index) => {
                    const isFlipped = flippedCards.has(index);
                    
                    return (
                        <div
                            key={index}
                            className="perspective-1000 h-[300px] cursor-pointer"
                            onClick={() => toggleFlip(index)}
                        >
                            <div
                                className={`relative w-full h-full transition-transform duration-500 transform-style-3d ${
                                    isFlipped ? "rotate-y-180" : ""
                                }`}
                            >
                                {/* Front of card */}
                                <Card className="absolute w-full h-full backface-hidden overflow-hidden bg-incept-primary/5">
                                    <CardContent className="h-full flex flex-col items-center justify-center p-6 overflow-y-auto">
                                        <div className="text-center space-y-2">
                                            <div className="text-xs font-semibold text-incept-primary uppercase tracking-wider">
                                                Front
                                            </div>
                                            <p className="text-sm text-foreground whitespace-pre-wrap break-words">
                                                {card.front}
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Back of card */}
                                <Card className="absolute w-full h-full backface-hidden rotate-y-180 bg-incept-green/20 overflow-hidden">
                                    <CardContent className="h-full flex flex-col items-center justify-center p-6 overflow-y-auto">
                                        <div className="text-center space-y-2">
                                            <div className="text-xs font-semibold text-incept-secondary uppercase tracking-wider">
                                                Back
                                            </div>
                                            <p className="text-sm text-foreground whitespace-pre-wrap break-words">
                                                {card.back}
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

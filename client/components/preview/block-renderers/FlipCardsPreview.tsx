"use client";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, RotateCw } from "lucide-react";

interface FlipCard {
    front: string;
    back: string;
}

interface FlipCardsPreviewProps {
    description?: string;
    cards: FlipCard[];
}

export function FlipCardsPreview({ description, cards }: FlipCardsPreviewProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);

    const nextCard = () => {
        setCurrentIndex((prev) => (prev + 1) % cards.length);
        setIsFlipped(false);
    };

    const previousCard = () => {
        setCurrentIndex((prev) => (prev - 1 + cards.length) % cards.length);
        setIsFlipped(false);
    };

    const toggleFlip = () => {
        setIsFlipped((prev) => !prev);
    };

    if (cards.length === 0) {
        return (
            <div className="space-y-4">
                <>
                    {description && <p className="text-muted-foreground">{description}</p>}
                </>
                <Card>
                    <CardContent className="pt-6">
                        <p className="text-muted-foreground text-center">No cards configured</p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const currentCard = cards[currentIndex];

    return (
        <div className="space-y-4">
            <>
                {description && <p className="text-muted-foreground">{description}</p>}
            </>

            <div className="space-y-4">
                {/* Card Display */}
                <Card className="min-h-[300px] cursor-pointer transition-all hover:shadow-lg" onClick={toggleFlip}>
                    <CardContent className="pt-6 h-full flex flex-col items-center justify-center p-8">
                        <div className="text-center space-y-4">
                            <div className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                                {isFlipped ? "Back" : "Front"}
                            </div>
                            <p className="text-lg text-foreground whitespace-pre-wrap">
                                {isFlipped ? currentCard.back : currentCard.front}
                            </p>
                        </div>
                    </CardContent>
                </Card>

                {/* Controls */}
                <div className="flex items-center justify-between">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={previousCard}
                        disabled={cards.length <= 1}
                    >
                        <ChevronLeft className="h-4 w-4 mr-1" />
                        Previous
                    </Button>

                    <div className="flex items-center gap-3">
                        <span className="text-sm text-muted-foreground">
                            Card {currentIndex + 1} of {cards.length}
                        </span>
                        <Button variant="outline" size="sm" onClick={toggleFlip}>
                            <RotateCw className="h-4 w-4 mr-1" />
                            Flip
                        </Button>
                    </div>

                    <Button
                        variant="outline"
                        size="sm"
                        onClick={nextCard}
                        disabled={cards.length <= 1}
                    >
                        Next
                        <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                </div>
            </div>
        </div>
    );
}

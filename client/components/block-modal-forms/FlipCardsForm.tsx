import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { CardDto } from "@/types";

interface FlipCardsFormProps {
    cards: CardDto[];
    onCardsChange: (cards: CardDto[]) => void;
}

export function FlipCardsForm({ cards, onCardsChange }: FlipCardsFormProps) {
    const addCard = () => onCardsChange([...cards, { front: "", back: "" }]);
    const removeCard = (index: number) => onCardsChange(cards.filter((_, i) => i !== index));
    const updateCard = (index: number, field: keyof CardDto, value: string) => {
        const newCards = [...cards];
        newCards[index] = { ...newCards[index], [field]: value };
        onCardsChange(newCards);
    };

    return (
        <div className="space-y-2">
            <Label>Flip Cards *</Label>
            <div className="space-y-3">
                {cards.length === 0 ? (
                    <div className="text-sm text-gray-500">No cards added yet</div>
                ) : (
                    cards.map((card, index) => (
                        <div key={index} className="border rounded-lg p-3 space-y-2">
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-medium">Card {index + 1}</span>
                                <Button type="button" variant="outline" size="sm" onClick={() => removeCard(index)}>
                                    ×
                                </Button>
                            </div>
                            <Textarea placeholder="Front of card" value={card.front} onChange={(e) => updateCard(index, "front", e.target.value)} />
                            <Textarea placeholder="Back of card" value={card.back} onChange={(e) => updateCard(index, "back", e.target.value)} />
                        </div>
                    ))
                )}
            </div>
            <Button type="button" variant="outline" size="sm" onClick={addCard} className="w-full">
                + Add Card
            </Button>
        </div>
    );
}

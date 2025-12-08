"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CreateELearningDto } from "@/types";

interface UniversesTabProps {
    data: CreateELearningDto;
    onUpdate: (updates: Partial<CreateELearningDto>) => void;
    onSubmit: () => void;
    onCancel: () => void;
}

export const UniversesTab = ({ data, onUpdate, onSubmit, onCancel }: UniversesTabProps) => {
    const [universeInput, setUniverseInput] = useState("");

    const addUniverse = () => {
        const id = parseInt(universeInput);
        if (!isNaN(id) && !data.universeIds.includes(id)) {
            onUpdate({ universeIds: [...data.universeIds, id] });
            setUniverseInput("");
        }
    };

    const removeUniverse = (id: number) => {
        onUpdate({ universeIds: data.universeIds.filter((uId) => uId !== id) });
    };

    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle>Assign Universes</CardTitle>
                    <CardDescription>Select which universes can access this e-learning (enter universe IDs)</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex gap-2">
                        <Input
                            type="number"
                            placeholder="Enter universe ID"
                            value={universeInput}
                            onChange={(e) => setUniverseInput(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && addUniverse()}
                        />
                        <Button type="button" onClick={addUniverse}>
                            Add
                        </Button>
                    </div>

                    {data.universeIds.length > 0 && (
                        <div className="space-y-2">
                            <Label>Selected Universes:</Label>
                            <div className="flex flex-wrap gap-2">
                                {data.universeIds.map((id) => (
                                    <div key={id} className="flex items-center gap-2 bg-muted px-3 py-1 rounded">
                                        <span>Universe ID: {id}</span>
                                        <Button type="button" variant="destructive" size="sm" onClick={() => removeUniverse(id)}>
                                            ×
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
            <div className="flex gap-4 justify-end mt-6">
                <Button type="button" variant="outline" onClick={onCancel}>
                    Cancel
                </Button>
                <Button type="button" variant="primary" onClick={onSubmit}>
                    Submit
                </Button>
            </div>
        </>
    );
};

"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CreateELearningDto } from "@/types";
import { useGetUniverses } from "@/lib/hooks/useUniverses";
import { Spinner } from "@/components/ui/spinner";
import { ErrorMessage } from "@/components/ui/error-message";
import { getErrorMessage } from "@/lib/api/error-handler";
import { Check } from "lucide-react";

interface UniversesTabProps {
    data: CreateELearningDto;
    onUpdate: (updates: Partial<CreateELearningDto>) => void;
    onSubmit: () => void;
    onCancel: () => void;
}

export const UniversesTab = ({ data, onUpdate, onSubmit, onCancel }: UniversesTabProps) => {
    const { universes, isPending, isError, error } = useGetUniverses();

    const toggleUniverse = (id: number) => {
        if (data.universeIds.includes(id)) {
            // Remove if already selected
            onUpdate({ universeIds: data.universeIds.filter((uId) => uId !== id) });
        } else {
            // Add if not selected
            onUpdate({ universeIds: [...data.universeIds, id] });
        }
    };

    const isSelected = (id: number) => data.universeIds.includes(id);

    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle>Assign Universes</CardTitle>
                    <CardDescription>
                        Select which universes can access this e-learning ({data.universeIds.length} selected)
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {isPending && (
                        <div className="flex justify-center py-8">
                            <Spinner size="lg" />
                        </div>
                    )}

                    {isError && (
                        <ErrorMessage
                            title="Failed to Load Universes"
                            message={getErrorMessage(error)}
                        />
                    )}

                    {!isPending && !isError && universes && (
                        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                            {universes.map((universe) => (
                                <Card
                                    key={universe.id}
                                    className={`cursor-pointer transition-all hover:shadow-md py-0 ${
                                        isSelected(universe.id)
                                            ? "border-primary border-2 bg-primary/5"
                                            : "border-gray-200 hover:border-primary/50"
                                    }`}
                                    onClick={() => toggleUniverse(universe.id)}
                                >
                                    <CardContent className="p-4">
                                        <div className="flex items-start justify-between gap-2">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs text-muted-foreground font-medium">
                                                        ID: {universe.id}
                                                    </span>
                                                    {isSelected(universe.id) && (
                                                        <Check className="h-4 w-4 text-primary" />
                                                    )}
                                                </div>
                                                <p className="font-semibold text-sm mt-1">
                                                    {universe.name}
                                                </p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
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

"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CreateELearningDto } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Spinner } from "@/components/ui/spinner";
import { ErrorMessage } from "@/components/ui/error-message";
import { generateOutputJSON } from "@/lib/elearning-builder-utils";
import { BasicInfoTab, StructureTab, UniversesTab } from "../components/create-elearning-tabs";
import { useGetELearningById, useUpdateELearning } from "@/lib/hooks/useElearnings";
import { getErrorMessage } from "@/lib/api/error-handler";

interface UpdateELearningPageProps {
    eLearningId: number;
}

export function UpdateELearningPage({ eLearningId }: UpdateELearningPageProps) {
    const router = useRouter();
    const { elearning, isPending, isError, error } = useGetELearningById(eLearningId);
    const { updateELearning } = useUpdateELearning();
    const [formData, setFormData] = useState<CreateELearningDto>({
        title: "",
        description: "",
        coverImage: "",
        steps: [],
        universeIds: [],
    });

    // Transform API response to form data when loaded
    useEffect(() => {
        if (elearning) {
            setFormData({
                title: elearning.title,
                description: elearning.description,
                coverImage: elearning.coverImage,
                steps: elearning.steps.map((step) => ({
                    title: step.title,
                    orderIndex: step.orderIndex,
                    stepBlocks: step.stepBlocks.map((sb) => ({
                        existingBlockId: sb.block.id,
                        orderIndex: sb.orderIndex,
                    })),
                })),
                universeIds: elearning.universeElearnings.map((ue) => ue.universe.id),
            });
        }
    }, [elearning]);

    /* Update form data from any tab
    Only updates the specific field, preserving other form data */
    const updateFormData = (updates: Partial<CreateELearningDto>) => {
        setFormData((prev) => ({ ...prev, ...updates }));
    };

    // Final submit - sends all collected data
    const handleSubmit = async () => {
        // Validate required fields
        if (!formData.title.trim()) {
            alert("Title is required");
            return;
        }

        if (formData.steps.length === 0) {
            alert("At least one step is required");
            return;
        }

        // Validate each step has a title
        for (let i = 0; i < formData.steps.length; i++) {
            if (!formData.steps[i].title.trim()) {
                alert(`Step ${i + 1} requires a title`);
                return;
            }
        }

        // Submit using the mutation hook
        updateELearning.mutate(
            { id: eLearningId, data: formData },
            {
                onSuccess: (response) => {
                    console.log("E-learning updated successfully:", response);
                    alert("E-learning updated successfully!");
                    router.push("/");
                },
                onError: (error) => {
                    alert(getErrorMessage(error));
                }
            }
        );
    };

    const handleCancel = () => {
        if (!confirm(`Are you sure you want to cancel editing this e-learning?`)) {
            return;
        }
        router.push("/");
    };

    if (isPending) {
        return (
            <div className="page-wrapper">
                <div className="flex items-center justify-center py-12">
                    <Spinner size="lg" />
                </div>
            </div>
        );
    }

    if (isError || !elearning) {
        return (
            <div className="page-wrapper">
                <ErrorMessage
                    title="Failed to Load E-Learning"
                    message={getErrorMessage(error)}
                />
            </div>
        );
    }

    return (
        <div className="page-wrapper">
            <div className="space-y-8">
                {/* Header */}
                <h1 className="text-2xl font-bold text-background">Edit E-Learning</h1>

                <Tabs defaultValue="basic">
                    <TabsList className="w-full">
                        <TabsTrigger value="basic">Basic info</TabsTrigger>
                        <TabsTrigger value="structure">Structure</TabsTrigger>
                        <TabsTrigger value="universes">Universes</TabsTrigger>
                    </TabsList>
                    <TabsContent value="basic">
                        <BasicInfoTab data={formData} onUpdate={updateFormData} onCancel={handleCancel} />
                    </TabsContent>
                    <TabsContent value="structure">
                        <StructureTab data={formData} onUpdate={updateFormData} />
                    </TabsContent>
                    <TabsContent value="universes">
                        <UniversesTab data={formData} onUpdate={updateFormData} onSubmit={handleSubmit} onCancel={handleCancel} />
                    </TabsContent>
                </Tabs>

                {/* JSON Output */}
                <Card>
                    <CardHeader>
                        <CardTitle>JSON Output Preview</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <pre className="bg-muted p-4 rounded-lg overflow-auto max-h-96 text-xs">
                            {JSON.stringify(generateOutputJSON(formData), null, 2)}
                        </pre>
                    </CardContent>
                </Card>

            </div>
        </div>
    );
}

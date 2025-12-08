"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { CreateELearningDto } from "@/types";
import { updateELearning } from "@/lib/api/elearnings";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { generateOutputJSON } from "@/lib/elearning-builder-utils";
import { BasicInfoTab, StructureTab, UniversesTab } from "./create-elearning-tabs";

interface UpdateELearningPageProps {
    eLearningId: number;
    initialData: CreateELearningDto;
}

export function UpdateELearningPage({ eLearningId, initialData }: UpdateELearningPageProps) {
    const router = useRouter();
    const [formData, setFormData] = useState<CreateELearningDto>(initialData);

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

        try {
            //const updatedELearning = await updateELearning(eLearningId, formData);
            //console.log("E-learning updated successfully:", updatedELearning);
            //router.push("/");
            alert("Update functionality not yet implemented.");
        } catch (error) {
            console.error("Failed to update e-learning:", error);
            alert("Failed to update e-learning. Please check the console for details.");
        }
    };

    const handleCancel = () => {
        router.push("/");
    };

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

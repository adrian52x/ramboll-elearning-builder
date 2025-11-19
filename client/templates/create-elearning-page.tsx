"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

// Define the complete e-learning data structure
interface ELearningData {
    title: string;
    description: string;
    coverImage?: string;
    structure: any[]; // TODO: Define proper structure type
    universes: any[]; // TODO: Define proper universes type
}

export function CreateELearningPage() {
    const router = useRouter();
    const [formData, setFormData] = useState<ELearningData>({
        title: "",
        description: "",
        coverImage: "",
        structure: [],
        universes: []
    });

    // Update form data from any tab
    const updateFormData = (updates: Partial<ELearningData>) => {
        setFormData(prev => ({ ...prev, ...updates }));
    };

    // Final submit - sends all collected data
    const handleSubmit = async () => {
        console.log("Submitting e-learning data:", formData);
        // TODO: API call to create e-learning
        // await api.createELearning(formData);
        // router.push("/");
    };

    const handleCancel = () => {
        router.push("/");
    };

    return (
        <div className="page-wrapper">
            <div className="space-y-8">
                {/* Header */}
                <h1 className="text-2xl font-bold text-background">
                    Create New E-Learning
                </h1>

                <Tabs defaultValue="basic">
                    <TabsList className="w-full">
                        <TabsTrigger value="basic">Basic info</TabsTrigger>
                        <TabsTrigger value="structure">Structure</TabsTrigger>
                        <TabsTrigger value="universes">Universes</TabsTrigger>
                    </TabsList>
                    <TabsContent value="basic">
                        <BasicInfoTab 
                            data={formData}
                            onUpdate={updateFormData}
                            onCancel={handleCancel}
                        />
                    </TabsContent>
                    <TabsContent value="structure">
                        <StructureTab 
                            data={formData}
                            onUpdate={updateFormData}
                        />
                    </TabsContent>
                    <TabsContent value="universes">
                        <UniversesTab 
                            data={formData}
                            onUpdate={updateFormData}
                            onSubmit={handleSubmit}
                            onCancel={handleCancel}
                        />
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}




const BasicInfoTab = ({ 
    data, 
    onUpdate, 
    onCancel 
}: { 
    data: ELearningData;
    onUpdate: (updates: Partial<ELearningData>) => void;
    onCancel: () => void;
}) => {
    const handleChange = (field: keyof ELearningData, value: any) => {
        onUpdate({ [field]: value });
    };

    return (
        <>
            <div className="bg-card border border-neutral-300 shadow-md rounded-md p-6 space-y-6">
                {/* Title */}
                <div className="space-y-2">
                    <label
                        htmlFor="title"
                        className="text-sm font-medium text-card-foreground"
                    >
                        Title *
                    </label>
                    <input
                        id="title"
                        type="text"
                        required
                        value={data.title}
                        onChange={(e) => handleChange('title', e.target.value)}
                        className="w-full px-3 py-2 bg-neutral-50 border border-input rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                        placeholder="Enter e-learning title"
                    />
                </div>

                {/* Description */}
                <div className="space-y-2">
                    <label
                        htmlFor="description"
                        className="text-sm font-medium text-card-foreground"
                    >
                        Description *
                    </label>
                    <textarea
                        id="description"
                        required
                        rows={4}
                        value={data.description}
                        onChange={(e) => handleChange('description', e.target.value)}
                        className="w-full px-3 py-2 bg-neutral-50 border border-input rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                        placeholder="Enter e-learning description"
                    />
                </div>
                {/* Image Upload Placeholder */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-card-foreground">
                        Cover Image
                    </label>
                    <div className="border-2 border-dashed border-input bg-neutral-50 rounded-lg p-8 text-center">
                        <p className="text-muted-foreground">
                            Image upload coming soon...
                        </p>
                    </div>
                </div>
            </div>
            {/* Action Buttons */}
            <div className="flex gap-4 justify-end mt-6">
                <Button type="button" variant="outline" onClick={onCancel}>
                    Cancel
                </Button>
            </div>
        </>
    )
}

const StructureTab = ({ 
    data, 
    onUpdate 
}: { 
    data: ELearningData;
    onUpdate: (updates: Partial<ELearningData>) => void;
}) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>E-Learning Structure</CardTitle>
                <CardDescription>
                    Define the structure of your e-learning course (units, steps, blocks)
                </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
                <div className="space-y-2">
                    <Label htmlFor="structure-test">Test Structure Field</Label>
                    <Input 
                        id="structure-test" 
                        placeholder="Enter some structure data"
                        value={data.structure[0] || ""}
                        onChange={(e) => onUpdate({ structure: [e.target.value] })}
                    />
                </div>
            </CardContent>
        </Card>
    )
}

const UniversesTab = ({ 
    data, 
    onUpdate,
    onSubmit,
    onCancel
}: { 
    data: ELearningData;
    onUpdate: (updates: Partial<ELearningData>) => void;
    onSubmit: () => void;
    onCancel: () => void;
}) => {
    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle>Assign Universes</CardTitle>
                    <CardDescription>
                        Select which universes can access this e-learning
                    </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="universes-test">Test Universes Field</Label>
                        <Input 
                            id="universes-test" 
                            placeholder="Enter some universe data"
                            value={data.universes[0] || ""}
                            onChange={(e) => onUpdate({ universes: [e.target.value] })}
                        />
                    </div>
                </CardContent>
            </Card>
            <div className="flex gap-4 justify-end mt-6">
                <Button type="button" variant="outline" onClick={onCancel}>
                    Cancel
                </Button>
                <Button type="button" variant="primary" onClick={onSubmit}>
                    Create E-Learning
                </Button>
            </div>
        </>
    )
}
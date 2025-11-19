"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { CreateELearningDto, CreateStepDto, BlockAssignmentDto, BlockType } from "@/types";
import { updateELearning } from "@/lib/api/elearnings";
import {
  Card,
  CardContent,
  CardDescription,
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

interface UpdateELearningPageProps {
    eLearningId: number;
    initialData: CreateELearningDto;
}

export function UpdateELearningPage({ 
    eLearningId,
    initialData 
}: UpdateELearningPageProps) {
    const router = useRouter();
    const [formData, setFormData] = useState<CreateELearningDto>(initialData);

    // Update form data from any tab
    const updateFormData = (updates: Partial<CreateELearningDto>) => {
        setFormData(prev => ({ ...prev, ...updates }));
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
            const updatedELearning = await updateELearning(eLearningId, formData);
            console.log("E-learning updated successfully:", updatedELearning);
            router.push("/");
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
                <h1 className="text-2xl font-bold text-background">
                    Edit E-Learning
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
    data: CreateELearningDto;
    onUpdate: (updates: Partial<CreateELearningDto>) => void;
    onCancel: () => void;
}) => {
    const handleChange = (field: keyof CreateELearningDto, value: any) => {
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
                        Description
                    </label>
                    <textarea
                        id="description"
                        rows={4}
                        value={data.description || ""}
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
    data: CreateELearningDto;
    onUpdate: (updates: Partial<CreateELearningDto>) => void;
}) => {
    const addStep = () => {
        const newStep: CreateStepDto = {
            title: "",
            orderIndex: data.steps.length,
            blocks: []
        };
        onUpdate({ steps: [...data.steps, newStep] });
    };

    const updateStep = (index: number, updates: Partial<CreateStepDto>) => {
        const newSteps = [...data.steps];
        newSteps[index] = { ...newSteps[index], ...updates };
        onUpdate({ steps: newSteps });
    };

    const removeStep = (index: number) => {
        const newSteps = data.steps.filter((_, i) => i !== index);
        // Update order indices
        newSteps.forEach((step, i) => step.orderIndex = i);
        onUpdate({ steps: newSteps });
    };

    const addBlockToStep = (stepIndex: number) => {
        const newSteps = [...data.steps];
        const newBlock: BlockAssignmentDto = {
            orderIndex: newSteps[stepIndex].blocks.length,
            newBlock: {
                type: BlockType.VIDEO,
                headline: "",
                content: {}
            }
        };
        newSteps[stepIndex].blocks = [...newSteps[stepIndex].blocks, newBlock];
        onUpdate({ steps: newSteps });
    };

    const updateBlock = (stepIndex: number, blockIndex: number, updates: any) => {
        const newSteps = [...data.steps];
        const block = newSteps[stepIndex].blocks[blockIndex];
        if (block.newBlock) {
            newSteps[stepIndex].blocks[blockIndex] = {
                ...block,
                newBlock: { ...block.newBlock, ...updates }
            };
        }
        onUpdate({ steps: newSteps });
    };

    const removeBlock = (stepIndex: number, blockIndex: number) => {
        const newSteps = [...data.steps];
        newSteps[stepIndex].blocks = newSteps[stepIndex].blocks.filter((_, i) => i !== blockIndex);
        onUpdate({ steps: newSteps });
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>E-Learning Structure</CardTitle>
                <CardDescription>
                    Define steps and blocks for your e-learning course. At least one step is required.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {data.steps.map((step, stepIndex) => (
                    <div key={stepIndex} className="border border-border rounded-lg p-4 space-y-4">
                        <div className="flex justify-between items-start">
                            <h4 className="font-semibold">Step {stepIndex + 1}</h4>
                            <Button 
                                type="button" 
                                variant="destructive" 
                                size="sm"
                                onClick={() => removeStep(stepIndex)}
                            >
                                Remove Step
                            </Button>
                        </div>
                        
                        <div className="space-y-2">
                            <Label htmlFor={`step-title-${stepIndex}`}>Step Title *</Label>
                            <Input 
                                id={`step-title-${stepIndex}`}
                                placeholder="Enter step title"
                                value={step.title}
                                onChange={(e) => updateStep(stepIndex, { title: e.target.value })}
                            />
                        </div>

                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <Label>Blocks</Label>
                                <Button 
                                    type="button" 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => addBlockToStep(stepIndex)}
                                >
                                    Add Block
                                </Button>
                            </div>
                            
                            {step.blocks.map((block, blockIndex) => (
                                <div key={blockIndex} className="bg-muted p-3 rounded space-y-2">
                                    <div className="flex justify-between items-start">
                                        <span className="text-sm font-medium">Block {blockIndex + 1}</span>
                                        <Button 
                                            type="button" 
                                            variant="destructive" 
                                            size="sm"
                                            onClick={() => removeBlock(stepIndex, blockIndex)}
                                        >
                                            Remove
                                        </Button>
                                    </div>
                                    {block.newBlock && (
                                        <>
                                            <Input 
                                                placeholder="Block headline"
                                                value={block.newBlock.headline}
                                                onChange={(e) => updateBlock(stepIndex, blockIndex, { headline: e.target.value })}
                                            />
                                            <textarea
                                                placeholder="Block content (JSON format)"
                                                value={JSON.stringify(block.newBlock.content)}
                                                onChange={(e) => {
                                                    try {
                                                        const content = JSON.parse(e.target.value);
                                                        updateBlock(stepIndex, blockIndex, { content });
                                                    } catch {
                                                        // Keep typing until valid JSON
                                                    }
                                                }}
                                                className="w-full px-3 py-2 bg-background border border-input rounded text-sm font-mono"
                                                rows={3}
                                            />
                                        </>
                                    )}
                                    {block.existingBlockId && (
                                        <div className="text-sm text-muted-foreground">
                                            Existing Block ID: {block.existingBlockId}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
                
                {data.steps.length === 0 && (
                    <p className="text-muted-foreground text-center py-4">No steps added yet. Add at least one step.</p>
                )}
                
                <Button 
                    type="button" 
                    variant="outline" 
                    onClick={addStep}
                    className="w-full"
                >
                    Add Step
                </Button>
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
    data: CreateELearningDto;
    onUpdate: (updates: Partial<CreateELearningDto>) => void;
    onSubmit: () => void;
    onCancel: () => void;
}) => {
    const [universeInput, setUniverseInput] = useState("");

    const addUniverse = () => {
        const id = parseInt(universeInput);
        if (!isNaN(id) && !data.universeIds.includes(id)) {
            onUpdate({ universeIds: [...data.universeIds, id] });
            setUniverseInput("");
        }
    };

    const removeUniverse = (id: number) => {
        onUpdate({ universeIds: data.universeIds.filter(uId => uId !== id) });
    };

    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle>Assign Universes</CardTitle>
                    <CardDescription>
                        Select which universes can access this e-learning (enter universe IDs)
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex gap-2">
                        <Input 
                            type="number"
                            placeholder="Enter universe ID"
                            value={universeInput}
                            onChange={(e) => setUniverseInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && addUniverse()}
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
                                        <Button 
                                            type="button" 
                                            variant="destructive" 
                                            size="sm"
                                            onClick={() => removeUniverse(id)}
                                        >
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
                    Update E-Learning
                </Button>
            </div>
        </>
    )
}

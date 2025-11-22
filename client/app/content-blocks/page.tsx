'use client';
import { useState } from "react";
import { BlockCard } from "@/components/block-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BlockType, StepBlockDTO, CreateStepDto } from "@/types";
import { generateOutputJSON } from "@/lib/step-builder-utils";
import { Trash2 } from "lucide-react";


export default function ContentstepBlocks() {
    const [steps, setSteps] = useState<CreateStepDto[]>([]);
    const [draggedBlockType, setDraggedBlockType] = useState<BlockType | null>(null);

    // Add new step
    const addStep = () => {
        const newStep: CreateStepDto = {
            title: "",
            orderIndex: steps.length,
            stepBlocks: []
        };
        setSteps([...steps, newStep]);
    };

    // Update step title
    const updateStepTitle = (stepIndex: number, title: string) => {
        const newSteps = [...steps];
        newSteps[stepIndex].title = title;
        setSteps(newSteps);
    };

    // Remove step
    const removeStep = (stepIndex: number) => {
        const newSteps = steps.filter((_, i) => i !== stepIndex);
        // Recalculate orderIndex
        newSteps.forEach((step, i) => step.orderIndex = i);
        setSteps(newSteps);
    };

    // Drag handlers for stepBlocks
    const handleDragStart = (blockType: BlockType) => {
        setDraggedBlockType(blockType);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };

    const handleDrop = (e: React.DragEvent, stepIndex: number) => {
        e.preventDefault();
        if (!draggedBlockType) return;

        const newSteps = [...steps];
        const newStepBlock: StepBlockDTO = {
            newBlock: {
                type: draggedBlockType,
                headline: "",
                description: "",
                content: {}
            },
            orderIndex: newSteps[stepIndex].stepBlocks.length
        };
        
        // Create new stepBlocks array instead of mutating (.push)
        newSteps[stepIndex] = {
            ...newSteps[stepIndex],
            stepBlocks: [...newSteps[stepIndex].stepBlocks, newStepBlock]
        };
        
        setSteps(newSteps);
        setDraggedBlockType(null);
    };

    // Remove block from step
    const removeBlock = (stepIndex: number, blockIndex: number) => {
        const newSteps = [...steps];
        newSteps[stepIndex].stepBlocks = newSteps[stepIndex].stepBlocks.filter((_, i) => i !== blockIndex);
        // Recalculate orderIndex for remaining stepBlocks
        newSteps[stepIndex].stepBlocks.forEach((stepBlock, i) => stepBlock.orderIndex = i);
        setSteps(newSteps);
    };

    return (
        <div className="page-wrapper">
            <div className="space-y-8">
                {/* Block palette */}
                <div>
                    <h3 className="text-lg font-semibold mb-3">Available stepBlocks (Drag to add)</h3>
                    <div className="flex gap-4 flex-wrap">
                        {Object.values(BlockType).map(type => (
                                <div
                                    key={type}
                                    draggable
                                    onDragStart={() => handleDragStart(type)}
                                >
                                    <BlockCard type={type} />
                                </div>
                            ))}
                    </div>
                </div>

                {/* Steps */}
                <div className="space-y-6">
                    <h3 className="text-lg font-semibold">Steps</h3>
                    
                    {steps.map((step, stepIndex) => (
                        <div 
                            key={stepIndex} 
                            className="flex"
                        >
                            <div className="justify-center flex items-center mr-3">
                                <span className="font-medium text-gray-600">{stepIndex + 1}.</span>
                            </div>

                            <div className="flex-1 space-y-2">
                                <div className="flex gap-2 items-center">
                                    <Input
                                        placeholder={`Enter step ${stepIndex + 1} title`}
                                        className="bg-white flex-1"
                                        value={step.title}
                                        onChange={(e) => updateStepTitle(stepIndex, e.target.value)}
                                    />
                                    <Button
                                        type="button"
                                        variant="destructive"
                                        size="sm"
                                        onClick={() => removeStep(stepIndex)}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            
                                <div
                                    className="p-4 border-2 border-gray-500 rounded-lg min-h-[100px]"
                                    onDragOver={handleDragOver}
                                    onDrop={(e) => handleDrop(e, stepIndex)}
                                >
                                    {step.stepBlocks.length === 0 ? (
                                        <div className="flex items-center justify-center h-20 text-muted-foreground">
                                            Drop stepBlocks here
                                        </div>
                                    ) : (
                                        <div className="flex gap-4 flex-wrap">
                                            {step.stepBlocks.map((stepBlock, blockIndex) => (
                                                <div key={blockIndex} className="relative group">
                                                    <BlockCard type={stepBlock.newBlock.type} />
                                                    <Button
                                                        type="button"
                                                        variant="destructive"
                                                        size="sm"
                                                        className="absolute -top-2 -right-2 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                                        onClick={() => removeBlock(stepIndex, blockIndex)}
                                                    >
                                                        <Trash2 className="h-3 w-3" />
                                                    </Button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Add Step Button */}
                <Button
                    type="button"
                    variant="outline"
                    onClick={addStep}
                    className="w-full"
                >
                    Add Step
                </Button>

                {/* JSON Output Preview */}
                {steps.length > 0 && (
                    <div className="mt-8">
                        <h3 className="text-lg font-semibold mb-3">Output JSON Preview</h3>
                        <pre className="bg-gray-100 p-4 rounded-lg overflow-auto max-h-96 text-sm">
                            {JSON.stringify(generateOutputJSON(steps), null, 2)}
                        </pre>
                    </div>
                )}
            </div>
        </div>
    );
}



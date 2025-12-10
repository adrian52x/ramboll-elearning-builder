"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { CreateELearningDto, CreateStepDto, BlockType, StepBlockDTO, CreateBlockDto, Block } from "@/types";
import { BlockCard } from "@/components/cards/block-card";
import { BlockConfigModal } from "@/components/block-modal";
import { BlockModalMode } from "@/types/ui-state";
import { getAllBlocks } from "@/lib/api/blocks";
import { Trash2 } from "lucide-react";

interface StructureTabProps {
    data: CreateELearningDto;
    onUpdate: (updates: Partial<CreateELearningDto>) => void;
}

export const StructureTab = ({ data, onUpdate }: StructureTabProps) => {
    const [existingBlocks, setExistingBlocks] = useState<Block[]>([]);
    const [loadingBlocks, setLoadingBlocks] = useState(true);
    const [draggedBlockType, setDraggedBlockType] = useState<BlockType | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedBlock, setSelectedBlock] = useState<{
        stepIndex: number;
        blockIndex: number;
    } | null>(null);
    const [modalBlockType, setModalBlockType] = useState<BlockType | null>(null);

    useEffect(() => {
        const fetchBlocks = async () => {
            try {
                const blocks = await getAllBlocks();
                setExistingBlocks(blocks);
            } catch (error) {
                console.error('Failed to fetch blocks:', error);
            } finally {
                setLoadingBlocks(false);
            }
        };
        fetchBlocks();
    }, []);

    const addStep = () => {
        const newStep: CreateStepDto = {
            title: "",
            orderIndex: data.steps.length,
            stepBlocks: [],
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
        newSteps.forEach((step, i) => (step.orderIndex = i));
        onUpdate({ steps: newSteps });
    };

    // Drag handlers for blocks
    const handleDragStart = (blockType: BlockType) => {
        setDraggedBlockType(blockType);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };

    const handleDrop = (e: React.DragEvent, stepIndex: number) => {
        e.preventDefault();
        if (!draggedBlockType) return;

        const newSteps = [...data.steps];
        const newStepBlock: StepBlockDTO = {
            newBlock: {
                type: draggedBlockType,
                headline: "",
                description: "",
            },
            orderIndex: newSteps[stepIndex].stepBlocks.length,
        };

        newSteps[stepIndex] = {
            ...newSteps[stepIndex],
            stepBlocks: [...newSteps[stepIndex].stepBlocks, newStepBlock],
        };

        onUpdate({ steps: newSteps });
        setDraggedBlockType(null);
    };

    const removeBlock = (stepIndex: number, blockIndex: number) => {
        const newSteps = [...data.steps];
        newSteps[stepIndex].stepBlocks = newSteps[stepIndex].stepBlocks.filter((_, i) => i !== blockIndex);
        // Recalculate orderIndex for remaining blocks
        newSteps[stepIndex].stepBlocks.forEach((stepBlock, i) => (stepBlock.orderIndex = i));
        onUpdate({ steps: newSteps });
    };

    const handleBlockClick = (stepIndex: number, blockIndex: number) => {
        const block = data.steps[stepIndex].stepBlocks[blockIndex];

        // Get type from either newBlock or existing block
        let blockType: BlockType | undefined;

        if (block.existingBlockId !== undefined) {
            const existingBlock = existingBlocks.find((b) => b.id === block.existingBlockId);
            blockType = existingBlock?.type;
        } else {
            blockType = block.newBlock?.type;
        }

        if (!blockType) return;

        setSelectedBlock({ stepIndex, blockIndex });
        setModalBlockType(blockType);
        setIsModalOpen(true);
    };

    const handleModalSave = (saveData: { mode: BlockModalMode; blockData?: CreateBlockDto; existingBlockId?: number }) => {
        if (!selectedBlock) return;

        const newSteps = [...data.steps];
        const { stepIndex, blockIndex } = selectedBlock;

        if (saveData.mode === BlockModalMode.EXISTING && saveData.existingBlockId) {
            // Use existing block
            newSteps[stepIndex].stepBlocks[blockIndex] = {
                existingBlockId: saveData.existingBlockId,
                orderIndex: newSteps[stepIndex].stepBlocks[blockIndex].orderIndex,
            };
        } else if (saveData.mode === BlockModalMode.NEW && saveData.blockData) {
            // Create new block with filled data
            newSteps[stepIndex].stepBlocks[blockIndex] = {
                newBlock: saveData.blockData,
                orderIndex: newSteps[stepIndex].stepBlocks[blockIndex].orderIndex,
            };
        }

        onUpdate({ steps: newSteps });
        setSelectedBlock(null);
    };

    return (
        <Card>
            <CardHeader className="justify-center items-center sticky top-[-20px] z-5">
                <div className="flex gap-4 flex-wrap border-b-2 border-background rounded-lg shadow-xl p-3 bg-white w-full">
                    {Object.values(BlockType).map((type) => (
                        <div key={type} draggable onDragStart={() => handleDragStart(type)}>
                            <BlockCard type={type} />
                        </div>
                    ))}
                </div>
            </CardHeader>
            <div className="flex justify-center w-full">
                <span className="text-muted-foreground">Available Blocks (Drag to add)</span>
            </div>
            <CardContent className="space-y-6">
                {/* Steps */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold">Steps</h3>
                        <Button className="z-10" type="button" variant="outline" onClick={addStep}>
                            Add Step
                        </Button>
                    </div>

                    {data.steps.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">
                            No steps yet. Click "Add Step" to get started.
                        </div>
                    ) : (
                        data.steps.map((step, stepIndex) => (
                            <div key={stepIndex} className="flex">
                                <div className="justify-center flex items-center mr-3">
                                    <span className="font-medium text-gray-600">{stepIndex + 1}.</span>
                                </div>

                                <div className="flex-1 space-y-2">
                                    <div className="flex gap-2 items-center">
                                        <Input
                                            placeholder={`Enter step ${stepIndex + 1} title`}
                                            className="flex-1"
                                            value={step.title}
                                            onChange={(e) => updateStep(stepIndex, { title: e.target.value })}
                                        />
                                        <Button className="z-10" type="button" variant="destructive" size="sm" onClick={() => removeStep(stepIndex)}>
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>

                                    {/* Step Drop Area */}
                                    <div
                                        className="p-4 border-2 border-gray-500 rounded-lg min-h-[100px]"
                                        onDragOver={handleDragOver}
                                        onDrop={(e) => handleDrop(e, stepIndex)}
                                    >
                                        {step.stepBlocks.length === 0 ? (
                                            <div className="flex items-center justify-center h-20 text-muted-foreground">Drop blocks here</div>
                                        ) : (
                                            <div className="flex gap-4 flex-wrap">
                                                {step.stepBlocks.map((stepBlock, blockIndex) => {
                                                    const isExisting = stepBlock.existingBlockId !== undefined;
                                                    const existingBlock = isExisting
                                                        ? existingBlocks.find((b) => b.id === stepBlock.existingBlockId)
                                                        : null;
                                                    const blockType = existingBlock?.type || stepBlock.newBlock?.type;

                                                    if (!blockType) return null;

                                                    return (
                                                        <div
                                                            key={blockIndex}
                                                            className="relative group cursor-pointer"
                                                            onClick={() => handleBlockClick(stepIndex, blockIndex)}
                                                        >
                                                            <BlockCard type={blockType} headline={existingBlock?.headline || stepBlock.newBlock?.headline} variant="default" />
                                                            {/* {existingBlock && (
                                                                <div className="absolute bottom-1 left-1 right-1 bg-background/90 text-white text-xs px-1 rounded text-center truncate">
                                                                    {existingBlock.headline}
                                                                </div>
                                                            )}
                                                            {stepBlock.newBlock && stepBlock.newBlock.headline && (
                                                                <div className="absolute bottom-1 left-1 right-1 bg-background/90 text-white text-xs px-1 rounded text-center truncate">
                                                                    {stepBlock.newBlock.headline}
                                                                </div>
                                                            )} */}
                                                            <Button
                                                                type="button"
                                                                variant="destructive"
                                                                size="sm"
                                                                className="absolute -top-2 -right-2 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    removeBlock(stepIndex, blockIndex);
                                                                }}
                                                            >
                                                                <Trash2 className="h-3 w-3" />
                                                            </Button>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Block Configuration Modal */}
                <BlockConfigModal
                    key={selectedBlock ? `${selectedBlock.stepIndex}-${selectedBlock.blockIndex}` : "new"}
                    isOpen={isModalOpen}
                    onClose={() => {
                        setIsModalOpen(false);
                        setSelectedBlock(null);
                        setModalBlockType(null);
                    }}
                    blockType={modalBlockType}
                    initialData={selectedBlock ? data.steps[selectedBlock.stepIndex].stepBlocks[selectedBlock.blockIndex].newBlock : undefined}
                    initialExistingBlockId={
                        selectedBlock ? data.steps[selectedBlock.stepIndex].stepBlocks[selectedBlock.blockIndex].existingBlockId : undefined
                    }
                    existingBlocks={existingBlocks}
                    onSave={handleModalSave}
                />
            </CardContent>
        </Card>
    );
};

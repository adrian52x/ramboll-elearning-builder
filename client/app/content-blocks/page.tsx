"use client";
import { useState } from "react";
import { BlockCard } from "@/components/block-card";
import { BlockConfigModal } from "@/components/block-modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BlockType, StepBlockDTO, CreateStepDto, CreateBlockDto } from "@/types";
import { generateOutputJSON } from "@/lib/step-builder-utils";
import { Trash2 } from "lucide-react";
import { BlockModalMode } from "@/types/ui-state";
import { mockExistingBlocks } from "@/data/blocks";

export default function ContentstepBlocks() {
    const [steps, setSteps] = useState<CreateStepDto[]>([]);
    const [draggedBlockType, setDraggedBlockType] = useState<BlockType | null>(null);

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedBlock, setSelectedBlock] = useState<{
        stepIndex: number;
        blockIndex: number;
    } | null>(null);
    const [modalBlockType, setModalBlockType] = useState<BlockType | null>(null);

    // Add new step
    const addStep = () => {
        const newStep: CreateStepDto = {
            title: "",
            orderIndex: steps.length,
            stepBlocks: [],
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
        newSteps.forEach((step, i) => (step.orderIndex = i));
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

        // Add a placeholder block
        const newSteps = [...steps];
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

        setSteps(newSteps);

        // Open modal on block Dropped - disabled for now
        // setSelectedBlock({ stepIndex, blockIndex: newSteps[stepIndex].stepBlocks.length - 1 });
        // setModalBlockType(draggedBlockType);
        // setIsModalOpen(true);

        setDraggedBlockType(null);
    };

    // Remove block from step
    const removeBlock = (stepIndex: number, blockIndex: number) => {
        const newSteps = [...steps];
        newSteps[stepIndex].stepBlocks = newSteps[stepIndex].stepBlocks.filter((_, i) => i !== blockIndex);
        // Recalculate orderIndex for remaining stepBlocks
        newSteps[stepIndex].stepBlocks.forEach((stepBlock, i) => (stepBlock.orderIndex = i));
        setSteps(newSteps);
    };

    // Handle clicking on a block to edit it
    const handleBlockClick = (stepIndex: number, blockIndex: number) => {
        const block = steps[stepIndex].stepBlocks[blockIndex];

        // Get type from either newBlock or existing block
        let blockType: BlockType | undefined;

        if (block.existingBlockId !== undefined) {
            const existingBlock = mockExistingBlocks.find((b) => b.id === block.existingBlockId);
            blockType = existingBlock?.type;
        } else {
            blockType = block.newBlock?.type;
        }

        if (!blockType) return;

        setSelectedBlock({ stepIndex, blockIndex });
        setModalBlockType(blockType);
        setIsModalOpen(true);
    };

    // Handle saving block configuration from modal
    const handleModalSave = (data: { mode: BlockModalMode; blockData?: CreateBlockDto; existingBlockId?: number }) => {
        if (!selectedBlock) return;

        const newSteps = [...steps];
        const { stepIndex, blockIndex } = selectedBlock;

        if (data.mode === BlockModalMode.EXISTING && data.existingBlockId) {
            // Use existing block
            newSteps[stepIndex].stepBlocks[blockIndex] = {
                existingBlockId: data.existingBlockId,
                orderIndex: newSteps[stepIndex].stepBlocks[blockIndex].orderIndex,
            };
        } else if (data.mode === BlockModalMode.NEW && data.blockData) {
            // Create new block with filled data
            newSteps[stepIndex].stepBlocks[blockIndex] = {
                newBlock: data.blockData,
                orderIndex: newSteps[stepIndex].stepBlocks[blockIndex].orderIndex,
            };
        }

        setSteps(newSteps);
        setSelectedBlock(null);
    };

    return (
        <div className="page-wrapper">
            <div className="space-y-8">
                {/* Block palette */}
                <div>
                    <h3 className="text-lg font-semibold mb-3">Available stepBlocks (Drag to add)</h3>
                    <div className="flex gap-4 flex-wrap">
                        {Object.values(BlockType).map((type) => (
                            <div key={type} draggable onDragStart={() => handleDragStart(type)}>
                                <BlockCard type={type} />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Steps */}
                <div className="space-y-6">
                    <h3 className="text-lg font-semibold">Steps</h3>

                    {steps.map((step, stepIndex) => (
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
                                        onChange={(e) => updateStepTitle(stepIndex, e.target.value)}
                                    />
                                    <Button type="button" variant="destructive" size="sm" onClick={() => removeStep(stepIndex)}>
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>

                                {/* Step (Row) Drop Area */}
                                <div className="p-4 border-2 border-gray-500 rounded-lg min-h-[100px]" onDragOver={handleDragOver} onDrop={(e) => handleDrop(e, stepIndex)}>
                                    {step.stepBlocks.length === 0 ? (
                                        <div className="flex items-center justify-center h-20 text-muted-foreground">Drop stepBlocks here</div>
                                    ) : (
                                        <div className="flex gap-4 flex-wrap">
                                            {/* Blocks inside each step */}
                                            {step.stepBlocks.map((stepBlock, blockIndex) => {
                                                // Determine block type from newBlock or existing block
                                                // TO DO : move this to a utility function later
                                                const isExisting = stepBlock.existingBlockId !== undefined;
                                                const existingBlock = isExisting ? mockExistingBlocks.find((b) => b.id === stepBlock.existingBlockId) : null;
                                                const blockType = existingBlock?.type || stepBlock.newBlock?.type;

                                                if (!blockType) return null;

                                                return (
                                                    <div key={blockIndex} className="relative group cursor-pointer" onClick={() => handleBlockClick(stepIndex, blockIndex)}>
                                                        <BlockCard type={blockType} />
                                                        {/* TO DO // Rething maybe this later */}
                                                        {existingBlock && (
                                                            <div className="absolute bottom-1 left-1 right-1 bg-background/90 text-white text-xs px-1 rounded text-center truncate">
                                                                {existingBlock.headline}
                                                            </div>
                                                        )}
                                                        {stepBlock.newBlock && stepBlock.newBlock.headline && (
                                                            <div className="absolute bottom-1 left-1 right-1 bg-background/90 text-white text-xs px-1 rounded text-center truncate">
                                                                {stepBlock.newBlock.headline}
                                                            </div>
                                                        )}
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
                    ))}
                </div>

                {/* Add Step Button */}
                <Button type="button" variant="outline" onClick={addStep} className="w-full">
                    Add Step
                </Button>

                {/* JSON Output Preview */}
                {steps.length > 0 && (
                    <div className="mt-8">
                        <h3 className="text-lg font-semibold mb-3">Output JSON Preview</h3>
                        <pre className="bg-gray-100 p-4 rounded-lg overflow-auto max-h-96 text-sm">{JSON.stringify(generateOutputJSON(steps), null, 2)}</pre>
                    </div>
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
                // TO DO : Send StepBlockDTO object instead of initialData + initialExistingBlockId
                blockType={modalBlockType}
                initialData={selectedBlock ? steps[selectedBlock.stepIndex].stepBlocks[selectedBlock.blockIndex].newBlock : undefined}
                initialExistingBlockId={selectedBlock ? steps[selectedBlock.stepIndex].stepBlocks[selectedBlock.blockIndex].existingBlockId : undefined}
                existingBlocks={mockExistingBlocks}
                onSave={handleModalSave}
            />
        </div>
    );
}

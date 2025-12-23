"use client";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ELearningById } from "@/types";
import { BlockPreview } from "./BlockPreview";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { StepArrow } from "../ui/step-arrow";


interface ELearningPreviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    elearning: ELearningById | null;
}

/**
 * Modal for previewing a complete e-learning with step navigation
 */
export function ELearningPreviewModal({ isOpen, onClose, elearning }: ELearningPreviewModalProps) {
    const [currentStepIndex, setCurrentStepIndex] = useState(0);

    if (!elearning) return null;

    const currentStep = elearning.steps[currentStepIndex];
    const totalSteps = elearning.steps.length;
    const currentStepBlocks = currentStep?.stepBlocks || [];

    const handleNext = () => {
        if (currentStepIndex < totalSteps - 1) {
            setCurrentStepIndex((prev) => prev + 1);
        }
    };

    const handlePrevious = () => {
        if (currentStepIndex > 0) {
            setCurrentStepIndex((prev) => prev - 1);
        }
    };

    const isFirstStep = currentStepIndex === 0;
    const isLastStep = currentStepIndex === totalSteps - 1;

    const handleClose = () => {
        setCurrentStepIndex(0);
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="h-[90vh] w-[80vw] flex flex-col">
                <DialogHeader>
                    <DialogTitle className="text-sm">{elearning.title}</DialogTitle>
                    
                    {/* Step Navigation Arrows */}
                    <div className="flex items-center justify-center gap-8">
                        {elearning.steps.map((step, index) => (
                            <StepArrow
                                onClick={() => setCurrentStepIndex(index)}
                                key={step.id}
                                size="sm"
                                className="cursor-pointer"
                                variant={index <= currentStepIndex ? "active" : "default"}
                            >
                                {index + 1}
                            </StepArrow>
                        ))}
                    </div>

                    {/* Step Title */}
                    <div className="flex items-center justify-center pt-2">
                        <h3 className="text-xl font-bold text-incept-secondary">{currentStep?.title}</h3>
                    </div>
                </DialogHeader>



                {/* Block Content - All blocks in step */}
                <div className="flex-1 overflow-y-auto px-6 space-y-3 pb-10">
                    {currentStepBlocks.length > 0 ? (
                        currentStepBlocks.map((stepBlock) => (
                            <BlockPreview 
                                key={stepBlock.id}
                                block={stepBlock.block}
                                defaultExpanded={false}
                            />
                        ))
                    ) : (
                        <div className="flex items-center justify-center h-full">
                            <p className="text-muted-foreground">No blocks available in this step</p>
                        </div>
                    )}
                </div>

                {/* Navigation Footer */}
                <div className="flex items-center justify-between px-6 h-5">
                    <Button
                        variant="outline"
                        onClick={handlePrevious}
                        disabled={isFirstStep}
                    >
                        <ChevronLeft className="h-4 w-4 mr-1" />
                        Previous Step
                    </Button>

                    <div className="text-sm text-muted-foreground">
                        Step {currentStepIndex + 1} of {totalSteps}
                    </div>

                    <Button
                        variant="outline"
                        onClick={handleNext}
                        disabled={isLastStep}
                    >
                        Next Step
                        <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}

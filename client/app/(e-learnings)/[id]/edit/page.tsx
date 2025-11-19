import React from "react";
import { UpdateELearningPage } from "@/templates/update-elearning-page";
import { fetchELearningById } from "@/lib/api/elearnings";

export default async function EditELearningPage({ 
    params 
}: { 
    params: Promise<{ id: string }> 
}) {
    const { id } = await params;
    
    try {
        // Fetch the e-learning data from API
        const eLearning = await fetchELearningById(parseInt(id));

        // Transform the API response to match form data structure
        const initialData = {
            title: eLearning.title,
            description: eLearning.description,
            steps: eLearning.steps.map(step => ({
                title: step.title,
                orderIndex: step.orderIndex,
                blocks: step.stepBlocks.map(sb => ({
                    existingBlockId: sb.block.id,
                    orderIndex: sb.orderIndex
                }))
            })),
            universeIds: eLearning.universeElearnings.map((ue) => ue.universe.id)
        };

        return (
            <UpdateELearningPage
                eLearningId={parseInt(id)}
                initialData={initialData}
            />
        );
    } catch (error) {
        console.error("Failed to fetch e-learning:", error);
        return (
            <div className="page-wrapper">
                <div className="text-destructive">
                    Failed to load e-learning. Please try again.
                </div>
            </div>
        );
    }
}

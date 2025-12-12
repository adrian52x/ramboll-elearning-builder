import React from "react";
import { UpdateELearningPage } from "@/templates/update-elearning-page";

export default async function EditELearningPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    return <UpdateELearningPage eLearningId={parseInt(id)} />;
}

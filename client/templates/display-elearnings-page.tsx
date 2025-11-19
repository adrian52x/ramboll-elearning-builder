"use client";

import { ELearningCard } from "@/components/e-learning-card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface ELearning {
    id: number;
    title: string;
    description: string;
    createdAt: string;
    updatedAt: string;
    universeElearnings: Array<{
        id: number;
        universe: {
            id: number;
            name: string;
        };
        eLearning: number;
        assignedAt: string;
    }>;
}
    
interface DisplayELearningsPageProps {
    eLearnings: ELearning[];
}

export function DisplayELearningsPage({ eLearnings }: DisplayELearningsPageProps) {
    const router = useRouter();

    const handleEdit = (id: number) => {
        console.log("Edit e-learning:", id);
        // TODO: Implement edit functionality
    };

    const handleDelete = (id: number) => {
        console.log("Delete e-learning:", id);
        // TODO: Implement delete functionality
    };

    const handleCreate = () => {
        router.push("/create");
    };

    return (
        <div className="page-wrapper">
            <div className="space-y-8">
                {/* Header */}
                <div className="flex justify-between items-start">
                    <div className="space-y-2">
                        <h1 className="text-2xl font-bold text-foreground">E-Learnings</h1>
                        <p className="text-muted-foreground">
                            Manage your e-learning courses and content.
                        </p>
                    </div>
                    
                    <Button className="shrink-0 bg-incept-primary" onClick={handleCreate}>
                        + Create New E-Learning
                    </Button>

                </div>

                {/* E-Learning Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {eLearnings.map((eLearning) => (
                        <ELearningCard
                            key={eLearning.id}
                            id={eLearning.id}
                            title={eLearning.title}
                            description={eLearning.description}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

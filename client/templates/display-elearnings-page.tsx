"use client";

import { ELearningCard } from "@/components/cards/e-learning-card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
//import { use } from "react";
import { useDeleteELearning } from "@/lib/hooks/useElearnings";
import { useGetElearnings } from "@/lib/hooks/useElearnings";

// interface DisplayELearningsPageProps {
//     eLearnings: ELearning[];
//     //eLearningsPromise: Promise<ELearning[]>;
// }

export function DisplayELearningsPage() {
    
    //const eLearnings = use(eLearningsPromise);

    const { elearnings } = useGetElearnings();
    const { deleteELearning } = useDeleteELearning();
    
    const router = useRouter();

    const handleEdit = (id: number) => {
        router.push(`/${id}/edit`);
    };

    const handleDelete = (id: number) => {
        if (!confirm(`Are you sure you want to delete this e-learning?`)) {
            return;
        }

        deleteELearning.mutate(id, {
            onSuccess: () => {
                alert(`E-Learning deleted successfully! ID: ${id}`);
            },
            onError: (error) => {
                alert(`Failed to delete e-learning: ${error instanceof Error ? error.message : 'Unknown error'}`);
            }
        });
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
                        <p className="text-muted-foreground">Manage your e-learning courses and content.</p>
                    </div>

                    <Button className="shrink-0" onClick={handleCreate}>
                        + Create New E-Learning
                    </Button>
                </div>

                {/* E-Learning Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {elearnings?.map((eLearning) => (
                        <ELearningCard
                            key={eLearning.id}
                            eLearning={eLearning}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

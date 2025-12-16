"use client";

import { useState, useMemo } from "react";
import { ELearningCard } from "@/components/cards/e-learning-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { ErrorMessage } from "@/components/ui/error-message";
import { useRouter } from "next/navigation";
import { useDeleteELearning, useGetElearnings } from "@/lib/hooks/useElearnings";
import { useGetUniverses } from "@/lib/hooks/useUniverses";
import { getErrorMessage } from "@/lib/api/error-handler";

// interface DisplayELearningsPageProps {
//     eLearnings: ELearning[];
//     //eLearningsPromise: Promise<ELearning[]>;
// }

export function DisplayELearningsPage() {
    // Filter states
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedUniverse, setSelectedUniverse] = useState<string>("all");

    const { elearnings, isPending, isError, error } = useGetElearnings();
    const { universes, isPending: isUniversesPending } = useGetUniverses();
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
                alert(`Failed to delete e-learning: ${getErrorMessage(error)}`);
            }
        });
    };

    const handleCreate = () => {
        router.push("/create");
    };

    // Filter e-learnings based on search term and universe
    const filteredELearnings = useMemo(() => {
        if (!elearnings) return [];
        return elearnings.filter((elearning) => {
            // Filter by search term (title or description)
            const matchesSearch = 
                searchTerm === "" ||
                elearning.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                elearning.description?.toLowerCase().includes(searchTerm.toLowerCase());

            // Filter by universe (check if e-learning is assigned to the selected universe)
            let matchesUniverse = false;
            if (selectedUniverse === "all") {
                matchesUniverse = true;
            } else if (selectedUniverse === "unassigned") {
                matchesUniverse = elearning.universeElearnings.length === 0;
            } else {
                matchesUniverse = elearning.universeElearnings?.some(obj => obj.universe.id.toString() === selectedUniverse) || false;
            }

            return matchesSearch && matchesUniverse;
        });
    }, [elearnings, searchTerm, selectedUniverse]);

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

                {/* Search and Filters */}
                <div className="bg-card border border-neutral-300 shadow-md rounded-md p-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Search Input */}
                        <div className="space-y-2">
                            <Label htmlFor="search">Search E-Learnings</Label>
                            <Input
                                id="search"
                                type="text"
                                placeholder="Search by title or description..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        {/* Universe Filter */}
                        <div className="space-y-2">
                            <Label htmlFor="universe">Search by Universe</Label>
                            <Select
                                id="universe"
                                value={selectedUniverse}
                                onChange={(e) => setSelectedUniverse(e.target.value)}
                                disabled={isUniversesPending}
                            >
                                <option value="all">All Universes</option>
                                <option value="unassigned">Unassigned</option>
                                <hr />
                                {universes?.map((universe) => (
                                    <option key={universe.id} value={universe.id.toString()}>
                                        {universe.name}
                                    </option>
                                ))}
                            </Select>
                        </div>
                    </div>

                    {/* Clear Filters Button */}
                    {(searchTerm || selectedUniverse !== "all") && (
                        <div className="flex justify-end">
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setSearchTerm("");
                                    setSelectedUniverse("all");
                                }}
                            >
                                Clear Filters
                            </Button>
                        </div>
                    )}
                </div>

                {/* Loading State */}
                {isPending && (
                    <div className="flex items-center justify-center py-12">
                        <Spinner size="lg" />
                    </div>
                )}

                {/* Error State */}
                {isError && (
                    <ErrorMessage
                        title="Failed to Load E-Learnings"
                        message={getErrorMessage(error)}
                    />
                )}

                {/* E-Learning Grid */}
                {!isPending && !isError && (
                    <>
                        {filteredELearnings.length === 0 ? (
                            <div className="text-center py-12 text-muted-foreground">
                                {elearnings?.length === 0 ? "No e-learnings available." : "No e-learnings match your filters."}
                            </div>
                        ) : (
                            <>
                                <div className="text-sm text-muted-foreground mb-2">
                                    Showing {filteredELearnings.length} of {elearnings?.length || 0} e-learning{(elearnings?.length || 0) !== 1 ? 's' : ''}
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                                    {filteredELearnings.map((eLearning) => (
                                        <ELearningCard
                                            key={eLearning.id}
                                            eLearning={eLearning}
                                            onEdit={handleEdit}
                                            onDelete={handleDelete}
                                        />
                                    ))}
                                </div>
                            </>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

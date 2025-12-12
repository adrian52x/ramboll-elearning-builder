"use client";
import { useState, useMemo } from "react";
import { BlockType } from "@/types/enums";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { BlockCard } from "@/components/cards/block-card";
import { Spinner } from "@/components/ui/spinner";
import { ErrorMessage } from "@/components/ui/error-message";
import { useGetBlocks } from "@/lib/hooks/useBlocks";
import { useGetELearningById, useGetElearnings } from "@/lib/hooks/useElearnings";
import { getErrorMessage } from "@/lib/api/error-handler";

export const DisplayBlocksPage = () => {
    // Filter states
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedBlockType, setSelectedBlockType] = useState<string>("all");
    const [selectedELearning, setSelectedELearning] = useState<string>("all");

    // Fetch all data with TanStack Query
    const { blocks, isPending: isBlocksPending, isError: isBlocksError, error: blocksError } = useGetBlocks();
    const { elearnings, isPending: isElearningsPending, isError: isElearningsError } = useGetElearnings();
    
    // Fetch selected e-learning details (only when one is selected)
    const { elearning: selectedELearningDetails, } = useGetELearningById(
        selectedELearning !== "all" ? parseInt(selectedELearning) : undefined
    );

    // Filter blocks based on search term, block type, and e-learning
    const filteredBlocks = useMemo(() => {
        if (!blocks) return [];
        return blocks.filter((block) => {
            // Filter by search term (headline or description)
            const matchesSearch = 
                searchTerm === "" ||
                block.headline?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                block.description?.toLowerCase().includes(searchTerm.toLowerCase());

            // Filter by block type
            const matchesBlockType = 
                selectedBlockType === "all" || 
                block.type === selectedBlockType;

            // Filter by e-learning (check if block is used in the selected e-learning)
            let matchesELearning = selectedELearning === "all";
            
            if (!matchesELearning && selectedELearningDetails) {
                // Get all block IDs used in the selected e-learning
                const blockIdsInELearning = new Set(
                    selectedELearningDetails.steps.flatMap(step =>
                        step.stepBlocks.map(sb => sb.block.id)
                    )
                );
                matchesELearning = blockIdsInELearning.has(block.id);
            }

            return matchesSearch && matchesBlockType && matchesELearning;
        });
    }, [blocks, searchTerm, selectedBlockType, selectedELearning, selectedELearningDetails]);

    return (
        <div className="page-wrapper">
            <div className="space-y-4">
                {/* Header */}
                <div className="flex justify-between items-start">
                    <div className="space-y-2">
                        <h1 className="text-2xl font-bold text-foreground">Content Blocks</h1>
                        <p className="text-muted-foreground">Manage your content blocks.</p>
                    </div>

                    <Button className="shrink-0" onClick={() => alert("Create New Content Block clicked")}>
                        + Create New Block
                    </Button>
                </div>

                {/* Search and Filters */}
                <div className="bg-card border border-neutral-300 shadow-md rounded-md p-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Search Input */}
                        <div className="space-y-2">
                            <Label htmlFor="search">Search Blocks</Label>
                            <Input
                                id="search"
                                type="text"
                                placeholder="Search by headline or description..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        {/* Block Type Filter */}
                        <div className="space-y-2">
                            <Label htmlFor="blockType">Block Type</Label>
                            <Select
                                id="blockType"
                                value={selectedBlockType}
                                onChange={(e) => setSelectedBlockType(e.target.value)}
                            >
                                <option value="all">All Types</option>
                                {Object.values(BlockType).map((type) => (
                                    <option key={type} value={type}>
                                        {type.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                                    </option>
                                ))}
                            </Select>
                        </div>

                        {/* E-Learning Filter */}
                        <div className="space-y-2">
                            <Label htmlFor="eLearning">E-Learning</Label>
                            <Select
                                id="eLearning"
                                value={selectedELearning}
                                onChange={(e) => setSelectedELearning(e.target.value)}
                                disabled={isElearningsPending}
                            >
                                <option value="all">All E-Learnings</option>
                                {elearnings?.map((eLearning) => (
                                    <option key={eLearning.id} value={eLearning.id.toString()}>
                                        {eLearning.title}
                                    </option>
                                ))}
                            </Select>
                        </div>
                    </div>

                    {/* Clear Filters Button */}
                    {(searchTerm || selectedBlockType !== "all" || selectedELearning !== "all") && (
                        <div className="flex justify-end">
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setSearchTerm("");
                                    setSelectedBlockType("all");
                                    setSelectedELearning("all");
                                }}
                            >
                                Clear Filters
                            </Button>
                        </div>
                    )}
                </div>

                {/* Blocks */}
                <div className="bg-card border border-neutral-300 shadow-md rounded-md p-6 space-y-6">
                    {/* Loading State */}
                    {isBlocksPending && (
                        <div className="flex items-center justify-center py-12">
                            <Spinner size="lg" />
                        </div>
                    )}

                    {/* Error State */}
                    {isBlocksError && (
                        <ErrorMessage
                            title="Failed to Load Blocks"
                            message={getErrorMessage(blocksError)}
                        />
                    )}

                    {/* Blocks Display */}
                    {!isBlocksPending && !isBlocksError && (
                        <>
                            {filteredBlocks.length === 0 ? (
                                <div className="text-center py-12 text-muted-foreground">
                                    {blocks?.length === 0 ? "No blocks available." : "No blocks match your filters."}
                                </div>
                            ) : (
                                <>
                                    <div className="text-sm text-muted-foreground mb-2">
                                        Showing {filteredBlocks.length} of {blocks?.length || 0} block{(blocks?.length || 0) !== 1 ? 's' : ''}
                                    </div>
                                    <div className="flex flex-wrap gap-4">
                                        {filteredBlocks.map((block) => (
                                            <BlockCard key={block.id} type={block.type} className="w-26 h-26" headline={block.headline} />
                                        ))}
                                    </div>
                                </>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

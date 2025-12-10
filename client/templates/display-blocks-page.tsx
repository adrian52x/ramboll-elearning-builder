"use client";
import { useState, useEffect, useMemo } from "react";
import { Block, ELearning, ELearningById } from "@/types/api-responses";
import { BlockType } from "@/types/enums";
import { getAllBlocks } from "@/lib/api/blocks";
import { fetchELearnings, fetchELearningById } from "@/lib/api/elearnings";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { BlockCard } from "@/components/cards/block-card";

export const DisplayBlocksPage = () => {
    const [blocks, setBlocks] = useState<Block[]>([]);
    const [eLearnings, setELearnings] = useState<ELearning[]>([]);
    const [selectedELearningDetails, setSelectedELearningDetails] = useState<ELearningById | null>(null);
    const [loadingBlocks, setLoadingBlocks] = useState(true);
    const [loadingELearnings, setLoadingELearnings] = useState(true);
    const [loadingELearningDetails, setLoadingELearningDetails] = useState(false);
    const [blocksError, setBlocksError] = useState<string | null>(null);
    const [eLearningsError, setELearningsError] = useState<string | null>(null);
    
    // Filter states
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedBlockType, setSelectedBlockType] = useState<string>("all");
    const [selectedELearning, setSelectedELearning] = useState<string>("all");

    useEffect(() => {
        const fetchData = async () => {
            // Fetch blocks
            try {
                const blocksData = await getAllBlocks();
                setBlocks(blocksData);
            } catch (err) {
                setBlocksError(err instanceof Error ? err.message : "Failed to fetch blocks");
            } finally {
                setLoadingBlocks(false);
            }

            // Fetch e-learnings
            try {
                const eLearningsData = await fetchELearnings();
                setELearnings(eLearningsData);
            } catch (err) {
                setELearningsError(err instanceof Error ? err.message : "Failed to fetch e-learnings");
            } finally {
                setLoadingELearnings(false);
            }
        };

        fetchData();
    }, []);

    // Fetch e-learning details when a specific e-learning is selected
    useEffect(() => {
        const fetchELearningDetails = async () => {
            if (selectedELearning === "all") {
                setSelectedELearningDetails(null);
                return;
            }

            setLoadingELearningDetails(true);
            try {
                const details = await fetchELearningById(parseInt(selectedELearning));
                setSelectedELearningDetails(details);
            } catch (err) {
                console.error("Failed to fetch e-learning details:", err);
                setSelectedELearningDetails(null);
            } finally {
                setLoadingELearningDetails(false);
            }
        };

        fetchELearningDetails();
    }, [selectedELearning]);

    // Filter blocks based on search term, block type, and e-learning
    const filteredBlocks = useMemo(() => {
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
                                disabled={loadingELearnings || loadingELearningDetails}
                            >
                                <option value="all">All E-Learnings</option>
                                {eLearnings.map((eLearning) => (
                                    <option key={eLearning.id} value={eLearning.id.toString()}>
                                        {eLearning.title}
                                    </option>
                                ))}
                            </Select>
                            {loadingELearningDetails && (
                                <p className="text-xs text-muted-foreground">Loading e-learning blocks...</p>
                            )}
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
                    {loadingBlocks && (
                        <div className="flex items-center justify-center py-12">
                            <div className="text-muted-foreground">Loading blocks...</div>
                        </div>
                    )}

                    {/* Error State */}
                    {blocksError && (
                        <div className="flex items-center justify-center py-12">
                            <div className="text-red-600">Error: {blocksError}</div>
                        </div>
                    )}

                    {/* Blocks Display */}
                    {!loadingBlocks && !blocksError && (
                        <>
                            {filteredBlocks.length === 0 ? (
                                <div className="text-center py-12 text-muted-foreground">
                                    {blocks.length === 0 ? "No blocks available." : "No blocks match your filters."}
                                </div>
                            ) : (
                                <>
                                    <div className="text-sm text-muted-foreground mb-2">
                                        Showing {filteredBlocks.length} of {blocks.length} block{blocks.length !== 1 ? 's' : ''}
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

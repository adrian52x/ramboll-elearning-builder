"use client";
import { useState, useEffect } from "react";
import { BlockCard } from "@/components/cards/block-card";
import { Block } from "@/types";
import { getAllBlocks } from "@/lib/api/blocks";
import { Button } from "@/components/ui/button";

export const DisplayBlocksPage = () => {
    const [blocks, setBlocks] = useState<Block[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchBlocks = async () => {
            try {
                const data = await getAllBlocks();
                setBlocks(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Failed to fetch blocks");
            } finally {
                setLoading(false);
            }
        };
        fetchBlocks();
    }, []);

    return (
        <div className="page-wrapper">
            <div className="space-y-8">
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

                {/* Loading State */}
                {loading && (
                    <div className="flex items-center justify-center py-12">
                        <div className="text-muted-foreground">Loading blocks...</div>
                    </div>
                )}

                {/* Error State */}
                {error && (
                    <div className="flex items-center justify-center py-12">
                        <div className="text-red-600">Error: {error}</div>
                    </div>
                )}

                {/* Blocks Display */}
                {!loading && !error && (
                    <>
                        {blocks.length === 0 ? (
                            <div className="text-center py-12 text-muted-foreground">No blocks available.</div>
                        ) : (
                            <div className="flex flex-wrap gap-4">
                                {blocks.map((block) => (
                                    <BlockCard key={block.id} type={block.type} className="w-26 h-26" headline={block.headline} />
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

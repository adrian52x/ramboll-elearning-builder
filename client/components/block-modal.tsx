'use client';
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Block, BlockType, CreateBlockDto } from "@/types";
import { Textarea } from "@/components/ui/textarea";
import { BlockModalMode } from "@/types/ui-state";

interface BlockConfigModalProps {
    isOpen: boolean;
    onClose: () => void;
    blockType: BlockType | null;
    initialData?: CreateBlockDto;
    initialExistingBlockId?: number;
    existingBlocks: Block[];
    onSave: (data: { mode: BlockModalMode; blockData?: CreateBlockDto; existingBlockId?: number }) => void;
}

export function BlockConfigModal({ 
    isOpen, 
    onClose, 
    blockType, 
    initialData,
    initialExistingBlockId,
    existingBlocks,
    onSave 
}: BlockConfigModalProps) {

    const [mode, setMode] = useState<BlockModalMode>(initialExistingBlockId ? BlockModalMode.EXISTING : BlockModalMode.NEW);
    const [selectedExistingBlock, setSelectedExistingBlock] = useState<number | null>(initialExistingBlockId || null);
    
    // Form state for new block
    const [headline, setHeadline] = useState(initialData?.headline || "");
    const [description, setDescription] = useState(initialData?.description || "");
    const [content, setContent] = useState<Record<string, any>>(initialData?.content || {});

    //console.log("selectedExistingBlock", selectedExistingBlock, initialExistingBlockId);
    

    if (!blockType) return null;

    const filteredExistingBlocks = existingBlocks.filter(b => b.type === blockType);

    const handleSave = () => {
        if (mode === BlockModalMode.EXISTING && selectedExistingBlock) {
            onSave({ mode: BlockModalMode.EXISTING, existingBlockId: selectedExistingBlock });
        } else {
            const blockData: CreateBlockDto = {
                type: blockType,
                headline,
                description,
                content
            };
            onSave({ mode: BlockModalMode.NEW, blockData });
        }
        handleClose();
    };

    const handleClose = () => {
        // Reset form
        setMode(BlockModalMode.NEW);
        setSelectedExistingBlock(null);
        setHeadline("");
        setDescription("");
        setContent({});
        onClose();
    };

    // Save block disabled button conditions
    const isNewBlockMissingInputs = mode === BlockModalMode.NEW && !headline;
    const isExistingBlockNotSelectedOrUnchanged = mode === BlockModalMode.EXISTING && (!selectedExistingBlock || selectedExistingBlock === initialExistingBlockId);

    const renderContentFields = () => {
        switch (blockType) {
            case BlockType.VIDEO:
                return (
                    <div className="space-y-2">
                        <Label htmlFor="video_url">Video URL</Label>
                        <Input
                            id="video_url"
                            placeholder="https://example.com/video.mp4"
                            value={content.video_url || ""}
                            onChange={(e) => setContent({ ...content, video_url: e.target.value })}
                        />
                    </div>
                );

            case BlockType.IMAGE:
                return (
                    <div className="space-y-2">
                        <Label htmlFor="image_urls">Image URLs (comma-separated)</Label>
                        <Textarea
                            id="image_urls"
                            placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
                            value={Array.isArray(content.image_urls) ? content.image_urls.join(', ') : ""}
                            onChange={(e) => setContent({ 
                                ...content, 
                                image_urls: e.target.value.split(',').map(url => url.trim()).filter(Boolean)
                            })}
                        />
                    </div>
                );

            case BlockType.INTERACTIVE_TABS:
                return (
                    <div className="space-y-2">
                        <Label>Interactive Tabs</Label>
                        <p className="text-sm text-gray-500">
                            Complex structure - will be implemented with dynamic form builder
                        </p>
                    </div>
                );

            case BlockType.FLIP_CARDS:
                return (
                    <div className="space-y-2">
                        <Label>Flip Cards</Label>
                        <p className="text-sm text-gray-500">
                            Complex structure - will be implemented with dynamic form builder
                        </p>
                    </div>
                );

            case BlockType.FEEDBACK_ACTIVITY:
                return (
                    <div className="space-y-2">
                        <Label htmlFor="question">Question</Label>
                        <Textarea
                            id="question"
                            placeholder="Enter your feedback question"
                            value={content.question || ""}
                            onChange={(e) => setContent({ ...content, question: e.target.value })}
                        />
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Configure {blockType.replace('_', ' ')} Block</DialogTitle>
                    <DialogDescription>
                        Create a new block or select an existing one
                    </DialogDescription>
                </DialogHeader>

                <Tabs value={mode} onValueChange={(v) => setMode(v as BlockModalMode)}>
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value={BlockModalMode.NEW}>Create New</TabsTrigger>
                        <TabsTrigger value={BlockModalMode.EXISTING}>
                            Use Existing ({filteredExistingBlocks.length})
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value={BlockModalMode.NEW} className="space-y-4 mt-4">
                        <div className="space-y-2">
                            <Label htmlFor="headline">Headline *</Label>
                            <Input
                                id="headline"
                                placeholder="Enter block headline"
                                value={headline}
                                onChange={(e) => setHeadline(e.target.value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                placeholder="Enter block description (optional)"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </div>

                        {renderContentFields()}
                    </TabsContent>

                    <TabsContent value={BlockModalMode.EXISTING} className="space-y-4 mt-4">
                        {filteredExistingBlocks.length === 0 ? (
                            <div className="text-center py-8 text-gray-500">
                                No existing {blockType.replace('_', ' ')} blocks available
                            </div>
                        ) : (
                            <div className="grid grid-cols-3 gap-3">
                                {filteredExistingBlocks.map(block => (
                                    <div
                                        key={block.id}
                                        onClick={() => setSelectedExistingBlock(block.id)}
                                        className={`
                                            p-3 border rounded-lg cursor-pointer transition-all 
                                            ${selectedExistingBlock === block.id 
                                                ? 'border-background bg-background/10' 
                                                : 'border-gray-300 hover:border-gray-400 bg-white'
                                            }
                                        `}
                                    >
                                        <div className="space-y-2">
                                            <h4 className="font-medium text-sm">{block.headline}</h4>
                                            {block.description && (
                                                <p className="text-xs text-gray-500 line-clamp-2">{block.description}</p>
                                            )}
                                            <span className="inline-block text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded">
                                                ID: {block.id}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </TabsContent>
                </Tabs>

                <DialogFooter>
                    <Button variant="outline" onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button 
                        onClick={handleSave}
                        disabled={isNewBlockMissingInputs || isExistingBlockNotSelectedOrUnchanged}
                    >
                        Save Block
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

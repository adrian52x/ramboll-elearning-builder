"use client";
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Block, BlockType, CreateBlockDto } from "@/types";
import { Textarea } from "@/components/ui/textarea";
import { BlockModalMode } from "@/types/ui-state";
import { VideoBlockForm, ImageBlockForm, InteractiveTabsForm, FlipCardsForm, FeedbackActivityForm } from "./block-modal-forms";
import { BlockCard } from "./cards/block-card";

interface BlockConfigModalProps {
    isOpen: boolean;
    onClose: () => void;
    blockType: BlockType | null;
    initialData?: CreateBlockDto;
    initialExistingBlockId?: number;
    existingBlocks: Block[];
    onSave: (data: { mode: BlockModalMode; blockData?: CreateBlockDto; existingBlockId?: number }) => void;
}

export function BlockConfigModal({ isOpen, onClose, blockType, initialData, initialExistingBlockId, existingBlocks, onSave }: BlockConfigModalProps) {
    const [mode, setMode] = useState<BlockModalMode>(initialExistingBlockId ? BlockModalMode.EXISTING : BlockModalMode.NEW);
    const [selectedExistingBlock, setSelectedExistingBlock] = useState<number | null>(initialExistingBlockId || null);

    // Form state for new block
    const [headline, setHeadline] = useState(initialData?.headline || "");
    const [description, setDescription] = useState(initialData?.description || "");

    // Type-specific fields
    const [videoUrl, setVideoUrl] = useState(initialData?.videoUrl || "");
    const [imageUrls, setImageUrls] = useState(initialData?.imageUrls || []);
    const [question, setQuestion] = useState(initialData?.question || "");
    const [tabs, setTabs] = useState(initialData?.tabs || []);
    const [cards, setCards] = useState(initialData?.cards || []);

    //console.log("selectedExistingBlock", selectedExistingBlock, initialExistingBlockId);

    if (!blockType) return null;

    const filteredExistingBlocks = existingBlocks.filter((b) => b.type === blockType);

    const handleSave = () => {
        if (mode === BlockModalMode.EXISTING && selectedExistingBlock) {
            onSave({ mode: BlockModalMode.EXISTING, existingBlockId: selectedExistingBlock });
        } else {
            const blockData: CreateBlockDto = {
                type: blockType,
                headline,
                description,
                ...(blockType === BlockType.VIDEO && { videoUrl: videoUrl }),
                ...(blockType === BlockType.IMAGE && { imageUrls: imageUrls }),
                ...(blockType === BlockType.INTERACTIVE_TABS && { tabs }),
                ...(blockType === BlockType.FLIP_CARDS && { cards }),
                ...(blockType === BlockType.FEEDBACK_ACTIVITY && { question }),
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
        setVideoUrl("");
        setImageUrls([]);
        setQuestion("");
        setTabs([]);
        setCards([]);
        onClose();
    };

    // Save block disabled button conditions
    // TO DO : Incomplete
    const isNewBlockMissingInputs = mode === BlockModalMode.NEW && !headline;

    const isExistingBlockNotSelectedOrUnchanged = mode === BlockModalMode.EXISTING && (!selectedExistingBlock || selectedExistingBlock === initialExistingBlockId);

    const renderContentFields = () => {
        switch (blockType) {
            case BlockType.VIDEO:
                return <VideoBlockForm videoUrl={videoUrl} onVideoUrlChange={setVideoUrl} />;

            case BlockType.IMAGE:
                return <ImageBlockForm imageUrls={imageUrls} onImageUrlsChange={setImageUrls} />;

            case BlockType.INTERACTIVE_TABS:
                return <InteractiveTabsForm tabs={tabs} onTabsChange={setTabs} />;

            case BlockType.FLIP_CARDS:
                return <FlipCardsForm cards={cards} onCardsChange={setCards} />;

            case BlockType.FEEDBACK_ACTIVITY:
                return <FeedbackActivityForm question={question} onQuestionChange={setQuestion} />;

            default:
                return null;
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Configure "{blockType}" Block</DialogTitle>
                    <DialogDescription>Create a new block or select an existing one</DialogDescription>
                </DialogHeader>

                <Tabs value={mode} onValueChange={(v) => setMode(v as BlockModalMode)}>
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value={BlockModalMode.NEW}>Create New</TabsTrigger>
                        <TabsTrigger value={BlockModalMode.EXISTING}>Use Existing ({filteredExistingBlocks.length})</TabsTrigger>
                    </TabsList>

                    <TabsContent value={BlockModalMode.NEW} className="space-y-4 mt-4">
                        <div className="space-y-2">
                            <Label htmlFor="headline">Headline *</Label>
                            <Input id="headline" placeholder="Enter block headline" value={headline} onChange={(e) => setHeadline(e.target.value)} />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea id="description" placeholder="Enter block description (optional)" value={description} onChange={(e) => setDescription(e.target.value)} />
                        </div>

                        {renderContentFields()}
                    </TabsContent>

                    <TabsContent value={BlockModalMode.EXISTING} className="space-y-4 mt-4">
                        {filteredExistingBlocks.length === 0 ? (
                            <div className="text-center py-8 text-gray-500">No existing {blockType} blocks available</div>
                        ) : (
                            <div className="flex flex-wrap gap-4">
                                {filteredExistingBlocks.map((block) => (
                                    <BlockCard
                                        key={block.id} 
                                        onClick={() => setSelectedExistingBlock(block.id)}
                                        type={block.type} 
                                        headline={block.headline}
                                        className={`w-26 h-26 ${selectedExistingBlock === block.id ? "ring-2 ring-primary ring-offset-2" : ""}`}
                                    />
                                ))}
                            </div>
                        )}
                    </TabsContent>
                </Tabs>

                <DialogFooter>
                    <Button variant="outline" onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button onClick={handleSave} disabled={isNewBlockMissingInputs || isExistingBlockNotSelectedOrUnchanged}>
                        Save Block
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

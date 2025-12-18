"use client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Block } from "@/types";
import { BlockPreview } from "./BlockPreview";
import { Badge } from "../ui/badge";

interface BlockPreviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    block: Block | null;
}

/**
 * Modal wrapper for previewing a single block
 */
export function BlockPreviewModal({ isOpen, onClose, block }: BlockPreviewModalProps) {
    if (!block) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="w-[80vw] h-[80vh] flex flex-col space-y-4">
                <DialogHeader>
                    <div className="flex items-center gap-2">
                        <DialogTitle>Block Preview</DialogTitle>
                        <Badge variant="secondary" className="text-xs">
                            {block.type}
                        </Badge>
                    </div>
                </DialogHeader>
                
                <div className="flex-1 overflow-y-auto">
                    <BlockPreview block={block} />
                </div>
            </DialogContent>
        </Dialog>
    );
}

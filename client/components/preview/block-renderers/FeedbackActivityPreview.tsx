"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Megaphone } from "lucide-react";

interface FeedbackActivityPreviewProps {
    description?: string;
    question: string;
}

export function FeedbackActivityPreview({ description, question }: FeedbackActivityPreviewProps) {
    return (
        <div className="space-y-4">
            <div className="p-2 grid grid-cols-2 gap-4 items-center">
                {description && <p className="text-sm">{description}</p>}
                <div className="bg-incept-green rounded-lg p-3 flex gap-3 items-center">
                    <Megaphone fill="white" className="w-10 h-10 flex-shrink-0"/>
                    <p className="text-foreground font-medium">{question}</p>
                </div>
            </div>

            <Card>
                <CardContent className=" space-y-4">
                    <Textarea
                        placeholder="Type your response here..."
                        rows={6}
                        className="resize-none h-24"
                    />
                    <div className="flex justify-end">
                        <Button className="py-1 bg-incept-primary rounded-xl">
                            Submit
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <p className="text-xs text-muted-foreground italic">
                * This is a preview. Submissions will not be saved.
            </p>
        </div>
    );
}

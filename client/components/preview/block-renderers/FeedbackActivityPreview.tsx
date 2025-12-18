"use client";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";

interface FeedbackActivityPreviewProps {
    description?: string;
    question: string;
}

export function FeedbackActivityPreview({ description, question }: FeedbackActivityPreviewProps) {
    const [feedback, setFeedback] = useState("");
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = () => {
        if (feedback.trim()) {
            setIsSubmitted(true);
            // In a real implementation, this would send to backend
        }
    };

    const handleReset = () => {
        setFeedback("");
        setIsSubmitted(false);
    };

    return (
        <div className="space-y-4">
            <>
                {description && <p className="text-muted-foreground">{description}</p>}
            </>

            <Card>
                <CardContent className="pt-6 space-y-4">
                    <div className="flex items-start gap-3">
                        <MessageSquare className="h-5 w-5 text-blue-600 mt-1 flex-shrink-0" />
                        <div className="flex-1 space-y-4">
                            <p className="text-foreground font-medium">{question}</p>

                            {!isSubmitted ? (
                                <>
                                    <Textarea
                                        placeholder="Type your response here..."
                                        value={feedback}
                                        onChange={(e) => setFeedback(e.target.value)}
                                        rows={6}
                                        className="resize-none"
                                    />
                                    <Button 
                                        onClick={handleSubmit} 
                                        disabled={!feedback.trim()}
                                        className="w-full sm:w-auto"
                                    >
                                        Submit Feedback
                                    </Button>
                                </>
                            ) : (
                                <div className="space-y-4">
                                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                        <p className="text-green-800 font-medium mb-2">✓ Feedback Submitted</p>
                                        <p className="text-green-700 text-sm whitespace-pre-wrap">{feedback}</p>
                                    </div>
                                    <Button 
                                        variant="outline" 
                                        onClick={handleReset}
                                        className="w-full sm:w-auto"
                                    >
                                        Edit Response
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>

            <p className="text-xs text-muted-foreground italic">
                * This is a preview. Submissions will not be saved.
            </p>
        </div>
    );
}

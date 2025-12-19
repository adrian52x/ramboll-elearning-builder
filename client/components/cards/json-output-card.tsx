"use client";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { CreateELearningDto } from "@/types";
import { generateOutputJSON } from "@/lib/elearning-builder-utils";

interface JsonOutputCardProps {
    formData: CreateELearningDto;
}

export function JsonOutputCard({ formData }: JsonOutputCardProps) {
    const [isExpanded, setIsExpanded] = useState<boolean>(false);

    return (
        <Card className="gap-2 py-2">
            <CardHeader className="flex items-center justify-between cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
                <CardTitle>JSON Output Preview</CardTitle>
                {isExpanded ? (
                    <ChevronUp className="h-12 w-12" />
                ) : (
                    <ChevronDown className="h-12 w-12" />
                )}
            </CardHeader>
            <CardContent>
                <div
                    className={cn(
                        "overflow-hidden transition-all duration-300",
                        isExpanded ? "max-h-[2000px]" : "max-h-0"
                    )}
                >
                    <pre className="bg-muted p-4 rounded-lg overflow-auto max-h-100 text-xs">
                        {JSON.stringify(generateOutputJSON(formData), null, 2)}
                    </pre>
                </div>
            </CardContent>
        </Card>
    );
}
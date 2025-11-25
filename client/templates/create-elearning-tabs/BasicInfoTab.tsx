"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { CreateELearningDto } from "@/types";

interface BasicInfoTabProps {
    data: CreateELearningDto;
    onUpdate: (updates: Partial<CreateELearningDto>) => void;
    onCancel: () => void;
}

export const BasicInfoTab = ({ data, onUpdate, onCancel }: BasicInfoTabProps) => {
    const handleChange = (field: keyof CreateELearningDto, value: any) => {
        onUpdate({ [field]: value });
    };

    return (
        <>
            <div className="bg-card border border-neutral-300 shadow-md rounded-md p-6 space-y-6">
                {/* Title */}
                <div className="space-y-2">
                    <label htmlFor="title" className="text-sm font-medium text-card-foreground">
                        Title *
                    </label>
                    <input
                        id="title"
                        type="text"
                        required
                        value={data.title}
                        onChange={(e) => handleChange("title", e.target.value)}
                        className="w-full px-3 py-2 bg-neutral-50 border border-input rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                        placeholder="Enter e-learning title"
                    />
                </div>

                {/* Description */}
                <div className="space-y-2">
                    <label htmlFor="description" className="text-sm font-medium text-card-foreground">
                        Description
                    </label>
                    <textarea
                        id="description"
                        rows={4}
                        value={data.description || ""}
                        onChange={(e) => handleChange("description", e.target.value)}
                        className="w-full px-3 py-2 bg-neutral-50 border border-input rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                        placeholder="Enter e-learning description"
                    />
                </div>
                {/* Image Upload Placeholder */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-card-foreground">Cover Image</label>
                    <div className="border-2 border-dashed border-input bg-neutral-50 rounded-lg p-8 text-center">
                        <p className="text-muted-foreground">Image upload coming soon...</p>
                    </div>
                </div>
            </div>
            {/* Action Buttons */}
            <div className="flex gap-4 justify-end mt-6">
                <Button type="button" variant="outline" onClick={onCancel}>
                    Cancel
                </Button>
            </div>
        </>
    );
};

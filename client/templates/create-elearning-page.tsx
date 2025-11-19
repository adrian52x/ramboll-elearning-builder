"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export function CreateELearningPage() {
    const router = useRouter();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // TODO: Implement form submission
        console.log("Create e-learning");
    };

    const handleCancel = () => {
        router.push("/");
    };

    return (
        <div className="page-wrapper">
            <div className="space-y-8">
                {/* Header */}
                <h1 className="text-2xl font-bold text-background">
                    Create New E-Learning
                </h1>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="bg-card border border-neutral-300 shadow-md rounded-md p-6 space-y-6">
                        {/* Title */}
                        <div className="space-y-2">
                            <label
                                htmlFor="title"
                                className="text-sm font-medium text-card-foreground"
                            >
                                Title *
                            </label>
                            <input
                                id="title"
                                type="text"
                                required
                                className="w-full px-3 py-2 bg-neutral-50 border border-input rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                                placeholder="Enter e-learning title"
                            />
                        </div>
        
                        {/* Description */}
                        <div className="space-y-2">
                            <label
                                htmlFor="description"
                                className="text-sm font-medium text-card-foreground"
                            >
                                Description *
                            </label>
                            <textarea
                                id="description"
                                required
                                rows={4}
                                className="w-full px-3 py-2 bg-neutral-50 border border-input rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                                placeholder="Enter e-learning description"
                            />
                        </div>

                        {/* Image Upload Placeholder */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-card-foreground">
                                Cover Image
                            </label>
                            <div className="border-2 border-dashed border-input bg-neutral-50 rounded-lg p-8 text-center">
                                <p className="text-muted-foreground">
                                    Image upload coming soon...
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-4 justify-end">
                        <Button type="button" variant="destructive" onClick={handleCancel}>
                            destructive
                        </Button>
                        <Button type="button" variant="secondary" onClick={handleCancel}>
                            secondary
                        </Button>
                        <Button type="button" variant="outline" onClick={handleCancel}>
                            Cancel
                        </Button>
                        <Button type="submit" variant="primary">
                            Create E-Learning
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}

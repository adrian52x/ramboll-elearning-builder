"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { UploadInput } from "@/components/ui/upload-input";
import { CreateELearningDto } from "@/types";
import { UploadAPI } from "@/lib/api/uploads";
import Image from "next/image";
import { ImageIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface BasicInfoTabProps {
    data: CreateELearningDto;
    onUpdate: (updates: Partial<CreateELearningDto>) => void;
    onCancel: () => void;
}

export const BasicInfoTab = ({ data, onUpdate, onCancel }: BasicInfoTabProps) => {
    const [uploading, setUploading] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);

    const handleChange = (field: keyof CreateELearningDto, value: any) => {
        onUpdate({ [field]: value });
    };

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
        if (!allowedTypes.includes(file.type)) {
            setUploadError('Only image files (JPG, PNG, GIF, WEBP) are allowed');
            return;
        }

        const maxSize = 10 * 1024 * 1024;
        if (file.size > maxSize) {
            setUploadError('File size must be less than 10MB');
            return;
        }

        setUploadError(null);
        setUploading(true);

        try {
            const url = await UploadAPI.uploadFile(file);
            handleChange("coverImage", url);
        } catch (err) {
            setUploadError(err instanceof Error ? err.message : 'Failed to upload image');
        } finally {
            setUploading(false);
        }
    };

    return (
        <>
            <div className="bg-card border border-neutral-300 shadow-md rounded-md p-6 space-y-6">
                {/* Title */}
                <div className="space-y-2">
                    <label htmlFor="title" className="text-sm font-medium text-card-foreground">
                        Title *
                    </label>
                    <Input
                        id="title"
                        type="text"
                        required
                        value={data.title}
                        onChange={(e) => handleChange("title", e.target.value)}
                        className="bg-neutral-50"
                        placeholder="Enter e-learning title"
                    />
                </div>

                {/* Description */}
                <div className="space-y-2">
                    <label htmlFor="description" className="text-sm font-medium text-card-foreground">
                        Description
                    </label>
                    <Textarea
                        id="description"
                        rows={4}
                        value={data.description || ""}
                        onChange={(e) => handleChange("description", e.target.value)}
                        className="bg-neutral-50"
                        placeholder="Enter e-learning description"
                    />
                </div>
                {/* Cover Image Upload */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-card-foreground">Cover Image *</label>
                    {uploadError && (
                        <div className="text-sm text-red-500 bg-red-50 p-2 rounded">
                            {uploadError}
                        </div>
                    )}
                    {!data.coverImage && (
                        <UploadInput
                            onFileSelect={handleFileUpload}
                            accept="image/*"
                            disabled={uploading}
                            title="Click to upload cover image"
                            description="JPG, PNG, GIF or WEBP (max 10MB)"
                        />
                    )}
                    <Input
                        placeholder="https://example.com/image.jpg"
                        value={data.coverImage}
                        onChange={(e) => handleChange("coverImage", e.target.value)}
                        disabled={uploading}
                        className="bg-neutral-50"
                    />
                    {uploading && (
                        <div className="flex items-center gap-2 text-sm text-blue-600">
                            <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                            <span>Uploading image...</span>
                        </div>
                    )}
                    {data.coverImage && !uploading && (
                        <div className="p-3 border rounded-lg bg-gray-50">
                            <div className="flex items-center gap-3">
                                <ImageIcon className="w-6 h-6 text-gray-600 shrink-0" />
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900">Image uploaded</p>
                                    <p className="text-xs text-gray-500 break-all overflow-hidden">{data.coverImage}</p>
                                </div>
                            </div>
                            <div className="flex items-center justify-center py-8">
                                <div className="relative w-48 h-48 rounded-full border-8 border-incept-green overflow-hidden flex items-center justify-center bg-white">
                                    <Image 
                                        src={data.coverImage} 
                                        alt="Cover image preview" 
                                        fill 
                                        className="object-cover" 
                                        unoptimized 
                                    />
                                </div>
                            </div>
                        </div>
                    )}
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

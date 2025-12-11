"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UploadInput } from "@/components/ui/upload-input";
import { useState } from "react";
import { UploadAPI } from "@/lib/api/uploads";
import Image from "next/image";

interface ImageBlockFormProps {
    imageUrls: string[];
    onImageUrlsChange: (urls: string[]) => void;
}

export function ImageBlockForm({ imageUrls, onImageUrlsChange }: ImageBlockFormProps) {
    const [uploading, setUploading] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);

    const addImageUrl = () => onImageUrlsChange([...imageUrls, ""]);
    
    const removeImageUrl = (index: number) => onImageUrlsChange(imageUrls.filter((_, i) => i !== index));
    
    const updateImageUrl = (index: number, value: string) => {
        const newUrls = [...imageUrls];
        newUrls[index] = value;
        onImageUrlsChange(newUrls);
    };

    const handleFileUpload = async (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        // Validate file type
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        if (!allowedTypes.includes(file.type)) {
            setError('Only image files (JPEG, PNG, GIF, WEBP) are allowed');
            return;
        }

        // Validate file size (10MB max)
        const maxSize = 10 * 1024 * 1024;
        if (file.size > maxSize) {
            setError('File size must be less than 10MB');
            return;
        }

        setError(null);
        setUploading(index);

        try {
            const url = await UploadAPI.uploadFile(file);
            updateImageUrl(index, url);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to upload image');
        } finally {
            setUploading(null);
        }
    };

    return (
        <div className="space-y-2">
            <Label>Images *</Label>
            {error && (
                <div className="text-sm text-red-500 bg-red-50 p-2 rounded">
                    {error}
                </div>
            )}
            <div className="space-y-4">
                {imageUrls.map((url, index) => (
                    <div key={index} className="space-y-2 p-4 border rounded-lg">
                        <div className="flex gap-2 items-start">
                            <div className="flex-1 space-y-2">
                                {!url && (
                                    <UploadInput
                                        onFileSelect={(e) => handleFileUpload(index, e)}
                                        accept="image/*"
                                        disabled={uploading === index}
                                        title="Click to upload image"
                                        description="PNG, JPG, GIF or WEBP (max 10MB)"
                                    />
                                )}
                                <Input
                                    placeholder="https://example.com/image.jpg"
                                    value={url}
                                    onChange={(e) => updateImageUrl(index, e.target.value)}
                                    disabled={uploading === index}
                                />
                            </div>
                            {imageUrls.length > 1 && (
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => removeImageUrl(index)}
                                    disabled={uploading === index}
                                >
                                    ×
                                </Button>
                            )}
                        </div>
                        {uploading === index && (
                            <div className="text-sm text-blue-500">
                                Uploading...
                            </div>
                        )}
                        {url && uploading !== index && (
                            <div className="relative w-full h-40 bg-gray-100 rounded">
                                <Image
                                    src={url}
                                    alt={`Preview ${index + 1}`}
                                    fill
                                    className="object-contain rounded"
                                    unoptimized
                                />
                            </div>
                        )}
                    </div>
                ))}
            </div>
            <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addImageUrl}
                className="w-full"
                disabled={uploading !== null}
            >
                + Add Image
            </Button>
        </div>
    );
}


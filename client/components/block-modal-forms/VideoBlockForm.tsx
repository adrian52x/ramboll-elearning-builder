"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { UploadInput } from "@/components/ui/upload-input";
import { useState } from "react";
import { uploadFile } from "@/lib/api/uploads";
import { Video } from "lucide-react";

interface VideoBlockFormProps {
    videoUrl: string;
    onVideoUrlChange: (url: string) => void;
}

export function VideoBlockForm({ videoUrl, onVideoUrlChange }: VideoBlockFormProps) {
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        // Validate file type
        const allowedTypes = ['video/mp4', 'video/webm', 'video/quicktime'];
        if (!allowedTypes.includes(file.type)) {
            setError('Only video files (MP4, WEBM, MOV) are allowed');
            return;
        }

        // Validate file size (50MB max)
        const maxSize = 50 * 1024 * 1024;
        if (file.size > maxSize) {
            setError('File size must be less than 50MB');
            return;
        }

        setError(null);
        setUploading(true);

        try {
            const url = await uploadFile(file);
            onVideoUrlChange(url);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to upload video');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="space-y-2">
            <Label>Video *</Label>
            {error && (
                <div className="text-sm text-red-500 bg-red-50 p-2 rounded">
                    {error}
                </div>
            )}
            <div className="space-y-3">
                {!videoUrl && (
                    <UploadInput
                        onFileSelect={handleFileUpload}
                        accept="video/*"
                        disabled={uploading}
                        title="Click to upload video"
                        description="MP4, WEBM or MOV (max 50MB)"
                    />
                )}
                <Input
                    placeholder="https://example.com/video.mp4"
                    value={videoUrl}
                    onChange={(e) => onVideoUrlChange(e.target.value)}
                    disabled={uploading}
                />
                {uploading && (
                    <div className="flex items-center gap-2 text-sm text-blue-600">
                        <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                        <span>Uploading video...</span>
                    </div>
                )}
                {videoUrl && !uploading && (
                    <div className="p-4 border rounded-lg bg-gray-50">
                        <div className="flex items-center gap-3">
                            <Video className="w-8 h-8 text-gray-600" />
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900">Video uploaded</p>
                                <p className="text-xs text-gray-500 truncate">{videoUrl}</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

"use client";

interface VideoBlockPreviewProps {
    description?: string;
    videoUrl: string;
}

export function VideoBlockPreview({ description, videoUrl }: VideoBlockPreviewProps) {
    return (
        <div className="space-y-4">
            <>
                {description && <p className="text-muted-foreground">{description}</p>}
            </>

            <div className="w-full h-[450px] mx-auto rounded-lg overflow-hidden ">
                <video 
                    src={videoUrl} 
                    controls 
                    className="w-full h-full"
                    preload="metadata"
                >
                    Your browser does not support the video tag.
                </video>
            </div>
        </div>
    );
}

"use client";

interface VideoBlockPreviewProps {
    description?: string;
    videoUrl: string;
}

// Helper function to detect if URL is YouTube and convert to embed URL
function getEmbedUrl(url: string): { embedUrl: string; platform: 'youtube' | 'direct' } {
    // YouTube patterns
    const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const youtubeMatch = url.match(youtubeRegex);
    if (youtubeMatch && youtubeMatch[1]) {
        return {
            embedUrl: `https://www.youtube.com/embed/${youtubeMatch[1]}`,
            platform: 'youtube'
        };
    }

    // Direct video file (fallback)
    return {
        embedUrl: url,
        platform: 'direct'
    };
}

export function VideoBlockPreview({ description, videoUrl }: VideoBlockPreviewProps) {
    const videoInfo = getEmbedUrl(videoUrl);

    if (!videoInfo) {
        return (
            <div className="space-y-4">
                {description && <p className="text-muted-foreground">{description}</p>}
                <div className="w-full h-[450px] mx-auto rounded-lg overflow-hidden flex items-center justify-center bg-muted">
                    <p className="text-muted-foreground">Invalid video URL</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {description && <p className="text-muted-foreground">{description}</p>}

            <div className="w-full h-[450px] mx-auto rounded-lg overflow-hidden">
                {videoInfo.platform === 'direct' ? (
                    <video 
                        src={videoInfo.embedUrl} 
                        controls 
                        className="w-full h-full"
                        preload="metadata"
                    >
                        Your browser does not support the video tag.
                    </video>
                ) : (
                    <iframe
                        src={videoInfo.embedUrl}
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        title="Video player"
                    />
                )}
            </div>
        </div>
    );
}

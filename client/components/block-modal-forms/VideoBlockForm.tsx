import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface VideoBlockFormProps {
    videoUrl: string;
    onVideoUrlChange: (url: string) => void;
}

export function VideoBlockForm({ videoUrl, onVideoUrlChange }: VideoBlockFormProps) {
    return (
        <div className="space-y-2">
            <Label htmlFor="video_url">Video URL *</Label>
            <Input id="video_url" placeholder="https://example.com/video.mp4" value={videoUrl} onChange={(e) => onVideoUrlChange(e.target.value)} />
        </div>
    );
}

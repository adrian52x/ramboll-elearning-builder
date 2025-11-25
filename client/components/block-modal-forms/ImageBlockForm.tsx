import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface ImageBlockFormProps {
    imageUrls: string[];
    onImageUrlsChange: (urls: string[]) => void;
}

export function ImageBlockForm({ imageUrls, onImageUrlsChange }: ImageBlockFormProps) {
    const addImageUrl = () => onImageUrlsChange([...imageUrls, ""]);
    const removeImageUrl = (index: number) => onImageUrlsChange(imageUrls.filter((_, i) => i !== index));
    const updateImageUrl = (index: number, value: string) => {
        const newUrls = [...imageUrls];
        newUrls[index] = value;
        onImageUrlsChange(newUrls);
    };

    return (
        <div className="space-y-2">
            <Label>Image URLs *</Label>
            <div className="space-y-2">
                {imageUrls.length === 0 ? (
                    <Input placeholder="https://example.com/image.jpg" value="" onChange={(e) => onImageUrlsChange([e.target.value])} />
                ) : (
                    imageUrls.map((url, index) => (
                        <div key={index} className="flex gap-2">
                            <Input placeholder="https://example.com/image.jpg" value={url} onChange={(e) => updateImageUrl(index, e.target.value)} />
                            {imageUrls.length > 1 && (
                                <Button type="button" variant="outline" size="sm" onClick={() => removeImageUrl(index)}>
                                    ×
                                </Button>
                            )}
                        </div>
                    ))
                )}
            </div>
            <Button type="button" variant="outline" size="sm" onClick={addImageUrl} className="w-full">
                + Add Image
            </Button>
        </div>
    );
}

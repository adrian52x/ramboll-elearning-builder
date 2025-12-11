import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { UploadInput } from "@/components/ui/upload-input";
import { TabDto } from "@/types";
import { UploadAPI } from "@/lib/api/uploads";
import { useState } from "react";
import Image from "next/image";
import { ImageIcon } from "lucide-react";

interface InteractiveTabsFormProps {
    tabs: TabDto[];
    onTabsChange: (tabs: TabDto[]) => void;
}

export function InteractiveTabsForm({ tabs, onTabsChange }: InteractiveTabsFormProps) {
    const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);
    const [uploadError, setUploadError] = useState<string | null>(null);

    const addTab = () => onTabsChange([...tabs, { title: "", description: "", contentUrl: "" }]);
    const removeTab = (index: number) => onTabsChange(tabs.filter((_, i) => i !== index));
    const updateTab = (index: number, field: keyof TabDto, value: string) => {
        const newTabs = [...tabs];
        newTabs[index] = { ...newTabs[index], [field]: value };
        onTabsChange(newTabs);
    };

    const handleFileUpload = async (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
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
        setUploadingIndex(index);

        try {
            const url = await UploadAPI.uploadFile(file);
            updateTab(index, "contentUrl", url);
        } catch (err) {
            setUploadError(err instanceof Error ? err.message : 'Failed to upload image');
        } finally {
            setUploadingIndex(null);
        }
    };

    return (
        <div className="space-y-2">
            <Label>Interactive Tabs *</Label>
            {uploadError && (
                <div className="text-sm text-red-500 bg-red-50 p-2 rounded">
                    {uploadError}
                </div>
            )}
            <div className="space-y-3">
                {tabs.length === 0 ? (
                    <div className="text-sm text-gray-500">No tabs added yet</div>
                ) : (
                    tabs.map((tab, index) => (
                        <div key={index} className="border rounded-lg p-3 space-y-2">
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-medium">Tab {index + 1}</span>
                                <Button type="button" variant="outline" size="sm" onClick={() => removeTab(index)}>
                                    ×
                                </Button>
                            </div>
                            <Input placeholder="Tab title" value={tab.title} onChange={(e) => updateTab(index, "title", e.target.value)} />
                            <Textarea placeholder="Tab description (optional)" value={tab.description} onChange={(e) => updateTab(index, "description", e.target.value)} />
                            
                            <div className="space-y-2">
                                <Label className="text-sm">Content Image</Label>
                                {!tab.contentUrl && (
                                    <UploadInput
                                        onFileSelect={(e) => handleFileUpload(index, e)}
                                        accept="image/*"
                                        disabled={uploadingIndex === index}
                                        title="Click to upload image"
                                        description="JPG, PNG, GIF or WEBP (max 10MB)"
                                    />
                                )}
                                <Input placeholder="https://example.com/image.jpg" value={tab.contentUrl} onChange={(e) => updateTab(index, "contentUrl", e.target.value)} disabled={uploadingIndex === index} />
                                {uploadingIndex === index && (
                                    <div className="flex items-center gap-2 text-sm text-blue-600">
                                        <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                                        <span>Uploading image...</span>
                                    </div>
                                )}
                                {tab.contentUrl && uploadingIndex !== index && tab.contentUrl.startsWith('http') && (
                                    <div className="p-3 border rounded-lg bg-gray-50">
                                        <div className="flex items-center gap-3">
                                            <ImageIcon className="w-6 h-6 text-gray-600 shrink-0" />
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-gray-900">Image uploaded</p>
                                            </div>
                                        </div>
                                        <div className="mt-2">
                                            <Image src={tab.contentUrl} alt="Tab content" width={200} height={150} className="rounded object-cover" unoptimized />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
            <Button type="button" variant="outline" size="sm" onClick={addTab} className="w-full">
                + Add Tab
            </Button>
        </div>
    );
}

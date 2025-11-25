import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { TabDto } from "@/types";

interface InteractiveTabsFormProps {
    tabs: TabDto[];
    onTabsChange: (tabs: TabDto[]) => void;
}

export function InteractiveTabsForm({ tabs, onTabsChange }: InteractiveTabsFormProps) {
    const addTab = () => onTabsChange([...tabs, { title: "", description: "", content_url: "" }]);
    const removeTab = (index: number) => onTabsChange(tabs.filter((_, i) => i !== index));
    const updateTab = (index: number, field: keyof TabDto, value: string) => {
        const newTabs = [...tabs];
        newTabs[index] = { ...newTabs[index], [field]: value };
        onTabsChange(newTabs);
    };

    return (
        <div className="space-y-2">
            <Label>Interactive Tabs *</Label>
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
                            <Textarea placeholder="Tab description" value={tab.description} onChange={(e) => updateTab(index, "description", e.target.value)} />
                            <Input placeholder="Content URL" value={tab.content_url} onChange={(e) => updateTab(index, "content_url", e.target.value)} />
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

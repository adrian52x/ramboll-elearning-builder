"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";

interface Tab {
    title: string;
    content: string;
    contentUrl?: string;
}

interface InteractiveTabsPreviewProps {
    description?: string;
    tabs: Tab[];
}

export function InteractiveTabsPreview({ description, tabs }: InteractiveTabsPreviewProps) {
    return (
        <div className="space-y-4">
            <>
                {description && <p className="text-muted-foreground">{description}</p>}
            </>

            {tabs.length > 0 ? (
                <Tabs defaultValue={`tab-0`} className="w-full">
                    <TabsList className="w-full flex flex-wrap">
                        {tabs.map((tab, index) => (
                            <TabsTrigger key={index} value={`tab-${index}`} className="flex-1">
                                {tab.title}
                            </TabsTrigger>
                        ))}
                    </TabsList>
                    {tabs.map((tab, index) => (
                        <TabsContent key={index} value={`tab-${index}`}>
                            <Card>
                                <CardContent className="pt-6 space-y-4">
                                    <p className="text-foreground whitespace-pre-wrap">{tab.content}</p>
                                    {tab.contentUrl && (
                                        <a
                                            href={tab.contentUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-600 hover:underline inline-block"
                                        >
                                            View Resource →
                                        </a>
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>
                    ))}
                </Tabs>
            ) : (
                <Card>
                    <CardContent className="pt-6">
                        <p className="text-muted-foreground text-center">No tabs configured</p>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}

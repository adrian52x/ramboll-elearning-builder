"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Tab } from "@/types";

interface InteractiveTabsPreviewProps {
    description?: string;
    tabs: Tab[];
}

export function InteractiveTabsPreview({ description, tabs }: InteractiveTabsPreviewProps) {
    return (
        <div className="space-y-4">
            {description && <p>{description}</p>}

            {tabs.length > 0 ? (
                <Tabs defaultValue={`tab-0`} className="w-full">
                    <TabsList className="w-full flex flex-wrap gap-2">
                        {tabs.map((tab, index) => (
                            <TabsTrigger key={index} value={`tab-${index}`} className="flex-1 bg-incept-green/40 data-[state=active]:bg-incept-green data-[state=active]:text-black">
                                {tab.title}
                            </TabsTrigger>
                        ))}
                    </TabsList>
                    {tabs.map((tab, index) => (
                        <TabsContent key={index} value={`tab-${index}`}>
                            <Card>
                                <CardContent className="space-y-4">
                                    {/* Optional description */}
                                    {tab.description && (
                                        <p className="whitespace-pre-wrap">{tab.description}</p>
                                    )}

                                    {/* Image from contentUrl */}
                                    <div className="w-full max-w-2xl mx-auto">
                                        <img
                                            src={tab.contentUrl}
                                            alt={tab.title}
                                            className="w-full h-auto rounded-lg"
                                        />
                                    </div>
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

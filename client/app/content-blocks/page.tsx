'use client';
import { BlockCard } from "@/components/block-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BlockType } from "@/types";

export default function ContentBlocks() {
    return (
        <div className="page-wrapper">

            {/* <BlockCard type={BlockType.VIDEO} />

            <BlockCard 
                type={BlockType.IMAGE} 
                onClick={() => console.log("Image block clicked")} 
            /> */}
            <div className="space-y-8">
                <div className="flex gap-4">
                    {Object.values(BlockType).map(type => (
                        <BlockCard key={type} type={type} />
                    ))}
                </div>

                {/* Empty state  */}
                <Input placeholder="Enter step title" className="bg-white w-[400px] mb-2">
                    
                </Input>
                <div className="p-4 border-2 border-2 border-gray-500 rounded-lg space-y-3">
                    <div className="flex gap-4">
                        <BlockCard type={BlockType.ADD_BLOCK} onClick={() => console.log("Image block clicked")} />
                    </div>
                </div>

                {/* Example with blocks */}
                <Input placeholder="Enter step title" className="bg-white w-[400px] mb-2"></Input>
                <div className="p-4 border-2 border-2 border-gray-500 rounded-lg space-y-3">
                    <div className="flex gap-4">
                        <BlockCard type={BlockType.IMAGE} onClick={() => console.log("Image block clicked")} />
                        <BlockCard type={BlockType.VIDEO} onClick={() => console.log("Image block clicked")} />
                        <BlockCard type={BlockType.FEEDBACK_ACTIVITY} onClick={() => console.log("Image block clicked")} />
                    </div>

                </div>



                <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => console.log("Add Step clicked")}
                    className="w-full"
                >
                    Add Step
                </Button>
            </div>
        </div>
    )
}



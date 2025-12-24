"use client";

import { BookOpen, Box, Plus } from "lucide-react";
import { usePathname } from "next/navigation";

const menuItems = [
    {
        title: "E-learnings",
        icon: BookOpen,
        url: "/",
    },
    {
        title: "Create E-learning",
        icon: Plus,
        url: "/create",
    },
    {
        title: "Content Blocks",
        icon: Box,
        url: "/content-blocks",
    }
];

export function AppSidebar() {
    const pathname = usePathname();

    return (
        <aside className="w-54 h-screen bg-background flex flex-col">
            {/* Header */}
            <div className="flex flex-col space-y-2 items-center p-6 border-b border-neutral-500">
                <img src="/Ramboll_Logo.png" alt="Logo" />
                {/* <div className="font-semibold text-lg text-white">E-Learning Builder</div> */}
            </div>
            

            {/* Menu */}
            <nav className="flex-1 pt-4 pl-4">
                <div className="space-y-1">
                    {menuItems.map((item) => (
                        <a
                            key={item.title}
                            href={item.url}
                            className={`flex items-center gap-3 px-3 py-2 rounded-l-lg transition-colors ${
                                pathname === item.url ? "bg-neutral-200 shadow-lg" : "hover:bg-neutral-200 text-white hover:text-background"
                            }`}
                        >
                            <item.icon className="h-4 w-4" />
                            <span className="text-md font-medium">{item.title}</span>
                        </a>
                    ))}
                </div>
            </nav>
        </aside>
    );
}

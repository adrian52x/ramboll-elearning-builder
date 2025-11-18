"use client";

import React from "react";
import { BookOpen, Box, Folder } from "lucide-react";
import { usePathname } from "next/navigation";

const menuItems = [
    {
        title: "E-learnings",
        icon: BookOpen,
        url: "/",
    },
    {
        title: "Content Blocks",
        icon: Box,
        url: "/content-blocks",
    },
    {
        title: "Others",
        icon: Folder,
        url: "",
    },
];

export function AppSidebar() {
    const pathname = usePathname();

    return (
        <aside className="w-64 h-screen bg-sidebar flex flex-col">
            {/* Header */}
            <div className="p-6 border-b">
                <div className="text-sm font-semibold">
                    Ramboll E-Learning Builder
                </div>
            </div>

            {/* Menu */}
            <nav className="flex-1 pt-4 pl-4">
                <div className="space-y-1">
                    {menuItems.map((item) => (
                        <a
                            key={item.title}
                            href={item.url}
                            className={`flex items-center gap-3 px-3 py-2 rounded-l-lg transition-colors ${
                                pathname === item.url
                                    ? "bg-neutral-200 text-orange-500"
                                    : "hover:bg-neutral-200"
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

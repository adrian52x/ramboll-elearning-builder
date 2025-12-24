import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AppSidebar } from "@/components/sidebar";
import { QueryProvider } from "@/providers/query-provider";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Incept Sustainability | E-Learning Builder",
    description: "Create and manage e-learning modules",
    icons: {
        icon: "/globe.svg",
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
                <QueryProvider>
                    <div className="flex h-screen">
                        <AppSidebar />
                        <main className="flex-1 pt-6 overflow-auto">{children}</main>
                    </div>
                </QueryProvider>
            </body>
        </html>
    );
}

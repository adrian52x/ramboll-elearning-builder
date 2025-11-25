1.  npx create-next-app@latest . --typescript --tailwind --app --no-src-dir --import-alias "@/\*"
    npm install -D prettier

    --background: #23282d; --> gray-dark
    --foreground: oklch(0.145 0 0); --> neutral-950
    --pageBackground: oklch(0.92 0.00 0); /_ neutral-200 oklch(0.92 0.00 0);_/

    form card:
    bg-card border border-neutral-300 shadow-md rounded-md p-6 space-y-6

    form input:
    className="w-full px-3 py-2 bg-neutral-50 border border-input rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-ring"

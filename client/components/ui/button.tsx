import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
    "inline-flex items-center cursor-pointer justify-center gap-2 rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
    {
        variants: {
            variant: {
                primary: "bg-background text-white hover:opacity-90",
                secondary: "bg-secondary text-secondary-foreground hover:opacity-90",
                outline:
                    "border border-neutral-300 bg-white hover:border-neutral-400 hover:bg-neutral-50",
                destructive: "bg-orange-700 text-white hover:opacity-90",
            },
            size: {
                default: "px-4 py-2",
                sm: "px-3 py-1.5 text-xs",
                lg: "px-6 py-3 text-base",
                icon: "h-9 w-9",
            },
        },
        defaultVariants: {
            variant: "primary",
            size: "default",
        },
    }
);

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
        VariantProps<typeof buttonVariants> {
    asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, asChild = false, ...props }, ref) => {
        return (
            <button
                className={cn(buttonVariants({ variant, size, className }))}
                ref={ref}
                {...props}
            />
        );
    }
);
Button.displayName = "Button";

export { Button, buttonVariants };

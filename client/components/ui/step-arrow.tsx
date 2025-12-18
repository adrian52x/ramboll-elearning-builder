import * as React from "react";
import { cn } from "@/lib/utils";

export interface StepArrowProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: "default" | "primary" | "secondary" | "muted" | "active";
    size?: "sm" | "md" | "lg";
}

const variantStyles = {
    default: "bg-neutral-400 border-l-neutral-400",
    primary: "bg-primary border-l-primary",
    secondary: "bg-secondary border-l-secondary",
    muted: "bg-muted border-l-muted",
    active: "bg-incept-primary/50 border-l-incept-primary/50",
};

const sizeStyles = {
    sm: {
        container: "w-12 h-4",
        arrow: "border-t-[8px] border-b-[8px] border-l-[8px] right-[-8px]",
    },
    md: {
        container: "w-14 h-5",
        arrow: "border-t-[10px] border-b-[10px] border-l-[10px] right-[-10px]",
    },
    lg: {
        container: "w-16 h-6",
        arrow: "border-t-[12px] border-b-[12px] border-l-[12px] right-[-12px]",
    },
};

function StepArrow({
    className,
    variant = "default",
    size = "sm",
    children,
    ...props
}: StepArrowProps) {
    const variantClasses = variantStyles[variant];
    const sizeClasses = sizeStyles[size];

    return (
        <div
            className={cn(
                "relative inline-flex items-center justify-center text-white rounded-l-sm font-medium shadow-md",
                sizeClasses.container,
                variantClasses.split(" ")[0],
                className
            )}
            {...props}
        >
            {children}
            <div
                className={cn(
                    "absolute w-0 h-0 border-t-transparent border-b-transparent",
                    sizeClasses.arrow,
                    variantClasses.split(" ")[1]
                )}
            />
        </div>
    );
}

export { StepArrow };
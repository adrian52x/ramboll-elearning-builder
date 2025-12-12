import { AlertCircle } from "lucide-react";

interface ErrorMessageProps {
    title?: string;
    message: string;
    className?: string;
}

export function ErrorMessage({ 
    title = "Error", 
    message, 
    className = ""
}: ErrorMessageProps) {
    return (
        <div className={`flex flex-col items-center justify-center py-12 ${className}`}>
            <div className="flex items-center gap-3 text-red-600 mb-4">
                <AlertCircle className="h-6 w-6" />
                <h3 className="text-lg font-semibold">{title}</h3>
            </div>
            <p className="text-muted-foreground text-center max-w-md">
                {message}
            </p>
        </div>
    );
}

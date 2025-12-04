import { useRef } from "react";
import { Upload } from "lucide-react";

interface UploadInputProps {
    onFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
    accept: string;
    disabled?: boolean;
    title: string;
    description: string;
}

export function UploadInput({ 
    onFileSelect, 
    accept, 
    disabled = false, 
    title, 
    description 
}: UploadInputProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);

    return (
        <>
            <input
                ref={fileInputRef}
                type="file"
                accept={accept}
                onChange={onFileSelect}
                disabled={disabled}
                className="hidden"
            />
            <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={disabled}
                className="w-full border-2 border-dashed border-gray-300 rounded-lg p-2 hover:border-gray-400 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
                <div className="flex flex-col items-center gap-2 text-gray-600">
                    <Upload className="w-5 h-5" />
                    <span className="text-sm font-medium">{title}</span>
                    <span className="text-xs text-gray-500">{description}</span>
                </div>
            </button>
            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-xs">
                    <span className="bg-white px-2 text-gray-500">Or paste URL</span>
                </div>
            </div>
        </>
    );
}

import { useState } from "react";
import { Upload, X, Loader2, FileText, CheckCircle2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface FileUploadProps {
    value?: string;
    onChange: (url: string) => void;
    bucket: "resource-files";
    accept?: string;
    maxSizeMB?: number;
    className?: string;
}

export const FileUpload = ({
    value,
    onChange,
    bucket,
    accept = ".pdf,.zip,.doc,.docx,.ppt,.pptx,.txt",
    maxSizeMB = 10,
    className = ""
}: FileUploadProps) => {
    const [uploading, setUploading] = useState(false);
    const { toast } = useToast();

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file size
        if (file.size > maxSizeMB * 1024 * 1024) {
            toast({
                title: "File too large",
                description: `Please upload a file smaller than ${maxSizeMB}MB`,
                variant: "destructive",
            });
            return;
        }

        setUploading(true);

        try {
            // Generate unique filename preserving original name but making it URL safe
            const fileExt = file.name.split(".").pop();
            const safeName = file.name
                .replace(/[^a-z0-9]/gi, "-")
                .toLowerCase()
                .replace(new RegExp(`-${fileExt}$`), "");
            const fileName = `${safeName}-${Math.random().toString(36).substring(2, 7)}-${Date.now()}.${fileExt}`;

            // Upload to Supabase Storage
            const { data, error } = await supabase.storage
                .from(bucket)
                .upload(fileName, file, {
                    cacheControl: "3600",
                    upsert: false,
                });

            if (error) throw error;

            // Get public URL
            const { data: urlData } = supabase.storage
                .from(bucket)
                .getPublicUrl(data.path);

            onChange(urlData.publicUrl);

            toast({
                title: "Success",
                description: "File uploaded successfully",
            });
        } catch (error: any) {
            console.error("Upload error:", error);
            toast({
                title: "Upload failed",
                description: error.message || "Failed to upload file",
                variant: "destructive",
            });
        } finally {
            setUploading(false);
        }
    };

    const handleRemove = () => {
        if (confirm("Clear uploaded file reference? This won't delete the file from storage.")) {
            onChange("");
        }
    };

    const getFileNameFromUrl = (url: string) => {
        try {
            const parts = url.split("/");
            return decodeURIComponent(parts[parts.length - 1]);
        } catch (e) {
            return "Uploaded File";
        }
    };

    return (
        <div className={`space-y-4 ${className}`}>
            {value ? (
                <div className="relative flex items-center gap-3 p-4 bg-secondary/30 rounded-lg border border-border/50">
                    <div className="p-2 bg-primary/10 rounded-lg">
                        <FileText className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                            <p className="text-sm font-medium truncate">
                                {getFileNameFromUrl(value)}
                            </p>
                            <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
                        </div>
                        <p className="text-[10px] text-muted-foreground truncate">
                            {value}
                        </p>
                    </div>
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={handleRemove}
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </div>
            ) : (
                <div className="border-2 border-dashed rounded-lg p-6 text-center hover:border-primary transition-colors bg-secondary/10">
                    <input
                        type="file"
                        accept={accept}
                        onChange={handleUpload}
                        disabled={uploading}
                        className="hidden"
                        id={`file-upload-${bucket}`}
                    />
                    <label
                        htmlFor={`file-upload-${bucket}`}
                        className="cursor-pointer flex flex-col items-center space-y-2"
                    >
                        {uploading ? (
                            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                        ) : (
                            <Upload className="h-8 w-8 text-muted-foreground" />
                        )}
                        <div className="text-sm font-medium">
                            {uploading ? "Uploading..." : "Click to upload resource file"}
                        </div>
                        <div className="text-xs text-muted-foreground">
                            PDF, ZIP, DOC, etc. (max {maxSizeMB}MB)
                        </div>
                    </label>
                </div>
            )}
        </div>
    );
};

import { ChangeEvent, useState } from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ImageUploaderProps {
  label: string;
  onChange: (file: File | null) => void;
}

export function ImageUploader({ label, onChange }: ImageUploaderProps) {
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      onChange(file);
    } else {
      setPreview(null);
      onChange(null);
    }
  };

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        <div className="space-y-2">
          <div className="font-medium">{label}</div>
          <div className="flex flex-col items-center justify-center gap-4">
            {preview ? (
              <div className="relative h-48 w-full">
                <Image
                  src={preview}
                  alt={`${label} preview`}
                  className="rounded-md object-contain"
                  fill
                />
              </div>
            ) : (
              <div className="flex h-48 w-full items-center justify-center rounded-md border border-dashed border-gray-300 bg-gray-50">
                <p className="text-sm text-gray-500">
                  No {label.toLowerCase()} selected
                </p>
              </div>
            )}
            <div className="w-full">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  const input = document.createElement("input");
                  input.type = "file";
                  input.accept = "image/*";
                  input.onchange = (e) => handleFileChange(e as ChangeEvent<HTMLInputElement>);
                  input.click();
                }}
              >
                {preview ? `Change ${label}` : `Upload ${label}`}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

"use client";

import { useState, FormEvent } from "react";
import Image from "next/image";
import { ImageUploader } from "@/components/image-uploader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";

export default function Home() {
  const [image, setImage] = useState<File | null>(null);
  const [mask, setMask] = useState<File | null>(null);
  const [text, setText] = useState("");
  const [width, setWidth] = useState("512");
  const [height, setHeight] = useState("512");
  const [isLoading, setIsLoading] = useState(false);
  const [resultImage, setResultImage] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!image || !mask) {
      toast.error("Please upload both image and mask files");
      return;
    }

    if (!text.trim()) {
      toast.error("Please enter a text prompt");
      return;
    }

    setIsLoading(true);
    setResultImage(null);

    try {
      const formData = new FormData();
      formData.append("image", image);
      formData.append("mask", mask);
      formData.append("text", text);
      formData.append("width", width);
      formData.append("height", height);

      const response = await fetch("/api/inpaint", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to process image");
      }

      const blob = await response.blob();
      const imageUrl = URL.createObjectURL(blob);
      setResultImage(imageUrl);
      toast.success("Image generated successfully!");
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to process image. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-8 bg-neutral-50">
      <Toaster position="top-center" />
      
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Image Inpainting Tool</h1>
          <p className="text-neutral-600">Upload an image and mask, then describe what you want to generate</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ImageUploader label="Image" onChange={setImage} />
                <ImageUploader label="Mask" onChange={setMask} />
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle>Text Prompt</CardTitle>
                  <CardDescription>Describe what you want to generate in the masked area</CardDescription>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder="E.g., cat sitting on the bench"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    className="min-h-24"
                  />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Output Dimensions</CardTitle>
                  <CardDescription>Specify the width and height of the output image</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="width" className="text-sm font-medium">Width</label>
                      <Input
                        id="width"
                        type="number"
                        value={width}
                        onChange={(e) => setWidth(e.target.value)}
                        min="64"
                        max="1024"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="height" className="text-sm font-medium">Height</label>
                      <Input
                        id="height"
                        type="number"
                        value={height}
                        onChange={(e) => setHeight(e.target.value)}
                        min="64"
                        max="1024"
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isLoading || !image || !mask || !text.trim()}
                  >
                    {isLoading ? "Processing..." : "Generate Image"}
                  </Button>
                </CardFooter>
              </Card>
            </form>
          </div>
          
          <div className="lg:col-span-4">
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Result</CardTitle>
                <CardDescription>The generated image will appear here</CardDescription>
              </CardHeader>
              <CardContent className="flex items-center justify-center">
                {isLoading ? (
                  <div className="h-64 w-full flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                  </div>
                ) : resultImage ? (
                  <div className="relative h-80 w-full">
                    <Image
                      src={resultImage}
                      alt="Generated image"
                      fill
                      className="object-contain rounded-md"
                    />
                  </div>
                ) : (
                  <div className="h-64 w-full flex items-center justify-center border border-dashed rounded-md bg-neutral-100 text-neutral-400">
                    <p>No result yet</p>
                  </div>
                )}
              </CardContent>
              {resultImage && (
                <CardFooter>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => {
                      const link = document.createElement('a');
                      link.href = resultImage;
                      link.download = 'inpainted-image.png';
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                    }}
                  >
                    Download Image
                  </Button>
                </CardFooter>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

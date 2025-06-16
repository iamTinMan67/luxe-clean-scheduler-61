
import { Upload } from "lucide-react";
import React, { useState } from "react";
import { FormLabel } from "@/components/ui/form";
import { Skeleton } from "@/components/ui/skeleton";

interface ImageUploaderProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
}

const ImageUploader = ({ images, onImagesChange }: ImageUploaderProps) => {
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    setUploading(true);
    
    // In a real implementation, you'd upload these to storage
    // For this demo, we'll use URL.createObjectURL to preview them
    const newImages = Array.from(files).map(file => URL.createObjectURL(file));
    onImagesChange([...images, ...newImages]);
    setUploading(false);
  };

  const removeImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    onImagesChange(newImages);
  };

  return (
    <div>
      <FormLabel className="text-white block mb-2">Upload Photos (optional)</FormLabel>
      <div className="flex items-center justify-center w-full">
        <label
          htmlFor="dropzone-file"
          className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-700 border-dashed rounded-lg cursor-pointer bg-gray-800 hover:bg-gray-700"
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <Upload className="w-8 h-8 mb-3 text-gray-400" />
            <p className="mb-2 text-sm text-gray-400">
              <span className="font-bold">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-gray-500">
              PNG, JPG or WEBP (MAX. 5MB each)
            </p>
          </div>
          <input
            id="dropzone-file"
            type="file"
            className="hidden"
            accept="image/*"
            multiple
            onChange={handleImageUpload}
          />
        </label>
      </div>

      {uploading && (
        <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4">
          <Skeleton className="h-24 w-full rounded-md" />
          <Skeleton className="h-24 w-full rounded-md" />
        </div>
      )}

      {images.length > 0 && (
        <div className="mt-4">
          <h3 className="text-white text-sm mb-2">Uploaded Images:</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {images.map((src, index) => (
              <div key={index} className="relative group h-24">
                <img
                  src={src}
                  alt={`Uploaded ${index + 1}`}
                  className="h-full w-full object-cover rounded-md"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;

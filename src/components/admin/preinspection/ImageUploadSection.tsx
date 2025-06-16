
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Camera, ImageIcon, X } from "lucide-react";
import { toast } from "sonner";

interface ImageUploadSectionProps {
  images: string[];
  onImageUpload: (newImages: string[]) => void;
}

const ImageUploadSection = ({ images, onImageUpload }: ImageUploadSectionProps) => {
  const [isCapturing, setIsCapturing] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startCamera = async () => {
    try {
      setIsCapturing(true);
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment' // Use back camera if available
        } 
      });
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      toast.error('Unable to access camera. Please check permissions.');
      setIsCapturing(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsCapturing(false);
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;

    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    
    if (!context) {
      toast.error('Unable to capture photo');
      return;
    }

    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    
    context.drawImage(videoRef.current, 0, 0);
    
    const imageDataUrl = canvas.toDataURL('image/jpeg', 0.8);
    const newImages = [...images, imageDataUrl];
    onImageUpload(newImages);
    
    toast.success('Photo captured successfully');
  };

  const removeImage = (indexToRemove: number) => {
    const updatedImages = images.filter((_, index) => index !== indexToRemove);
    onImageUpload(updatedImages);
  };

  return (
    <Card className="bg-black/60 border-gold/30">
      <CardHeader>
        <CardTitle className="text-white">Vehicle Photos</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 space-y-4">
          {!isCapturing ? (
            <Button 
              onClick={startCamera} 
              className="gold-gradient text-black hover:shadow-gold/20 hover:shadow-lg"
            >
              <Camera size={16} className="mr-2" />
              Take Photos
            </Button>
          ) : (
            <div className="space-y-4">
              <div className="relative">
                <video 
                  ref={videoRef}
                  className="w-full max-w-md mx-auto rounded-lg"
                  autoPlay
                  playsInline
                  muted
                />
              </div>
              
              <div className="flex justify-center gap-4">
                <Button 
                  onClick={capturePhoto}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Camera size={16} className="mr-2" />
                  Capture
                </Button>
                
                <Button 
                  onClick={stopCamera}
                  variant="outline"
                  className="border-gray-600 text-gray-300 hover:bg-gray-800"
                >
                  Done
                </Button>
              </div>
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image, index) => (
            <div key={index} className="relative border border-gold/20 rounded overflow-hidden aspect-square group">
              <img 
                src={image} 
                alt={`Vehicle photo ${index + 1}`} 
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => removeImage(index)}
                className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X size={16} />
              </button>
            </div>
          ))}
          
          {images.length === 0 && !isCapturing && (
            <div className="col-span-full flex flex-col items-center justify-center text-white/60 p-8 border border-dashed border-gold/20 rounded-md">
              <ImageIcon size={48} className="mb-2 opacity-50" />
              <p>No photos taken yet</p>
              <p className="text-sm">Use camera to capture vehicle photos</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ImageUploadSection;

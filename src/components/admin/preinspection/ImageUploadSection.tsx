
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Camera, ImageIcon, X, FolderOpen } from "lucide-react";
import { toast } from "sonner";
import { useJobPhotos } from "@/hooks/photos/useJobPhotos";

interface ImageUploadSectionProps {
  images: string[];
  onImageUpload: (newImages: string[]) => void;
  bookingId?: string;
}

const ImageUploadSection = ({ images, onImageUpload, bookingId }: ImageUploadSectionProps) => {
  const [isCapturing, setIsCapturing] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  
  const { photoFolder, addBeforePhoto } = useJobPhotos(bookingId || '');

  const startCamera = async () => {
    try {
      setIsCapturing(true);
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment'
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
    
    // Save to both the legacy images array and the new photo management system
    const newImages = [...images, imageDataUrl];
    onImageUpload(newImages);
    
    // Save as "before" photo if bookingId is available
    if (bookingId) {
      addBeforePhoto(imageDataUrl, 'Pre-inspection photo');
    }
    
    toast.success('Photo captured and saved to "Before" folder');
  };

  const removeImage = (indexToRemove: number) => {
    const updatedImages = images.filter((_, index) => index !== indexToRemove);
    onImageUpload(updatedImages);
  };

  return (
    <Card className="bg-black/60 border-gold/30">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <FolderOpen size={20} />
          Before Photos - Pre-Inspection
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 space-y-4">
          {!isCapturing ? (
            <Button 
              onClick={startCamera} 
              className="gold-gradient text-black hover:shadow-gold/20 hover:shadow-lg"
            >
              <Camera size={16} className="mr-2" />
              Take Before Photos
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

        {/* Display current session photos */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
          {images.map((image, index) => (
            <div key={index} className="relative border border-gold/20 rounded overflow-hidden aspect-square group">
              <img 
                src={image} 
                alt={`Before photo ${index + 1}`} 
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
        </div>

        {/* Display saved before photos from photo management system */}
        {bookingId && photoFolder.beforePhotos.length > 0 && (
          <div className="border-t border-gold/20 pt-4">
            <h4 className="text-white text-sm font-medium mb-2">
              Saved Before Photos ({photoFolder.beforePhotos.length})
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
              {photoFolder.beforePhotos.map((photo) => (
                <div key={photo.id} className="relative border border-green-500/30 rounded overflow-hidden aspect-square">
                  <img 
                    src={photo.imageUrl} 
                    alt="Saved before photo" 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-green-500/80 text-white text-xs p-1 text-center">
                    Saved
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {images.length === 0 && (!bookingId || photoFolder.beforePhotos.length === 0) && !isCapturing && (
          <div className="col-span-full flex flex-col items-center justify-center text-white/60 p-8 border border-dashed border-gold/20 rounded-md">
            <ImageIcon size={48} className="mb-2 opacity-50" />
            <p>No before photos taken yet</p>
            <p className="text-sm">Use camera to capture vehicle condition before service</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ImageUploadSection;

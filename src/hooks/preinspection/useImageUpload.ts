
import { toast } from "sonner";

export const useImageUpload = () => {
  const handleImageUpload = (images: string[], setImages: (images: string[]) => void, newImages?: string[]) => {
    if (newImages) {
      // Handle multiple new images from camera capture
      setImages(newImages);
    } else {
      // Placeholder for future file upload functionality if needed
      toast.info("Use the camera to capture photos of the vehicle");
    }
  };

  return { handleImageUpload };
};

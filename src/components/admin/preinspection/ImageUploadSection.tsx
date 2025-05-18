
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ImageIcon, Upload } from "lucide-react";

interface ImageUploadSectionProps {
  images: string[];
  onImageUpload: () => void;
}

const ImageUploadSection = ({ images, onImageUpload }: ImageUploadSectionProps) => {
  return (
    <Card className="bg-black/60 border-gold/30">
      <CardHeader>
        <CardTitle className="text-white">Snapshot Anything Notable</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <Button 
            onClick={onImageUpload} 
            className="gold-gradient text-black hover:shadow-gold/20 hover:shadow-lg"
          >
            <Upload size={16} className="mr-2" />
            Upload Photos
          </Button>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image, index) => (
            <div key={index} className="relative border border-gold/20 rounded overflow-hidden aspect-square">
              <img 
                src={image} 
                alt={`Vehicle photo ${index + 1}`} 
                className="w-full h-full object-cover"
              />
            </div>
          ))}
          
          {images.length === 0 && (
            <div className="col-span-full flex flex-col items-center justify-center text-white/60 p-8 border border-dashed border-gold/20 rounded-md">
              <ImageIcon size={48} className="mb-2 opacity-50" />
              <p>No images uploaded yet</p>
              <p className="text-sm">Snap anything noted</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ImageUploadSection;


import React from "react";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";

interface GalleryHeaderProps {
  onAddAlbum: () => void;
}

const GalleryHeader: React.FC<GalleryHeaderProps> = ({ onAddAlbum }) => {
  return (
    <div className="mb-8 flex justify-between items-center">
      <h1 className="text-3xl font-bold">Gallery Manager</h1>
      <Button 
        className="gold-gradient text-black" 
        onClick={onAddAlbum}
      >
        <Upload className="mr-2" size={16} />
        Add New Album
      </Button>
    </div>
  );
};

export default GalleryHeader;

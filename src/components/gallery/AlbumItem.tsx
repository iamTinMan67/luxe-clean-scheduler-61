
import { Trash2, Upload, X } from "lucide-react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";

interface GalleryItem {
  id: number;
  category: string;
  images: string[];
}

interface AlbumItemProps {
  item: GalleryItem;
  onEdit: (item: GalleryItem) => void;
  onDelete: (id: number) => void;
  onRemoveImage: (itemId: number, imageIndex: number) => void;
}

const AlbumItem = ({ 
  item, 
  onEdit, 
  onDelete, 
  onRemoveImage 
}: AlbumItemProps) => {
  return (
    <div 
      className="bg-gray-900 rounded-lg border border-gray-800 overflow-hidden transition-all hover:border-gold/50"
    >
      <div className="p-4 pb-2 flex justify-between items-center">
        <div className="text-xs text-gray-400 uppercase hidden">
          {item.category}
        </div>
        <div className="flex justify-end gap-2 w-full">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onEdit(item)}
          >
            <Upload size={16} />
          </Button>
          <Button 
            variant="destructive" 
            size="sm" 
            onClick={() => onDelete(item.id)}
          >
            <Trash2 size={16} />
          </Button>
        </div>
      </div>

      <div className="p-4 grid grid-cols-2 gap-2">
        {item.images.map((imageUrl, index) => (
          <div key={index} className="relative group">
            <AspectRatio ratio={16 / 9}>
              <img 
                src={imageUrl} 
                alt={`Album image ${index + 1}`} 
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = "/placeholder.svg";
                }}
              />
            </AspectRatio>
            <button 
              onClick={() => onRemoveImage(item.id, index)}
              className="absolute top-2 right-2 bg-black/70 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AlbumItem;

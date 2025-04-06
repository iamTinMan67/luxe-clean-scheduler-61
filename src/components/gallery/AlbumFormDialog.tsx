
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Plus, X } from "lucide-react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface GalleryItem {
  id: number;
  category: string;
  images: string[];
}

interface AlbumFormDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  isEditMode: boolean;
  currentItem: GalleryItem | null;
  newCategory: string;
  setNewCategory: (category: string) => void;
  newImages: string[];
  setNewImages: (images: string[]) => void;
  onSave: () => void;
  onCancel: () => void;
}

const AlbumFormDialog = ({
  open,
  setOpen,
  isEditMode,
  currentItem,
  newCategory,
  setNewCategory,
  newImages,
  setNewImages,
  onSave,
  onCancel
}: AlbumFormDialogProps) => {
  const [newImageUrl, setNewImageUrl] = useState("");

  const addImageToAlbum = () => {
    if (!newImageUrl.trim()) {
      toast.error("Please enter an image URL");
      return;
    }

    setNewImages([...newImages, newImageUrl]);
    setNewImageUrl("");
  };

  const removeImageFromNewImages = (index: number) => {
    const updatedImages = [...newImages];
    updatedImages.splice(index, 1);
    setNewImages(updatedImages);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="bg-gray-900 border border-gray-800 max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-white">
            {isEditMode ? "Edit Album" : "Add New Album"}
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            {isEditMode ? "Update your album images" : "Create a new album with multiple images"}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="hidden">
            <label htmlFor="category" className="text-sm text-gray-400">Category</label>
            <select 
              id="category"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-md p-2 text-white"
            >
              <option value="exterior">Exterior</option>
              <option value="interior">Interior</option>
              <option value="wheels">Wheels</option>
              <option value="commercial">Commercial</option>
            </select>
          </div>

          <div className="grid gap-2">
            <div className="flex items-center gap-2">
              <input 
                type="text" 
                value={newImageUrl} 
                onChange={(e) => setNewImageUrl(e.target.value)} 
                placeholder="Enter image URL"
                className="flex-1 bg-gray-800 border border-gray-700 rounded-md p-2 text-white"
              />
              <Button onClick={addImageToAlbum} variant="outline" size="sm">
                <Plus size={16} />
              </Button>
            </div>
          </div>

          <div className="grid gap-2">
            <label className="text-sm text-gray-400">Album Images</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {newImages.map((imageUrl, index) => (
                <div key={index} className="relative group">
                  <AspectRatio ratio={16 / 9}>
                    <img 
                      src={imageUrl} 
                      alt={`Album image ${index + 1}`} 
                      className="w-full h-full object-cover rounded-md"
                      onError={(e) => {
                        e.currentTarget.src = "/placeholder.svg";
                      }}
                    />
                  </AspectRatio>
                  <button 
                    onClick={() => removeImageFromNewImages(index)}
                    className="absolute top-2 right-2 bg-black/70 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
              {newImages.length === 0 && (
                <div className="col-span-full text-center p-4 bg-gray-800 rounded-md text-gray-400">
                  No images added yet. Add your first image above.
                </div>
              )}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button 
            className="gold-gradient text-black"
            onClick={onSave}
          >
            {isEditMode ? "Update Album" : "Add Album"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AlbumFormDialog;

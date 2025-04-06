
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Trash2, Upload, Plus, X } from "lucide-react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface GalleryItem {
  id: number;
  category: string;
  images: string[];
}

const GalleryManager = () => {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentItem, setCurrentItem] = useState<GalleryItem | null>(null);
  const [newImages, setNewImages] = useState<string[]>([]);
  const [newImageUrl, setNewImageUrl] = useState("");
  const [newCategory, setNewCategory] = useState("exterior");
  const [open, setOpen] = useState(false);

  // Load gallery items from localStorage on component mount
  useEffect(() => {
    const savedItems = localStorage.getItem("galleryItems");
    if (savedItems) {
      try {
        const parsedItems = JSON.parse(savedItems);
        // Convert old format to new format if necessary
        const convertedItems = parsedItems.map((item: any) => {
          if (!Array.isArray(item.images) && item.image) {
            return {
              ...item,
              images: [item.image],
              category: item.category || "exterior"
            };
          }
          return item;
        });
        setGalleryItems(convertedItems);
      } catch (error) {
        console.error("Error parsing gallery items:", error);
        setGalleryItems(getDefaultGalleryItems());
      }
    } else {
      setGalleryItems(getDefaultGalleryItems());
    }
  }, []);

  // Save gallery items to localStorage whenever they change
  useEffect(() => {
    if (galleryItems.length > 0) {
      localStorage.setItem("galleryItems", JSON.stringify(galleryItems));
    }
  }, [galleryItems]);

  const getDefaultGalleryItems = (): GalleryItem[] => {
    return [
      {
        id: 1,
        category: "exterior",
        images: [
          "https://images.unsplash.com/photo-1635774855317-edf3ee4463db?q=80&w=1932&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?q=80&w=1974&auto=format&fit=crop"
        ]
      },
      {
        id: 2,
        category: "interior",
        images: [
          "https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?q=80&w=1887&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1170&auto=format&fit=crop"
        ]
      },
      {
        id: 3,
        category: "wheels",
        images: [
          "https://images.unsplash.com/photo-1626063438347-5a9878b3e58b?q=80&w=1965&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1595171412833-4b6427b31c3f?q=80&w=1074&auto=format&fit=crop"
        ]
      },
      {
        id: 4,
        category: "commercial",
        images: [
          "https://images.unsplash.com/photo-1600661653561-629509216228?q=80&w=1170&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1583267746897-2cf415887172?q=80&w=1780&auto=format&fit=crop"
        ]
      }
    ];
  };

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

  const removeImageFromAlbum = (itemId: number, imageIndex: number) => {
    const item = galleryItems.find(item => item.id === itemId);
    if (!item || item.images.length <= 1) {
      toast.error("Album must contain at least one image");
      return;
    }

    const updatedItems = galleryItems.map(item => {
      if (item.id === itemId) {
        const updatedImages = [...item.images];
        updatedImages.splice(imageIndex, 1);
        return { ...item, images: updatedImages };
      }
      return item;
    });

    setGalleryItems(updatedItems);
    toast.success("Image removed from album");
  };

  const handleAddItem = () => {
    if (newImages.length === 0) {
      toast.error("Please add at least one image");
      return;
    }

    const newItem: GalleryItem = {
      id: Date.now(),
      category: newCategory,
      images: newImages
    };

    setGalleryItems([...galleryItems, newItem]);
    resetForm();
    setOpen(false);
    toast.success("Album added successfully");
  };

  const handleUpdateItem = () => {
    if (!currentItem) return;
    if (newImages.length === 0) {
      toast.error("Please add at least one image");
      return;
    }

    const updatedItems = galleryItems.map(item => 
      item.id === currentItem.id ? {
        ...item,
        category: newCategory,
        images: newImages
      } : item
    );
    
    setGalleryItems(updatedItems);
    resetForm();
    setIsEditMode(false);
    setOpen(false);
    toast.success("Album updated successfully");
  };

  const handleEditItem = (item: GalleryItem) => {
    setCurrentItem(item);
    setNewCategory(item.category);
    setNewImages([...item.images]);
    setIsEditMode(true);
    setOpen(true);
  };

  const handleDeleteItem = (id: number) => {
    if (window.confirm("Are you sure you want to delete this album?")) {
      const updatedItems = galleryItems.filter(item => item.id !== id);
      setGalleryItems(updatedItems);
      toast.success("Album deleted successfully");
    }
  };

  const resetForm = () => {
    setNewCategory("exterior");
    setNewImages([]);
    setNewImageUrl("");
    setCurrentItem(null);
  };

  const handleCancel = () => {
    resetForm();
    setIsEditMode(false);
    setOpen(false);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-24">
        <div className="mb-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold">Gallery Manager</h1>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="gold-gradient text-black">
                <Upload className="mr-2" size={16} />
                Add New Album
              </Button>
            </DialogTrigger>
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
                <Button variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
                <Button 
                  className="gold-gradient text-black"
                  onClick={isEditMode ? handleUpdateItem : handleAddItem}
                >
                  {isEditMode ? "Update Album" : "Add Album"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {galleryItems.length === 0 ? (
            <div className="col-span-full text-center p-12 bg-gray-900 rounded-lg border border-gray-800 text-gray-400">
              No albums found. Add your first album!
            </div>
          ) : (
            galleryItems.map((item) => (
              <div 
                key={item.id} 
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
                      onClick={() => handleEditItem(item)}
                    >
                      <Upload size={16} />
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm" 
                      onClick={() => handleDeleteItem(item.id)}
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
                        onClick={() => removeImageFromAlbum(item.id, index)}
                        className="absolute top-2 right-2 bg-black/70 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default GalleryManager;

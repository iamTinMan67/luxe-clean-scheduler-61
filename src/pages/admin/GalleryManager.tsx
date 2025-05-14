
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import AlbumFormDialog from "@/components/gallery/AlbumFormDialog";
import AlbumsList from "@/components/gallery/AlbumsList";

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
    setCurrentItem(null);
  };

  const handleCancel = () => {
    resetForm();
    setIsEditMode(false);
    setOpen(false);
  };

  const handleSave = () => {
    if (isEditMode) {
      handleUpdateItem();
    } else {
      handleAddItem();
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-24">
        <div className="mb-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold">Gallery Manager</h1>
          <Button 
            className="gold-gradient text-black" 
            onClick={() => setOpen(true)}
          >
            <Upload className="mr-2" size={16} />
            Add New Album
          </Button>
        </div>

        <AlbumsList 
          galleryItems={galleryItems}
          onEdit={handleEditItem}
          onDelete={handleDeleteItem}
          onRemoveImage={removeImageFromAlbum}
        />

        <AlbumFormDialog 
          open={open}
          setOpen={setOpen}
          isEditMode={isEditMode}
          currentItem={currentItem}
          newCategory={newCategory}
          setNewCategory={setNewCategory}
          newImages={newImages}
          setNewImages={setNewImages}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      </div>
    </div>
  );
};

export default GalleryManager;

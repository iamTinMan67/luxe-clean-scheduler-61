import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Trash2, Upload, Edit } from "lucide-react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface GalleryItem {
  id: number;
  category: string;
  image: string;
  title: string;
  description: string;
}

const GalleryManager = () => {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentItem, setCurrentItem] = useState<GalleryItem | null>(null);
  const [newImage, setNewImage] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newCategory, setNewCategory] = useState("exterior");
  const [open, setOpen] = useState(false);

  // Load gallery items from localStorage on component mount
  useEffect(() => {
    const savedItems = localStorage.getItem("galleryItems");
    if (savedItems) {
      setGalleryItems(JSON.parse(savedItems));
    } else {
      // Load default items from the current Gallery component
      const defaultItems = [
        {
          id: 1,
          category: "exterior",
          image: "https://images.unsplash.com/photo-1635774855317-edf3ee4463db?q=80&w=1932&auto=format&fit=crop",
          title: "Porsche 911 Exterior Detailing",
          description: "Complete exterior detail with ceramic coating"
        },
        {
          id: 2,
          category: "interior",
          image: "https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?q=80&w=1887&auto=format&fit=crop",
          title: "Range Rover Interior Detail",
          description: "Full interior detailing with leather conditioning"
        },
        {
          id: 3,
          category: "exterior",
          image: "https://images.unsplash.com/photo-1605515298946-d0573c9b2fdc?q=80&w=1915&auto=format&fit=crop",
          title: "Mercedes AMG GT Detail",
          description: "Full paint correction and ceramic coating"
        },
        {
          id: 4,
          category: "wheels",
          image: "https://images.unsplash.com/photo-1626063438347-5a9878b3e58b?q=80&w=1965&auto=format&fit=crop",
          title: "Audi RS6 Wheel Detail",
          description: "Complete wheel cleaning and ceramic protection"
        },
        {
          id: 5,
          category: "commercial",
          image: "https://images.unsplash.com/photo-1600661653561-629509216228?q=80&w=1170&auto=format&fit=crop",
          title: "Commercial Fleet Detailing",
          description: "Regular maintenance cleaning for a delivery fleet"
        },
        {
          id: 6,
          category: "interior",
          image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1170&auto=format&fit=crop",
          title: "Ferrari Interior Detail",
          description: "Premium interior detailing with leather treatment"
        },
        {
          id: 7,
          category: "exterior",
          image: "https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?q=80&w=1974&auto=format&fit=crop",
          title: "McLaren Exterior Detail",
          description: "Complete exterior detailing with paint correction"
        },
        {
          id: 8,
          category: "commercial",
          image: "https://images.unsplash.com/photo-1583267746897-2cf415887172?q=80&w=1780&auto=format&fit=crop",
          title: "Pickup Truck Detailing",
          description: "Full detail for a commercial pickup truck"
        },
        {
          id: 9,
          category: "wheels",
          image: "https://images.unsplash.com/photo-1595171412833-4b6427b31c3f?q=80&w=1074&auto=format&fit=crop",
          title: "BMW Wheel Detailing",
          description: "Deep cleaning and protection for luxury wheels"
        }
      ];
      setGalleryItems(defaultItems);
      localStorage.setItem("galleryItems", JSON.stringify(defaultItems));
    }
  }, []);

  // Save gallery items to localStorage whenever they change
  useEffect(() => {
    if (galleryItems.length > 0) {
      localStorage.setItem("galleryItems", JSON.stringify(galleryItems));
    }
  }, [galleryItems]);

  const handleAddItem = () => {
    if (!newImage || !newTitle || !newDescription) {
      toast.error("Please fill in all fields");
      return;
    }

    const newItem: GalleryItem = {
      id: Date.now(),
      category: newCategory,
      image: newImage,
      title: newTitle,
      description: newDescription
    };

    setGalleryItems([...galleryItems, newItem]);
    resetForm();
    setOpen(false);
    toast.success("Gallery item added successfully");
  };

  const handleUpdateItem = () => {
    if (!currentItem) return;
    
    const updatedItems = galleryItems.map(item => 
      item.id === currentItem.id ? {
        ...item,
        category: newCategory,
        image: newImage,
        title: newTitle,
        description: newDescription
      } : item
    );
    
    setGalleryItems(updatedItems);
    resetForm();
    setIsEditMode(false);
    setOpen(false);
    toast.success("Gallery item updated successfully");
  };

  const handleEditItem = (item: GalleryItem) => {
    setCurrentItem(item);
    setNewCategory(item.category);
    setNewImage(item.image);
    setNewTitle(item.title);
    setNewDescription(item.description);
    setIsEditMode(true);
    setOpen(true);
  };

  const handleDeleteItem = (id: number) => {
    if (window.confirm("Are you sure you want to delete this gallery item?")) {
      const updatedItems = galleryItems.filter(item => item.id !== id);
      setGalleryItems(updatedItems);
      toast.success("Gallery item deleted successfully");
    }
  };

  const resetForm = () => {
    setNewCategory("exterior");
    setNewImage("");
    setNewTitle("");
    setNewDescription("");
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
                Add New Image
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-gray-900 border border-gray-800">
              <DialogHeader>
                <DialogTitle className="text-white">
                  {isEditMode ? "Edit Gallery Item" : "Add New Gallery Item"}
                </DialogTitle>
                <DialogDescription className="text-gray-400">
                  Fill in the details below to {isEditMode ? "update" : "add"} a gallery item.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={newCategory}
                    onValueChange={setNewCategory}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="exterior">Exterior</SelectItem>
                      <SelectItem value="interior">Interior</SelectItem>
                      <SelectItem value="wheels">Wheels</SelectItem>
                      <SelectItem value="commercial">Commercial</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="image">Image URL</Label>
                  <Input 
                    id="image" 
                    value={newImage} 
                    onChange={(e) => setNewImage(e.target.value)} 
                    placeholder="https://example.com/image.jpg"
                  />
                  {newImage && (
                    <div className="mt-2 rounded-md overflow-hidden">
                      <AspectRatio ratio={16 / 9}>
                        <img 
                          src={newImage} 
                          alt="Preview" 
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = "/placeholder.svg";
                            toast.error("Image failed to load. Check URL.");
                          }}
                        />
                      </AspectRatio>
                    </div>
                  )}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="title">Title</Label>
                  <Input 
                    id="title" 
                    value={newTitle} 
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="Ferrari Exterior Detailing" 
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea 
                    id="description" 
                    value={newDescription} 
                    onChange={(e) => setNewDescription(e.target.value)}
                    placeholder="Complete exterior detail with paint protection" 
                  />
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
                  {isEditMode ? "Update" : "Add"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="bg-gray-900 rounded-lg border border-gray-800 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-gray-800">
                <TableHead className="text-gold">Preview</TableHead>
                <TableHead className="text-gold">Title</TableHead>
                <TableHead className="text-gold">Category</TableHead>
                <TableHead className="text-gold">Description</TableHead>
                <TableHead className="text-gold text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {galleryItems.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-gray-400">
                    No gallery items found. Add your first item!
                  </TableCell>
                </TableRow>
              ) : (
                galleryItems.map((item) => (
                  <TableRow key={item.id} className="border-gray-800">
                    <TableCell>
                      <div className="w-24 h-16 rounded overflow-hidden">
                        <img 
                          src={item.image} 
                          alt={item.title} 
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = "/placeholder.svg";
                          }}
                        />
                      </div>
                    </TableCell>
                    <TableCell className="font-medium text-white">{item.title}</TableCell>
                    <TableCell className="capitalize">{item.category}</TableCell>
                    <TableCell className="max-w-xs truncate">{item.description}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleEditItem(item)}
                        >
                          <Edit size={16} />
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="sm" 
                          onClick={() => handleDeleteItem(item.id)}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default GalleryManager;

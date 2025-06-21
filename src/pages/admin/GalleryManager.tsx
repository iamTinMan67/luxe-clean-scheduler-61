
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft, Upload, Image as ImageIcon, FolderPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGalleryManager } from "@/hooks/useGalleryManager";
import AlbumFormDialog from "@/components/gallery/AlbumFormDialog";
import AlbumsList from "@/components/gallery/AlbumsList";

const GalleryManager = () => {
  const {
    galleryItems,
    isEditMode,
    currentItem,
    newImages,
    setNewImages,
    newCategory,
    setNewCategory,
    open,
    setOpen,
    handleEditItem,
    handleDeleteItem,
    removeImageFromAlbum,
    handleCancel,
    handleSave,
    resetForm
  } = useGalleryManager();

  // Transform gallery items to match AlbumsList expectations
  const albums = galleryItems.map(item => ({
    id: item.id,
    name: item.category,
    images: item.images
  }));

  const handleImageUpload = (files: FileList) => {
    // Handle image upload logic here
    console.log("Upload files:", files);
  };

  const handleDeleteImage = () => {
    // Handle image deletion logic here
    console.log("Delete image");
  };

  const handleCreateAlbum = (albumData: any) => {
    handleSave();
  };

  const handleDeleteAlbum = (albumId: number) => {
    handleDeleteItem(albumId);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container mx-auto py-12 px-4"
    >
      <div className="flex items-center mb-8">
        <Link 
          to="/admin/management" 
          className="flex items-center space-x-2 text-yellow-400 hover:text-yellow-300 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Management</span>
        </Link>
      </div>

      <div className="md:flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-white text-center md:text-left mb-4 md:mb-0">
          Gallery Manager
        </h1>
        <Button onClick={() => setOpen(true)}>
          <FolderPlus className="mr-2 w-4 h-4" />
          Create Album
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Album Management Section */}
        <Card className="bg-black/60 border-gold/30">
          <CardHeader>
            <CardTitle className="text-white">Albums</CardTitle>
          </CardHeader>
          <CardContent>
            <AlbumsList
              galleryItems={albums}
              selectedAlbum={currentItem}
              onSelectAlbum={handleEditItem}
              onDeleteAlbum={handleDeleteAlbum}
              loading={false}
            />
          </CardContent>
        </Card>

        {/* Image Management Section */}
        <Card className="bg-black/60 border-gold/30">
          <CardHeader>
            <CardTitle className="text-white">Images</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col space-y-4">
              <div className="flex items-center space-x-4">
                <Button asChild>
                  <label htmlFor="upload-image">
                    <Upload className="mr-2 w-4 h-4" />
                    Upload Image
                  </label>
                </Button>
                <input
                  type="file"
                  id="upload-image"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files) {
                      handleImageUpload(e.target.files);
                    }
                  }}
                  multiple
                />
                {currentItem && (
                  <Button variant="destructive" onClick={handleDeleteImage}>
                    <ImageIcon className="mr-2 w-4 h-4" />
                    Delete Image
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-3 gap-4">
                {newImages.map((image, index) => (
                  <div key={index} className="relative">
                    <img
                      src={image}
                      alt={`Image ${index}`}
                      className="rounded-md object-cover aspect-square"
                    />
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <AlbumFormDialog
        open={open}
        onClose={() => setOpen(false)}
        onCreateAlbum={handleCreateAlbum}
      />
    </motion.div>
  );
};

export default GalleryManager;

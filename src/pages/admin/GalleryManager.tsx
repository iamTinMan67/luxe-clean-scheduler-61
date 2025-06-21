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
    albums,
    selectedAlbum,
    setSelectedAlbum,
    images,
    setImages,
    isDialogOpen,
    setIsDialogOpen,
    loading,
    searchTerm,
    setSearchTerm,
    handleImageUpload,
    handleDeleteImage,
    handleCreateAlbum,
    handleDeleteAlbum
  } = useGalleryManager();

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
        <Button onClick={() => setIsDialogOpen(true)}>
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
              albums={albums}
              selectedAlbum={selectedAlbum}
              onSelectAlbum={setSelectedAlbum}
              onDeleteAlbum={handleDeleteAlbum}
              loading={loading}
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
                {selectedAlbum && (
                  <Button variant="destructive" onClick={handleDeleteImage}>
                    <ImageIcon className="mr-2 w-4 h-4" />
                    Delete Image
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-3 gap-4">
                {images.map((image, index) => (
                  <div key={index} className="relative">
                    <img
                      src={image.url}
                      alt={image.name}
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
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onCreateAlbum={handleCreateAlbum}
      />
    </motion.div>
  );
};

export default GalleryManager;

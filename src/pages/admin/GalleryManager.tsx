
import { useGalleryManager } from "@/hooks/useGalleryManager";
import GalleryHeader from "@/components/gallery/GalleryHeader";
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
    handleSave
  } = useGalleryManager();

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-24">
        <GalleryHeader onAddAlbum={() => setOpen(true)} />

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

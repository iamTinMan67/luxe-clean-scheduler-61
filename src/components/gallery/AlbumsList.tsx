
import AlbumItem from "./AlbumItem";

interface GalleryItem {
  id: number;
  category: string;
  images: string[];
}

interface AlbumsListProps {
  galleryItems: GalleryItem[];
  onEdit: (item: GalleryItem) => void;
  onDelete: (id: number) => void;
  onRemoveImage: (itemId: number, imageIndex: number) => void;
}

const AlbumsList = ({ 
  galleryItems, 
  onEdit, 
  onDelete, 
  onRemoveImage 
}: AlbumsListProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {galleryItems.length === 0 ? (
        <div className="col-span-full text-center p-12 bg-gray-900 rounded-lg border border-gray-800 text-gray-400">
          No albums found. Add your first album!
        </div>
      ) : (
        galleryItems.map((item) => (
          <AlbumItem 
            key={item.id}
            item={item}
            onEdit={onEdit}
            onDelete={onDelete}
            onRemoveImage={onRemoveImage}
          />
        ))
      )}
    </div>
  );
};

export default AlbumsList;

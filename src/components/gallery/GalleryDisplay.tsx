import React, { useState } from "react";
import { motion } from "framer-motion";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import FeedbackDisplay from "./FeedbackDisplay";

interface GalleryItem {
  id: number;
  category: string;
  images: string[];
  title?: string;
  description?: string;
  customerReview?: {
    rating: number;
    comment: string;
    date: Date | string;
    customerName?: string;
  };
  bookingId?: string;
  vehicleId?: string;
}

const GalleryDisplay = ({ galleryItems }: { galleryItems: GalleryItem[] }) => {
  const [open, setOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleImageClick = (imageSrc: string) => {
    setSelectedImage(imageSrc);
    setOpen(true);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {galleryItems.map((item) => (
        <motion.div
          key={item.id}
          className="relative rounded-lg overflow-hidden shadow-md transition-transform duration-300 hover:scale-105"
          whileHover={{ y: -5 }}
        >
          <AspectRatio ratio={16 / 9}>
            <img
              src={item.images[0]}
              alt={item.title || "Gallery Image"}
              className="object-cover w-full h-full cursor-pointer"
              onClick={() => handleImageClick(item.images[0])}
            />
          </AspectRatio>
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black to-transparent opacity-70"></div>
          <div className="absolute bottom-0 left-0 p-4 w-full">
            <h3 className="text-lg font-semibold text-white">{item.title}</h3>
            <p className="text-sm text-gray-300">{item.description}</p>
            <Badge className="absolute top-2 right-2">{item.category}</Badge>
          </div>
          {item.customerReview && (
            <FeedbackDisplay customerReview={item.customerReview} />
          )}
        </motion.div>
      ))}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[500px] bg-black border-gray-800 border">
          {selectedImage && (
            <img
              src={selectedImage}
              alt="Full Size"
              className="w-full rounded-md"
            />
          )}
          <Button
            variant="secondary"
            size="sm"
            className="mt-4"
            onClick={() => setOpen(false)}
          >
            Close
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GalleryDisplay;

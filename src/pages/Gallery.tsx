
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import GalleryDisplay from "@/components/gallery/GalleryDisplay";
import GalleryTestimonials from "@/components/gallery/GalleryTestimonials";
import { GalleryItem, Testimonial, getDefaultItems, getTestimonials } from "@/utils/galleryData";

const Gallery = () => {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  
  // Load gallery items from localStorage or use defaults
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
        setGalleryItems(getDefaultItems());
      }
    } else {
      setGalleryItems(getDefaultItems());
    }
    
    // Set testimonials
    setTestimonials(getTestimonials());
  }, []);
  
  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <section className="relative py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white">
              Our Work <span className="text-gold">Gallery</span>
            </h1>
            <p className="text-xl text-gray-300">
              Browse through our portfolio of previous work
            </p>
          </motion.div>
          
          {/* Gallery Component */}
          <GalleryDisplay galleryItems={galleryItems} />
        </div>
      </section>
      
      {/* Testimonials Component */}
      <GalleryTestimonials testimonials={testimonials} />
    </div>
  );
};

export default Gallery;


import { useState } from "react";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AspectRatio } from "@/components/ui/aspect-ratio";

interface GalleryItem {
  id: number;
  category: string;
  images: string[];
  title?: string;
  description?: string;
}

interface GalleryDisplayProps {
  galleryItems: GalleryItem[];
}

const GalleryDisplay = ({ galleryItems }: GalleryDisplayProps) => {
  const [activeTab, setActiveTab] = useState("all");
  
  const fadeInUpVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: [0.48, 0.15, 0.25, 0.96]
      }
    })
  };
  
  const filteredItems = activeTab === "all" 
    ? galleryItems 
    : galleryItems.filter(item => item.category === activeTab);
  
  return (
    <div className="mb-12">
      <Tabs defaultValue="all" onValueChange={setActiveTab}>
        <div className="flex justify-center mb-8">
          <TabsList className="bg-gray-900 border border-gray-800">
            <TabsTrigger 
              value="all"
              className="data-[state=active]:bg-gold data-[state=active]:text-black"
            >
              All
            </TabsTrigger>
            <TabsTrigger 
              value="exterior"
              className="data-[state=active]:bg-gold data-[state=active]:text-black"
            >
              Exterior
            </TabsTrigger>
            <TabsTrigger 
              value="interior"
              className="data-[state=active]:bg-gold data-[state=active]:text-black"
            >
              Interior
            </TabsTrigger>
            <TabsTrigger 
              value="wheels"
              className="data-[state=active]:bg-gold data-[state=active]:text-black"
            >
              Wheels
            </TabsTrigger>
            <TabsTrigger 
              value="commercial"
              className="data-[state=active]:bg-gold data-[state=active]:text-black"
            >
              Commercial
            </TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value={activeTab} className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredItems.map((item, index) => (
              <motion.div
                key={item.id}
                custom={index}
                initial="hidden"
                animate="visible"
                variants={fadeInUpVariants}
                className="group bg-gray-900 rounded-lg overflow-hidden border border-gray-800 hover:border-gold/50 transition-all"
              >
                <div className="relative">
                  <AspectRatio ratio={16 / 9}>
                    <img 
                      src={item.images && item.images.length > 0 ? item.images[0] : "/placeholder.svg"} 
                      alt={item.title || "Gallery image"}
                      className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                      onError={(e) => {
                        e.currentTarget.src = "/placeholder.svg";
                      }}
                    />
                  </AspectRatio>
                  <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-60"></div>
                </div>
                
                {(item.title || item.description) && (
                  <div className="p-4">
                    {item.title && <h3 className="text-lg font-semibold text-white mb-1">{item.title}</h3>}
                    {item.description && <p className="text-gray-400 text-sm">{item.description}</p>}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default GalleryDisplay;

import { useState } from "react";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AspectRatio } from "@/components/ui/aspect-ratio";

const Gallery = () => {
  const [activeTab, setActiveTab] = useState("all");
  
  const galleryItems = [
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
  
  const testimonials = [
    {
      id: 1,
      name: "James Wilson",
      vehicle: "Bentley Continental GT",
      image: "https://images.unsplash.com/photo-1557862921-37829c790f19?q=80&w=1171&auto=format&fit=crop",
      text: "Absolutely outstanding service. My Bentley looks better than the day I bought it. The attention to detail is remarkable, and the ceramic coating has kept it looking pristine for months."
    },
    {
      id: 2,
      name: "Sarah Mitchell",
      vehicle: "Range Rover Autobiography",
      image: "https://images.unsplash.com/photo-1619468129361-605ebea04b44?q=80&w=1171&auto=format&fit=crop",
      text: "I've tried many valeting services but Mid-Cheshire is by far the best. They take such care with every aspect of the cleaning process with an outstanding finish. My Range Rover has never looked better."
    },
    {
      id: 3,
      name: "Emma Thompson",
      vehicle: "Audi RS6 Avant",
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1288&auto=format&fit=crop",
      text: "The Elite package was worth every penny. My Audi hasn't looked this good since I drove it off the showroom floor. The paint correction work was flawless."
    }
  ];
  
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
              Browse through our portfolio of premium vehicle detailing work
            </p>
          </motion.div>
          
          {/* Gallery Tabs */}
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
                            src={item.image} 
                            alt={item.title}
                            className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                          />
                        </AspectRatio>
                        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-60"></div>
                      </div>
                      
                      <div className="p-4">
                        <h3 className="text-lg font-semibold text-white mb-1">{item.title}</h3>
                        <p className="text-gray-400 text-sm">{item.description}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </section>
      
      {/* Testimonials Section */}
      <section className="py-24 bg-gradient-to-b from-black to-gray-900">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
              What Our Clients Say (most recent first) no cherry-picking
            </h2>
            <motion.div 
              className="w-20 h-1 bg-gold mx-auto"
              initial={{ width: 0 }}
              whileInView={{ width: 80 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            ></motion.div>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="bg-black rounded-lg p-6 border border-gray-800 flex flex-col md:flex-row gap-6 items-start"
              >
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden flex-shrink-0 border-2 border-gold">
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <div className="text-5xl text-gold/20 absolute">"</div>
                  <p className="text-gray-300 relative pl-6 mb-4">{testimonial.text}</p>
                  <div>
                    <h4 className="text-white font-medium">{testimonial.name}</h4>
                    <p className="text-gray-400 text-sm">{testimonial.vehicle}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Gallery;

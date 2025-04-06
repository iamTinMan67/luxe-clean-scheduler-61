
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const HeroSection = () => {
  const navigate = useNavigate();
  
  const handleBooking = () => {
    navigate("/services");
  };

  return (
    <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden pt-16">
      {/* Hero Background */}
      <div 
        className="absolute inset-0 bg-black z-0 bg-cover bg-center bg-no-repeat brightness-50"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1635775017492-1eb854ae5c02?q=80&w=1932&auto=format&fit=crop')",
        }}
      ></div>
      
      {/* Overlay Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black z-10"></div>
      
      {/* Content */}
      <div className="container mx-auto px-4 relative z-20 text-center max-w-4xl mt-[-6rem]">
        {/* Logo at the top */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7 }}
        >
          <img 
            src="/lovable-uploads/db88bc12-bb88-4318-a91c-da8a3314c406.png" 
            alt="Mid-Cheshire Valeting" 
            className="mx-auto w-auto h-40 md:h-56"
          />
        </motion.div>
        
        <motion.p 
          className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.4 }}
        >
          Professional cleaning and detailing services for high-end results. From cars, boats even airoplanes, we do the lot!!
        </motion.p>
        
        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6 }}
        >
          <button 
            onClick={handleBooking}
            className="gold-gradient text-black px-8 py-3 rounded-md font-medium text-lg flex items-center justify-center hover:shadow-lg hover:shadow-gold/20 transition-all"
          >
            Our Packages
            <ArrowRight className="ml-2 h-5 w-5" />
          </button>
          
          <button 
            onClick={() => navigate("/gallery")}
            className="bg-white/10 backdrop-blur-sm text-white border border-white/20 px-8 py-3 rounded-md font-medium text-lg hover:bg-white/20 transition-all"
          >
            View Our Gallery
          </button>
        </motion.div>
      </div>
      
      {/* Scroll indicator */}
      <motion.div 
        className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 10, 0] }}
        transition={{ 
          opacity: { delay: 1, duration: 1 },
          y: { repeat: Infinity, duration: 1.5, ease: "easeInOut" }
        }}
      >
        <div className="h-14 w-8 rounded-full border-2 border-white/30 flex justify-center">
          <div className="w-1.5 h-3 bg-gold rounded-full mt-2"></div>
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;

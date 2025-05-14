
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
          Professional self-sufficiant, mobile, cleaning and detailing services for high-end results. From cars, boats even <span className="text-gold">airplanes</span>, we do the lot!
        </motion.p>
    </section>
  );
};

export default HeroSection;

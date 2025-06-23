
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
      <div className="container mx-auto px-4 relative z-20 text-center max-w-4xl">
        {/* Logo */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7 }}
        >
          <img 
            src="/lovable-uploads/20bcd8db-4042-4d14-9238-3fe36de9757f.png" 
            alt="Mid-Cheshire Valeting" 
            className="mx-auto w-auto h-32 md:h-40 drop-shadow-lg"
          />
        </motion.div>

        {/* Main Title */}
        <motion.h1 
          className="text-5xl md:text-7xl font-bold text-white mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          Mid-Cheshire
          <span className="text-gold block">Valeting</span>
        </motion.h1>
        
        {/* Subtitle */}
        <motion.h2 
          className="text-2xl md:text-3xl text-gray-300 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
        >
          Premium Car Care at Your Location
        </motion.h2>
        
        {/* Description */}
        <motion.p 
          className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.6 }}
        >
          Fully, self-sufficient, mobile, cleaning and fine-detailing services. From cars, boats
          and even <span className="text-gold">airplanes.</span> We can do the lot!
          <br></br>
          <br></br>
          We strive for excellence and <span className="text-gold">high-end</span> results
          every time. You can also check our progress, almost in REAL-TIME, with our UNIQUE Track Our Progress."
        </motion.p>

        {/* Call to Action Button */}
        <motion.button
          onClick={handleBooking}
          className="bg-gold text-black px-8 py-4 rounded-lg text-lg font-semibold hover:bg-yellow-400 transition-all duration-300 flex items-center gap-2 mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.8 }}
          whileHover={{ scale: 1.05 }}
        >
          Book Your Service
          <ArrowRight size={20} />
        </motion.button>
      </div>
    </section>
  );
};

export default HeroSection;

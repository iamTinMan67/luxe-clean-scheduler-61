
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const CTASection = () => {
  const navigate = useNavigate();
  
  const handleBooking = () => {
    navigate("/services");
  };
  
  return (
    <section className="py-20 relative">
      <div 
        className="absolute inset-0 bg-black z-0 bg-cover bg-center bg-no-repeat brightness-30"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1550355291-bbee04a92027?q=80&w=1936&auto=format&fit=crop')",
        }}
      ></div>
      
      <div className="absolute inset-0 bg-black/70 z-0"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <motion.h2 
            className="text-3xl md:text-5xl font-bold mb-6 text-white"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Ready to Experience the <span className="text-gold">Difference</span>?
          </motion.h2>
          
          <motion.p 
            className="text-xl text-gray-200 mb-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Book your service today and give your vehicle the care that <span className="text-gold">You</span> deserve.
          </motion.p>
          
          <motion.button 
            onClick={handleBooking}
            className="gold-gradient text-black px-10 py-4 rounded-md font-medium text-lg hover:shadow-xl hover:shadow-gold/20 transition-all"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            Book Me In
          </motion.button>
        </div>
      </div>
    </section>
  );
};

export default CTASection;

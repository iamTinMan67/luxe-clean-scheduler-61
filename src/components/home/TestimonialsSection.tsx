
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const TestimonialsSection = () => {
  const navigate = useNavigate();
  
  const testimonials = [
    {
      name: "James Wilson",
      car: "Bentley Continental GT",
      text: "Absolutely outstanding service. My Bentley looks better than the day I bought it. The attention to detail is remarkable."
    },
    {
      name: "Sarah Mitchell",
      car: "Range Rover Autobiography",
      text: "I've tried many valeting services but Mid-Cheshire is by far the best. They take such care with every aspect of the cleaning process and with an outstanding finish."
    }
  ];
  
  return (
    <section className="py-16 bg-gradient-to-b from-black to-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <motion.h2 
            className="text-3xl md:text-4xl font-bold mb-4 text-white"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            What Our Clients Say
          </motion.h2>
          <motion.div 
            className="w-20 h-1 bg-gold mx-auto"
            initial={{ width: 0 }}
            whileInView={{ width: 80 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          ></motion.div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              className="bg-black rounded-lg p-8 relative glass-morphism"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <div className="text-6xl text-gold/20 absolute top-4 left-4">"</div>
              <p className="text-gray-300 relative z-10 mb-6">{testimonial.text}</p>
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-gold/20 flex items-center justify-center text-gold">
                  {testimonial.name.charAt(0)}
                </div>
                <div className="ml-4">
                  <h4 className="text-white font-medium">{testimonial.name}</h4>
                  <p className="text-gray-400 text-sm">{testimonial.car}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <button 
            onClick={() => navigate("/gallery")}
            className="text-gold hover:text-white border-b border-gold hover:border-white transition-colors inline-flex items-center"
          >
            View more testimonials
            <ArrowRight className="ml-2 h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;

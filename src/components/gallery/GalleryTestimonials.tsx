
import { motion } from "framer-motion";

interface Testimonial {
  id: number;
  name: string;
  vehicle: string;
  image: string;
  text: string;
}

interface GalleryTestimonialsProps {
  testimonials: Testimonial[];
}

const GalleryTestimonials = ({ testimonials }: GalleryTestimonialsProps) => {
  return (
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
            What Our Clients Say (most recent first) no cherry-picking. our reputation is only as good as our last customer.
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
  );
};

export default GalleryTestimonials;

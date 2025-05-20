
import { motion } from "framer-motion";

const FeedbackSectionHeader = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="text-center mb-12"
    >
      <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
        Customer <span className="text-gold">Feedback</span>
      </h2>
      <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
        Real feedback from our customers. We're proud to share their experiences and testimonials.
      </p>
      <motion.div 
        className="w-20 h-1 bg-gold mx-auto"
        initial={{ width: 0 }}
        whileInView={{ width: 80 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.3 }}
      ></motion.div>
    </motion.div>
  );
};

export default FeedbackSectionHeader;

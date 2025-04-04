
import { motion } from "framer-motion";

const ServiceHero = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="text-center max-w-3xl mx-auto mb-16"
    >
      <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white">
        Customize Your <span className="text-gold">Requirements</span>
      </h1>
      <p className="text-xl text-gray-300">
        Choose the best cleaning package for your vehicle or mix and select any additional services you require.
      </p>
    </motion.div>
  );
};

export default ServiceHero;

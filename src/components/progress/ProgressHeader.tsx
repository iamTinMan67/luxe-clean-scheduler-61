
import { motion } from "framer-motion";

const ProgressHeader = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="text-center max-w-3xl mx-auto mb-16"
    >
      <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white">
        Track Your <span className="text-gold">Valet</span>
      </h1>
      <p className="text-xl text-gray-300">
        Follow the real-time status of your vehicle's detailing process
      </p>
    </motion.div>
  );
};

export default ProgressHeader;

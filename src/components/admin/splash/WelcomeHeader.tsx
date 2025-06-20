
import { motion } from "framer-motion";

const WelcomeHeader = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="text-center mb-8"
    >
      <h2 className="text-2xl font-bold text-white mb-2">Admin Dashboard</h2>
    </motion.div>
  );
};

export default WelcomeHeader;

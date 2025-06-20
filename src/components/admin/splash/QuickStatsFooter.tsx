
import { motion } from "framer-motion";

const QuickStatsFooter = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.8 }}
      className="mt-12 p-6 bg-gray-900/50 border border-gray-800 rounded-lg"
    >
      <div className="flex items-center justify-center space-x-8 text-center">
        <div>
          <div className="text-2xl font-bold text-gold">13</div>
          <div className="text-sm text-gray-400">Admin Functions</div>
        </div>
        <div className="w-px h-12 bg-gray-700"></div>
        <div>
          <div className="text-2xl font-bold text-gold">5</div>
          <div className="text-sm text-gray-400">Categories</div>
        </div>
        <div className="w-px h-12 bg-gray-700"></div>
        <div>
          <div className="text-2xl font-bold text-gold">∞</div>
          <div className="text-sm text-gray-400">Possibilities</div>
        </div>
      </div>
    </motion.div>
  );
};

export default QuickStatsFooter;

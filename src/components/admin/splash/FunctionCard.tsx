
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { AdminFunction } from "./types";

interface FunctionCardProps {
  func: AdminFunction;
  index: number;
  categoryIndex: number;
  isFeatured: boolean;
}

const FunctionCard = ({ func, index, categoryIndex, isFeatured }: FunctionCardProps) => {
  const FunctionIcon = func.icon;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ 
        duration: 0.3, 
        delay: categoryIndex * 0.1 + index * 0.05 
      }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Link to={func.path}>
        <Card className={`${isFeatured ? 'bg-gradient-to-r from-gold/10 to-gold/5 border-gold/30' : 'bg-gray-900 border-gray-800'} hover:border-gold/50 transition-all duration-300 cursor-pointer group`}>
          <CardContent className={`${isFeatured ? 'p-8' : 'p-6'}`}>
            <div className="flex items-start space-x-4">
              <div className={`${isFeatured ? 'p-4' : 'p-3'} bg-gray-800 rounded-lg group-hover:bg-gold/20 transition-colors`}>
                <FunctionIcon className={`${isFeatured ? 'w-8 h-8' : 'w-6 h-6'} text-gold`} />
              </div>
              <div className="flex-1">
                <h4 className={`${isFeatured ? 'text-lg' : 'text-base'} font-semibold text-white mb-1 group-hover:text-gold transition-colors`}>
                  {func.title}
                </h4>
                <p className="text-sm text-gray-400">
                  {func.description}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
};

export default FunctionCard;

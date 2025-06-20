
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
        <Card className={`${isFeatured ? 'bg-gradient-to-r from-blue-500/10 to-blue-500/5 border-blue-500/30' : 'bg-gray-900 border-gray-800'} hover:border-gold/50 transition-all duration-300 cursor-pointer group`}>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gray-800 rounded-lg group-hover:bg-gold/20 transition-colors">
                <FunctionIcon className="w-5 h-5 text-gold" />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-semibold text-white group-hover:text-gold transition-colors">
                  {func.title}
                </h4>
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
};

export default FunctionCard;

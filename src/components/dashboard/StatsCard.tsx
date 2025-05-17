
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  trend: string;
  icon: React.ReactNode;
  index: number;
}

const StatsCard = ({ title, value, change, trend, icon, index }: StatCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Card className="bg-gray-900 border-gray-800 p-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-gray-400 text-sm mb-1">{title}</p>
            <h3 className="text-2xl font-bold text-white">{value}</h3>
          </div>
          <div className="h-10 w-10 rounded-full bg-gray-800 flex items-center justify-center">
            {icon}
          </div>
        </div>
        <div className="mt-2 flex items-center">
          <TrendingUp className={`h-4 w-4 mr-1 ${
            trend === 'up' ? 'text-green-500' : 'text-red-500'
          }`} />
          <span className={`text-xs ${
            trend === 'up' ? 'text-green-500' : 'text-red-500'
          }`}>
            {change} from last month
          </span>
        </div>
      </Card>
    </motion.div>
  );
};

export default StatsCard;


import React from 'react';
import { motion } from "framer-motion";
import { Clock } from "lucide-react";

interface CurrentActivityProps {
  currentStep: {
    name: string;
    estimatedTime?: string;
  } | null;
}

const CurrentActivity: React.FC<CurrentActivityProps> = ({ currentStep }) => {
  if (!currentStep) return null;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="bg-gold/10 backdrop-blur-sm rounded-lg p-6 border border-gold/30 mb-8"
    >
      <div className="flex items-center">
        <Clock className="h-6 w-6 text-gold mr-3" />
        <div>
          <h3 className="text-lg font-medium text-white">Current Activity</h3>
          <p className="text-gold">{currentStep.name}</p>
          {currentStep.estimatedTime && (
            <p className="text-gray-400 text-sm mt-1">
              Estimated time: {currentStep.estimatedTime}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default CurrentActivity;


import React from 'react';
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

interface Step {
  id: number;
  name: string;
  completed: boolean;
  time?: string;
  estimatedTime?: string;
}

interface ServiceTimelineProps {
  steps: Step[];
  currentStepIndex: number;
}

const ServiceTimeline: React.FC<ServiceTimelineProps> = ({ steps, currentStepIndex }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="bg-gray-900/50 backdrop-blur-sm rounded-lg p-6 border border-gray-800"
    >
      <h3 className="text-xl font-bold text-white mb-6">Service Timeline</h3>
      
      <div className="space-y-8">
        {steps.map((step, index) => (
          <div key={step.id} className="relative">
            {/* Timeline line */}
            {index < steps.length - 1 && (
              <div className={`absolute left-4 top-5 w-0.5 h-full -ml-[2px] ${
                step.completed && steps[index + 1].completed
                  ? "bg-gold"
                  : "bg-gray-700"
              }`}></div>
            )}
            
            {/* Timeline item */}
            <div className="flex gap-4">
              <div className={`h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                step.completed 
                  ? "bg-gold text-black"
                  : currentStepIndex === index
                  ? "bg-gold/20 border border-gold/50 text-gold"
                  : "bg-gray-800 text-gray-500"
              }`}>
                {step.completed ? (
                  <CheckCircle2 className="h-5 w-5" />
                ) : (
                  <span>{index + 1}</span>
                )}
              </div>
              
              <div className="flex-1">
                <h4 className={`font-medium ${
                  step.completed 
                    ? "text-white"
                    : currentStepIndex === index
                    ? "text-gold"
                    : "text-gray-400"
                }`}>
                  {step.name}
                </h4>
                
                {step.completed ? (
                  <p className="text-gray-400 text-sm">
                    Completed at {step.time}
                  </p>
                ) : (
                  <p className="text-gray-500 text-sm">
                    {currentStepIndex === index 
                      ? `In progress - Estimated time: ${step.estimatedTime}`
                      : "Pending"}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default ServiceTimeline;

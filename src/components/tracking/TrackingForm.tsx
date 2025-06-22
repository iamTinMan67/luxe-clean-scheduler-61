
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useTrackingData } from "@/hooks/tracking/useTrackingData";
import TrackingNotFound from "./TrackingNotFound";
import BookingDetailsCard from "./BookingDetailsCard";
import ServiceTasksCard from "./ServiceTasksCard";

interface TrackingFormProps {
  bookingId: string;
}

const TrackingForm = ({ bookingId }: TrackingFormProps) => {
  const { booking, tasks, isInspected, progress } = useTrackingData(bookingId);
  const [lastUpdateTime, setLastUpdateTime] = useState(new Date());

  // Listen for service progress updates with enhanced real-time feedback
  useEffect(() => {
    const handleProgressUpdate = (event: CustomEvent) => {
      if (event.detail.bookingId === bookingId) {
        console.log('Real-time progress update received:', event.detail);
        setLastUpdateTime(new Date());
        // The useTrackingData hook will automatically refresh due to localStorage changes
      }
    };

    window.addEventListener('serviceProgressUpdate', handleProgressUpdate as EventListener);
    
    return () => {
      window.removeEventListener('serviceProgressUpdate', handleProgressUpdate as EventListener);
    };
  }, [bookingId]);

  // Enhanced completion time calculation
  const calculateEstimatedCompletion = () => {
    if (!tasks.length) return null;
    
    // Don't show completion time for placeholder tasks
    const isPlaceholderTasks = tasks.every(task => task.id.startsWith('placeholder-'));
    if (isPlaceholderTasks) return "Awaiting inspection completion";
    
    const incompleteTasks = tasks.filter(task => !task.completed);
    const remainingTime = incompleteTasks.reduce((total, task) => total + task.allocatedTime, 0);
    
    if (remainingTime === 0) return "Completed";
    
    const now = new Date();
    const estimatedCompletion = new Date(now.getTime() + remainingTime * 60000);
    return estimatedCompletion.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };
  
  if (!booking) {
    return <TrackingNotFound />;
  }

  const estimatedCompletion = calculateEstimatedCompletion();
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="container mx-auto py-8 px-4"
    >
      {/* Real-time update indicator */}
      <motion.div
        key={lastUpdateTime.getTime()}
        initial={{ scale: 1 }}
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 0.3 }}
        className="mb-4"
      >
        <div className="text-center">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-green-900/20 text-green-400 text-sm">
            <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
            Live Tracking Active
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Last updated: {lastUpdateTime.toLocaleTimeString()}
          </p>
        </div>
      </motion.div>

      <BookingDetailsCard 
        booking={booking}
        progress={progress}
        estimatedCompletion={estimatedCompletion}
      />
      
      <ServiceTasksCard 
        isInspected={isInspected}
        tasks={tasks}
      />

      {/* Enhanced status messaging */}
      {booking.status === "inspecting" && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 p-4 border border-orange/30 rounded-md bg-orange/10 text-center"
        >
          <h3 className="text-orange-400 font-semibold mb-2">Inspection in Progress</h3>
          <p className="text-orange-300 text-sm">
            Our team is currently conducting a thorough inspection of your vehicle. 
            Detailed service tasks will be available once the inspection is complete.
          </p>
        </motion.div>
      )}

      {booking.status === "finished" && progress === 100 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 p-4 border border-green/30 rounded-md bg-green/10 text-center"
        >
          <h3 className="text-green-400 font-semibold mb-2">Service Complete!</h3>
          <p className="text-green-300 text-sm">
            Your vehicle service has been completed successfully. You should receive an invoice and feedback request shortly.
          </p>
        </motion.div>
      )}
    </motion.div>
  );
};

export default TrackingForm;

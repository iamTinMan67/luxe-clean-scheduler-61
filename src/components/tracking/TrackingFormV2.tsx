
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useTrackingDataV2 } from "@/hooks/tracking/useTrackingDataV2";
import TrackingNotFound from "./TrackingNotFound";
import BookingDetailsCard from "./BookingDetailsCard";
import ServiceTasksCard from "./ServiceTasksCard";
import { AlertCircle, Loader2 } from "lucide-react";

interface TrackingFormV2Props {
  bookingId: string;
}

const TrackingFormV2 = ({ bookingId }: TrackingFormV2Props) => {
  const { booking, tasks, isInspected, progress, isLoading, error } = useTrackingDataV2(bookingId);
  const [lastUpdateTime, setLastUpdateTime] = useState(new Date());

  // Listen for service progress updates
  useEffect(() => {
    const handleProgressUpdate = (event: CustomEvent) => {
      if (event.detail.bookingId === bookingId) {
        console.log('Real-time progress update received in TrackingFormV2:', event.detail);
        setLastUpdateTime(new Date());
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

  // Loading state
  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-gold" />
            <p className="text-gray-400">Loading tracking information...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <AlertCircle className="h-8 w-8 mx-auto mb-4 text-red-400" />
            <p className="text-red-400 mb-2">Error loading tracking data</p>
            <p className="text-gray-500 text-sm">{error}</p>
          </div>
        </div>
      </div>
    );
  }
  
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

export default TrackingFormV2;

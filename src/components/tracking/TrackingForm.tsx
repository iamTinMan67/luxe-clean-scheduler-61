
import { motion } from "framer-motion";
import { useEffect } from "react";
import { useTrackingData } from "@/hooks/tracking/useTrackingData";
import TrackingNotFound from "./TrackingNotFound";
import BookingDetailsCard from "./BookingDetailsCard";
import ServiceTasksCard from "./ServiceTasksCard";

interface TrackingFormProps {
  bookingId: string;
}

const TrackingForm = ({ bookingId }: TrackingFormProps) => {
  const { booking, tasks, isInspected, progress } = useTrackingData(bookingId);

  // Listen for service progress updates
  useEffect(() => {
    const handleProgressUpdate = (event: CustomEvent) => {
      if (event.detail.bookingId === bookingId) {
        console.log('Real-time progress update received:', event.detail);
        // The useTrackingData hook will automatically refresh due to localStorage changes
      }
    };

    window.addEventListener('serviceProgressUpdate', handleProgressUpdate as EventListener);
    
    return () => {
      window.removeEventListener('serviceProgressUpdate', handleProgressUpdate as EventListener);
    };
  }, [bookingId]);

  // Calculate estimated completion time based on remaining tasks
  const calculateEstimatedCompletion = () => {
    if (!tasks.length) return null;
    
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
      <BookingDetailsCard 
        booking={booking}
        progress={progress}
        estimatedCompletion={estimatedCompletion}
      />
      
      <ServiceTasksCard 
        isInspected={isInspected}
        tasks={tasks}
      />
    </motion.div>
  );
};

export default TrackingForm;

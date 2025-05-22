
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { getInspectionReport } from "@/services/inspectionService";
import { Booking } from "@/types/booking";
import { ServiceTaskItem } from "@/types/task";
import { Calendar, Clock, CheckCircle, Circle, AlertCircle } from "lucide-react";

interface TrackingFormProps {
  bookingId: string;
}

const TrackingForm = ({ bookingId }: TrackingFormProps) => {
  const [booking, setBooking] = useState<Booking | null>(null);
  const [tasks, setTasks] = useState<ServiceTaskItem[]>([]);
  const [isInspected, setIsInspected] = useState(false);
  const [progress, setProgress] = useState(0);
  const [sessionExpired, setSessionExpired] = useState(false);
  const navigate = useNavigate();

  // Load booking and tasks
  useEffect(() => {
    const loadBookingData = () => {
      // Load from confirmedBookings and plannerCalendarBookings
      const confirmedBookingsStr = localStorage.getItem('confirmedBookings');
      const plannerBookingsStr = localStorage.getItem('plannerCalendarBookings');
      
      let foundBooking: Booking | null = null;
      
      if (confirmedBookingsStr) {
        const confirmedBookings = JSON.parse(confirmedBookingsStr);
        foundBooking = confirmedBookings.find((b: Booking) => b.id === bookingId) || null;
      }
      
      if (!foundBooking && plannerBookingsStr) {
        const plannerBookings = JSON.parse(plannerBookingsStr);
        foundBooking = plannerBookings.find((b: Booking) => b.id === bookingId) || null;
      }
      
      // Check if booking found and has a valid status
      if (foundBooking) {
        setBooking(foundBooking);
        
        // Check if the booking is inspected
        if (foundBooking.status === "inspected") {
          setIsInspected(true);
        }
        
        // Start session timeout if booking is finished
        if (foundBooking.status === "finished") {
          startSessionTimeout();
        }
      } else {
        // Booking not found, redirect to tracking page
        navigate("/track");
      }
    };
    
    const loadTasks = () => {
      // Load service tasks
      const serviceProgressStr = localStorage.getItem('serviceProgress');
      
      if (serviceProgressStr) {
        const serviceProgress = JSON.parse(serviceProgressStr);
        const bookingProgress = serviceProgress.find((p: any) => p.bookingId === bookingId);
        
        if (bookingProgress && bookingProgress.tasks) {
          setTasks(bookingProgress.tasks);
          
          // Calculate progress
          const completedTasks = bookingProgress.tasks.filter((task: ServiceTaskItem) => task.completed).length;
          const totalTasks = bookingProgress.tasks.length;
          const calculatedProgress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
          setProgress(calculatedProgress);
        }
      }
    };
    
    loadBookingData();
    loadTasks();
  }, [bookingId, navigate]);
  
  // Start a session timeout of 15 minutes for finished bookings
  const startSessionTimeout = () => {
    const timeout = 15 * 60 * 1000; // 15 minutes in milliseconds
    
    // Set a timeout to expire the session
    setTimeout(() => {
      setSessionExpired(true);
    }, timeout);
  };
  
  // Redirect if session expired
  useEffect(() => {
    if (sessionExpired) {
      navigate("/track");
    }
  }, [sessionExpired, navigate]);
  
  if (!booking) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-amber-500 mb-4" />
          <h3 className="text-xl font-medium text-white mb-2">Booking Not Found</h3>
          <p className="text-gray-400">The booking you're looking for doesn't exist or you don't have permission to view it.</p>
        </div>
      </div>
    );
  }
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="container mx-auto py-8 px-4"
    >
      <Card className="bg-black/60 border-gold/30 mb-6">
        <CardHeader className="pb-2">
          <CardTitle className="text-white flex items-center justify-between">
            <span>Tracking Details: {booking.vehicle}</span>
            <span className="text-sm font-normal text-gold">
              {booking.packageType} Package
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2 text-sm mb-4">
            <div className="flex justify-between">
              <span className="text-gray-400">Customer:</span>
              <span className="text-white">{booking.customer}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Date & Time:</span>
              <span className="text-white flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                {new Date(booking.date).toLocaleDateString()} {booking.time}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Status:</span>
              <span className="text-gold">{booking.status}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Location:</span>
              <span className="text-white">{booking.location}</span>
            </div>
          </div>
          
          <div className="mt-4">
            <div className="flex justify-between mb-1 text-sm">
              <span className="text-gray-400">Service Progress</span>
              <span className="text-white">{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-black/60 border-gold/30">
        <CardHeader className="pb-2">
          <CardTitle className="text-white">Service Tasks</CardTitle>
        </CardHeader>
        <CardContent>
          {isInspected && (
            <div className="mb-4 p-3 border border-gold/30 rounded-md bg-gold/10">
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-gold mr-2" />
                <span className="text-gold font-medium">Inspection Completed</span>
              </div>
            </div>
          )}

          {tasks.length > 0 ? (
            <ul className="space-y-2">
              {tasks.map((task) => (
                <li key={task.id} className="flex items-center justify-between p-3 border border-gray-800 rounded-md bg-black/30">
                  <div className="flex items-center">
                    {task.completed ? (
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                    ) : (
                      <Circle className="h-5 w-5 text-gray-500 mr-2" />
                    )}
                    <span className={task.completed ? 'text-gray-400' : 'text-white'}>
                      {task.name}
                    </span>
                  </div>
                  <div className="flex items-center text-sm text-gray-400">
                    <Clock className="h-3.5 w-3.5 mr-1" />
                    {task.allocatedTime} min
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="py-8 text-center">
              <p className="text-gray-400">No tasks have been assigned yet.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default TrackingForm;

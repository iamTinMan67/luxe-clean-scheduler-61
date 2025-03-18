
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Clock, MapPin, User, Car, CalendarClock } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

const ProgressPage = () => {
  // Mock booking data - in a real app, this would come from your API/backend
  const [booking, setBooking] = useState({
    id: "BK-12345",
    customerName: "John Smith",
    vehicleType: "Porsche 911",
    packageType: "Elite",
    date: "2023-09-15",
    time: "10:00",
    location: "23 Hillcrest Avenue, London",
    status: "in-progress", // pending, confirmed, in-progress, completed
    progressPercentage: 65,
    steps: [
      { id: 1, name: "Booking Confirmed", completed: true, time: "2023-09-10 14:30" },
      { id: 2, name: "Pre-inspection Completed", completed: true, time: "2023-09-15 10:00" },
      { id: 3, name: "Wash & Decontamination", completed: true, time: "2023-09-15 10:30" },
      { id: 4, name: "Paint Correction", completed: true, time: "2023-09-15 11:45" },
      { id: 5, name: "Ceramic Coating Application", completed: false, estimatedTime: "45 minutes" },
      { id: 6, name: "Interior Detailing", completed: false, estimatedTime: "60 minutes" },
      { id: 7, name: "Final Inspection", completed: false, estimatedTime: "15 minutes" },
      { id: 8, name: "Customer Review", completed: false, estimatedTime: "10 minutes" }
    ]
  });
  
  // Function to send text report to customer
  const sendTextReport = () => {
    // In a real app, this would use an SMS API service
    console.log("Sending text report to customer:", booking.customerName);
    toast.success("Text report sent to customer", {
      description: `A completion report has been sent to ${booking.customerName}`
    });
  };
  
  // Function to update planner calendar status
  const updatePlannerCalendar = () => {
    // Get bookings from localStorage
    const pendingBookingsStr = localStorage.getItem('pendingBookings');
    if (!pendingBookingsStr) return;
    
    try {
      const pendingBookings = JSON.parse(pendingBookingsStr);
      // Find the current booking in pendingBookings by ID and update its status
      const updatedBookings = pendingBookings.map((b: any) => {
        if (b.id === booking.id) {
          return { ...b, status: "completed" };
        }
        return b;
      });
      
      // Save updated bookings back to localStorage
      localStorage.setItem('pendingBookings', JSON.stringify(updatedBookings));
      console.log("Updated booking status in planner calendar:", booking.id);
    } catch (error) {
      console.error("Error updating planner calendar:", error);
    }
  };
  
  // In a real app, you would fetch the booking status periodically
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate progress updates
      setBooking(prev => {
        // Don't increase beyond 100%
        if (prev.progressPercentage >= 100) {
          clearInterval(interval);
          return {
            ...prev,
            status: "completed",
            progressPercentage: 100,
            steps: prev.steps.map(step => ({ ...step, completed: true }))
          };
        }
        
        // Calculate which step should be completed based on progress
        const newProgressPercentage = Math.min(prev.progressPercentage + 2, 100);
        const stepsToComplete = Math.floor((newProgressPercentage / 100) * prev.steps.length);
        
        return {
          ...prev,
          progressPercentage: newProgressPercentage,
          status: newProgressPercentage === 100 ? "completed" : "in-progress",
          steps: prev.steps.map((step, index) => ({
            ...step,
            completed: index < stepsToComplete
          }))
        };
      });
    }, 3000); // Update every 3 seconds
    
    return () => clearInterval(interval);
  }, []);
  
  // Add effect to handle completion
  useEffect(() => {
    // When service is completed (100%), send text and update calendar
    if (booking.status === "completed" && booking.progressPercentage === 100) {
      sendTextReport();
      updatePlannerCalendar();
    }
  }, [booking.status, booking.progressPercentage]);
  
  // Calculate the current active step
  const currentStepIndex = booking.steps.findIndex(step => !step.completed);
  const currentStep = currentStepIndex !== -1 ? booking.steps[currentStepIndex] : null;
  
  // Format the date for display
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };
  
  return (
    <div className="min-h-screen bg-black">
      <section className="relative py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white">
              Track Your <span className="text-gold">Valet</span>
            </h1>
            <p className="text-xl text-gray-300">
              Follow the real-time status of your vehicle's detailing process
            </p>
          </motion.div>
          
          <div className="max-w-4xl mx-auto">
            {/* Booking Information Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-gray-900/50 backdrop-blur-sm rounded-lg p-6 border border-gray-800 mb-8"
            >
              <div className="flex justify-between items-start flex-wrap gap-4 mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">Booking #{booking.id}</h2>
                  <div className="flex items-center text-gray-400">
                    <CalendarClock className="h-4 w-4 mr-2 text-gold" />
                    <span>
                      {formatDate(booking.date)} at {booking.time}
                    </span>
                  </div>
                </div>
                
                <div className={`px-4 py-2 rounded-full ${
                  booking.status === 'completed' 
                    ? 'bg-green-900/30 text-green-400 border border-green-700'
                    : booking.status === 'in-progress'
                    ? 'bg-blue-900/30 text-blue-400 border border-blue-700'
                    : booking.status === 'confirmed'
                    ? 'bg-amber-900/30 text-amber-400 border border-amber-700'
                    : 'bg-gray-900/30 text-gray-400 border border-gray-700'
                }`}>
                  {booking.status === 'completed' && 'Completed'}
                  {booking.status === 'in-progress' && 'In Progress'}
                  {booking.status === 'confirmed' && 'Confirmed'}
                  {booking.status === 'pending' && 'Pending'}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-3">
                  <div className="flex items-start">
                    <User className="h-5 w-5 mr-3 text-gold mt-0.5" />
                    <div>
                      <h3 className="text-sm text-gray-400">Customer</h3>
                      <p className="text-white">{booking.customerName}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Car className="h-5 w-5 mr-3 text-gold mt-0.5" />
                    <div>
                      <h3 className="text-sm text-gray-400">Vehicle</h3>
                      <p className="text-white">{booking.vehicleType}</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-start">
                    <MapPin className="h-5 w-5 mr-3 text-gold mt-0.5" />
                    <div>
                      <h3 className="text-sm text-gray-400">Location</h3>
                      <p className="text-white">{booking.location}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 mr-3 text-gold mt-0.5" />
                    <div>
                      <h3 className="text-sm text-gray-400">Package</h3>
                      <p className="text-white">{booking.packageType} Package</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mb-2">
                <div className="flex justify-between mb-2">
                  <h3 className="text-white font-medium">Overall Progress</h3>
                  <span className="text-gold font-medium">{booking.progressPercentage}%</span>
                </div>
                <Progress 
                  value={booking.progressPercentage} 
                  className="h-2 bg-gray-800"
                />
              </div>
            </motion.div>
            
            {/* Current Activity */}
            {currentStep && (
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
                    <p className="text-gray-400 text-sm mt-1">
                      Estimated time: {currentStep.estimatedTime}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
            
            {/* Progress Timeline */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-gray-900/50 backdrop-blur-sm rounded-lg p-6 border border-gray-800"
            >
              <h3 className="text-xl font-bold text-white mb-6">Service Timeline</h3>
              
              <div className="space-y-8">
                {booking.steps.map((step, index) => (
                  <div key={step.id} className="relative">
                    {/* Timeline line */}
                    {index < booking.steps.length - 1 && (
                      <div className={`absolute left-4 top-5 w-0.5 h-full -ml-[2px] ${
                        step.completed && booking.steps[index + 1].completed
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
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProgressPage;

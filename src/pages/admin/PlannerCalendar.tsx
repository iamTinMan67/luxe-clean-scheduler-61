
import { useState } from "react";
import { motion } from "framer-motion";
import { format, addDays, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, 
  Clock, User, Car, MapPin, CheckCircle2, AlertCircle 
} from "lucide-react";

const PlannerCalendar = () => {
  const [date, setDate] = useState<Date>(new Date());
  const [view, setView] = useState<"daily" | "weekly">("daily");
  
  // Mock pending bookings
  const pendingBookings = [
    {
      id: "BK-12345",
      customer: "John Smith",
      vehicle: "Porsche 911",
      packageType: "Elite",
      date: new Date(),
      time: "10:00",
      location: "23 Hillcrest Avenue, London",
      contact: "0123 456 789",
      status: "pending"
    },
    {
      id: "BK-12346",
      customer: "Sarah Johnson",
      vehicle: "Range Rover Sport",
      packageType: "Medium",
      date: new Date(),
      time: "14:30",
      location: "45 Oak Lane, Manchester",
      contact: "0123 456 790",
      status: "pending"
    },
    {
      id: "BK-12347",
      customer: "Michael Brown",
      vehicle: "Tesla Model S",
      packageType: "Elite",
      date: addDays(new Date(), 1),
      time: "09:00",
      location: "12 Elm Street, Birmingham",
      contact: "0123 456 791",
      status: "pending"
    }
  ];
  
  // Mock confirmed bookings (schedule)
  const confirmedBookings = [
    {
      id: "BK-12340",
      customer: "Alex Wilson",
      vehicle: "BMW M4",
      packageType: "Basic",
      date: new Date(),
      startTime: "08:00",
      endTime: "10:00",
      location: "8 Pine Road, London",
      staff: ["James Carter", "Michael Scott"],
      status: "confirmed"
    },
    {
      id: "BK-12341",
      customer: "Emma Thompson",
      vehicle: "Audi RS6",
      packageType: "Elite",
      date: new Date(),
      startTime: "11:00",
      endTime: "15:00",
      location: "15 Maple Avenue, London",
      staff: ["James Carter", "Sarah Palmer"],
      status: "confirmed"
    },
    {
      id: "BK-12342",
      customer: "David Clark",
      vehicle: "Mercedes S-Class",
      packageType: "Medium",
      date: addDays(new Date(), 1),
      startTime: "09:00",
      endTime: "12:00",
      location: "27 Cedar Lane, London",
      staff: ["Michael Scott", "Robert Johnson"],
      status: "confirmed"
    }
  ];
  
  // Filter events for the selected date
  const filteredPendingBookings = pendingBookings.filter(booking => 
    isSameDay(booking.date, date)
  );
  
  // Get schedule for the selected view
  const getScheduleForView = () => {
    let daysToShow: Date[];
    
    if (view === "daily") {
      daysToShow = [date];
    } else {
      // Weekly view
      const start = startOfWeek(date, { weekStartsOn: 1 }); // Start on Monday
      const end = endOfWeek(date, { weekStartsOn: 1 });
      daysToShow = eachDayOfInterval({ start, end });
    }
    
    return daysToShow.map(day => {
      const dayBookings = confirmedBookings.filter(booking => 
        isSameDay(booking.date, day)
      );
      
      return {
        date: day,
        bookings: dayBookings
      };
    });
  };
  
  const schedule = getScheduleForView();
  
  // Navigation for day/week
  const navigatePrevious = () => {
    setDate(prev => 
      view === "daily" ? addDays(prev, -1) : addDays(prev, -7)
    );
  };
  
  const navigateNext = () => {
    setDate(prev => 
      view === "daily" ? addDays(prev, 1) : addDays(prev, 7)
    );
  };
  
  const navigateToday = () => {
    setDate(new Date());
  };
  
  // Handle booking actions
  const handleConfirmBooking = (bookingId: string) => {
    // In a real app, this would update the booking status in your backend
    console.log(`Confirming booking ${bookingId}`);
  };
  
  const handleCancelBooking = (bookingId: string) => {
    // In a real app, this would update the booking status in your backend
    console.log(`Cancelling booking ${bookingId}`);
  };
  
  return (
    <div className="min-h-screen bg-black pb-16">
      <section className="relative py-8">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold text-white">
              Planner <span className="text-gold">Calendar</span>
            </h1>
            <p className="text-gray-400">
              Manage bookings and staff schedules
            </p>
          </motion.div>
          
          {/* Pending Bookings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-8"
          >
            <Card className="bg-gray-900 border-gray-800 p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-white">Pending Bookings</h2>
                <div className="px-3 py-1 rounded-full bg-amber-900/30 text-amber-400 border border-amber-700 text-xs font-medium">
                  {pendingBookings.length} pending
                </div>
              </div>
              
              {pendingBookings.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {pendingBookings.map(booking => (
                    <div 
                      key={booking.id}
                      className="bg-gray-800 rounded-lg p-4 border border-gray-700"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="text-lg font-medium text-white">{booking.customer}</h3>
                        <span className="text-xs text-gray-400">ID: {booking.id}</span>
                      </div>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center text-gray-300">
                          <Car className="w-4 h-4 mr-2 text-gold" />
                          <span>{booking.vehicle} - {booking.packageType} Package</span>
                        </div>
                        
                        <div className="flex items-center text-gray-300">
                          <Clock className="w-4 h-4 mr-2 text-gold" />
                          <span>{format(booking.date, "MMM dd, yyyy")} at {booking.time}</span>
                        </div>
                        
                        <div className="flex items-center text-gray-300">
                          <MapPin className="w-4 h-4 mr-2 text-gold" />
                          <span>{booking.location}</span>
                        </div>
                        
                        <div className="flex items-center text-gray-300">
                          <User className="w-4 h-4 mr-2 text-gold" />
                          <span>{booking.contact}</span>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button 
                          onClick={() => handleConfirmBooking(booking.id)}
                          className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                          size="sm"
                        >
                          <CheckCircle2 className="w-4 h-4 mr-1" /> Confirm
                        </Button>
                        
                        <Button 
                          onClick={() => handleCancelBooking(booking.id)}
                          className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                          variant="destructive"
                          size="sm"
                        >
                          <AlertCircle className="w-4 h-4 mr-1" /> Cancel
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-400">
                  <p>No pending bookings to display</p>
                </div>
              )}
            </Card>
          </motion.div>
          
          {/* Calendar Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Calendar for date selection */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="bg-gray-900 border-gray-800 p-6">
                <h2 className="text-xl font-bold text-white mb-4">Calendar</h2>
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(newDate) => newDate && setDate(newDate)}
                  className="bg-gray-900 border border-gray-800 rounded-md p-4"
                  classNames={{
                    day_selected: "bg-gold text-black",
                    day_today: "bg-gray-800 text-white",
                    day: "text-white hover:bg-gray-800"
                  }}
                />
              </Card>
            </motion.div>
            
            {/* Schedule view */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="lg:col-span-2"
            >
              <Card className="bg-gray-900 border-gray-800 p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-white">Schedule</h2>
                  
                  <div className="flex items-center gap-2">
                    <div className="flex items-center rounded-md border border-gray-800 mr-2">
                      <Button
                        variant="ghost"
                        className={`text-white hover:text-gold ${view === 'daily' ? 'bg-gray-800' : ''}`}
                        onClick={() => setView('daily')}
                      >
                        Daily
                      </Button>
                      <Button
                        variant="ghost"
                        className={`text-white hover:text-gold ${view === 'weekly' ? 'bg-gray-800' : ''}`}
                        onClick={() => setView('weekly')}
                      >
                        Weekly
                      </Button>
                    </div>
                    
                    <div className="flex">
                      <Button 
                        variant="outline" 
                        size="icon"
                        className="rounded-r-none border-gray-800 text-white hover:text-gold"
                        onClick={navigatePrevious}
                      >
                        {view === 'daily' ? <ChevronLeft className="h-4 w-4" /> : <ChevronsLeft className="h-4 w-4" />}
                      </Button>
                      <Button
                        variant="outline"
                        className="rounded-none border-l-0 border-r-0 border-gray-800 text-white"
                        onClick={navigateToday}
                      >
                        Today
                      </Button>
                      <Button 
                        variant="outline" 
                        size="icon"
                        className="rounded-l-none border-gray-800 text-white hover:text-gold"
                        onClick={navigateNext}
                      >
                        {view === 'daily' ? <ChevronRight className="h-4 w-4" /> : <ChevronsRight className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                </div>
                
                {/* Date header */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-4">
                  {schedule.map((daySchedule) => (
                    <div key={daySchedule.date.toISOString()} className="col-span-1">
                      <div className="text-center mb-3 py-2 border-b border-gray-800">
                        <p className="text-gray-400 text-sm">{format(daySchedule.date, "EEEE")}</p>
                        <h3 className="text-white font-bold">{format(daySchedule.date, "MMMM d, yyyy")}</h3>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Schedule grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {schedule.map((daySchedule) => (
                    <div key={daySchedule.date.toISOString()} className="col-span-1">
                      {daySchedule.bookings.length > 0 ? (
                        <div className="space-y-3">
                          {daySchedule.bookings.map(booking => (
                            <div 
                              key={booking.id}
                              className="bg-gray-800 rounded-lg p-3 border-l-4 border-gold"
                            >
                              <div className="flex justify-between items-start mb-1">
                                <h4 className="font-medium text-white">{booking.customer}</h4>
                                <span className="text-xs bg-green-900/30 px-2 py-0.5 rounded-full text-green-400 border border-green-700">
                                  {booking.status}
                                </span>
                              </div>
                              
                              <div className="text-gray-400 text-sm mb-1">
                                {booking.vehicle} - {booking.packageType}
                              </div>
                              
                              <div className="flex items-center text-gray-300 text-sm">
                                <Clock className="w-3 h-3 mr-1 text-gold" />
                                <span>{booking.startTime} - {booking.endTime}</span>
                              </div>
                              
                              <div className="mt-2 pt-2 border-t border-gray-700">
                                <p className="text-xs text-gray-400 mb-1">Assigned Staff:</p>
                                <div className="flex flex-wrap gap-1">
                                  {booking.staff.map((staffMember, idx) => (
                                    <span 
                                      key={idx} 
                                      className="text-xs bg-gray-700 px-2 py-0.5 rounded-full text-white"
                                    >
                                      {staffMember}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="h-32 border border-gray-800 border-dashed rounded-lg flex items-center justify-center">
                          <p className="text-gray-500 text-sm">No bookings</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PlannerCalendar;

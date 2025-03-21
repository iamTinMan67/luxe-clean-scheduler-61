import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { format, addDays, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, parseISO } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, 
  Clock, User, Car, MapPin, CheckCircle2, AlertCircle 
} from "lucide-react";
import { toast } from "sonner";
import { Invoice } from "@/lib/types";

// Define the booking type for better type safety
interface Booking {
  id: string;
  customer: string;
  vehicle: string;
  packageType: string;
  date: Date | string;
  time?: string;
  startTime?: string;
  endTime?: string;
  location: string;
  contact?: string;
  email?: string;
  notes?: string;
  status: "pending" | "confirmed" | "cancelled" | "in-progress" | "completed";
  condition?: number;
  staff?: string[];
  createdAt?: string;
  totalPrice?: number;
}

const PlannerCalendar = () => {
  const [date, setDate] = useState<Date>(new Date());
  const [view, setView<"daily" | "weekly">("daily");
  const [pendingBookings, setPendingBookings<Booking[]>([]);
  
  // Load saved bookings from localStorage on component mount
  useEffect(() => {
    const savedBookings = localStorage.getItem('pendingBookings');
    if (savedBookings) {
      try {
        // Parse the JSON and convert date strings to Date objects
        const parsedBookings = JSON.parse(savedBookings).map((booking: any) => ({
          ...booking,
          date: new Date(booking.date),
          // Add default time slots based on the booking time
          startTime: booking.time || "09:00",
          endTime: booking.time ? 
            `${parseInt(booking.time.split(':')[0]) + 2}:${booking.time.split(':')[1]}` : 
            "11:00"
        }));
        setPendingBookings(parsedBookings);
      } catch (error) {
        console.error('Error parsing bookings:', error);
      }
    }
  }, []);
  
  // Mock confirmed bookings (schedule)
  const confirmedBookings: Booking[] = [
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
  
  // Filter events for the selected date - include both confirmed and pending
  const filteredBookings = [...confirmedBookings, ...pendingBookings].filter(booking => {
    const bookingDate = booking.date instanceof Date ? booking.date : new Date(booking.date);
    return isSameDay(bookingDate, date);
  });
  
  // Get schedule for the selected view - include both confirmed and pending
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
      const dayBookings = [...confirmedBookings, ...pendingBookings].filter(booking => {
        const bookingDate = booking.date instanceof Date ? booking.date : new Date(booking.date);
        return isSameDay(bookingDate, day);
      });
      
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
  
  // Generate invoice for a confirmed booking
  const generateInvoice = (booking: Booking) => {
    // Calculate subtotal, tax, and total
    const subtotal = booking.totalPrice || 0;
    const tax = subtotal * 0.2; // 20% VAT
    const total = subtotal + tax;
    
    // Create invoice items based on package type
    const items = [
      {
        description: `${booking.packageType} Package for ${booking.vehicle}`,
        quantity: 1,
        unitPrice: subtotal,
        total: subtotal
      }
    ];
    
    // Create the invoice object
    const invoice: Invoice = {
      id: `INV-${Math.floor(Math.random() * 90000) + 10000}`,
      bookingId: booking.id,
      customerId: booking.id, // Using booking ID as customer ID for simplicity
      items: items,
      subtotal: subtotal,
      tax: tax,
      total: total,
      paid: false,
      date: new Date()
    };
    
    // Save invoice to localStorage
    const existingInvoices = localStorage.getItem('invoices') 
      ? JSON.parse(localStorage.getItem('invoices') || '[]') 
      : [];
    
    localStorage.setItem('invoices', JSON.stringify([...existingInvoices, invoice]));
    
    // Send invoice notification
    sendInvoiceNotification(booking, invoice);
    
    return invoice;
  };
  
  // Send invoice notification via SMS/Email
  const sendInvoiceNotification = (booking: Booking, invoice: Invoice) => {
    // In a real app, this would connect to SMS/Email API
    console.log(`Sending invoice ${invoice.id} notification to ${booking.customer}`);
    
    // Show success toast for demo
    toast.success("Invoice generated and sent", {
      description: `Invoice #${invoice.id} has been sent to ${booking.customer}`,
    });
  };
  
  // Handle booking actions
  const handleConfirmBooking = (bookingId: string) => {
    // Find the booking to confirm
    const bookingToConfirm = pendingBookings.find(booking => booking.id === bookingId);
    if (!bookingToConfirm) return;
    
    // Create a confirmed booking from the pending booking
    const confirmedBooking: Booking = {
      ...bookingToConfirm,
      status: "confirmed",
      startTime: bookingToConfirm.time,
      endTime: bookingToConfirm.time ? 
        `${parseInt(bookingToConfirm.time.split(':')[0]) + 2}:${bookingToConfirm.time.split(':')[1]}` : 
        "12:00", // Default 2 hours later
      staff: ["James Carter", "Michael Scott"] // Default staff assignment
    };
    
    // Update the pending bookings list
    const updatedPendingBookings = pendingBookings.filter(booking => booking.id !== bookingId);
    setPendingBookings(updatedPendingBookings);
    
    // Update localStorage by storing the updated pending bookings
    localStorage.setItem('pendingBookings', JSON.stringify(updatedPendingBookings));
    
    // Store confirmed bookings separately in localStorage
    const existingConfirmedBookings = localStorage.getItem('confirmedBookings') 
      ? JSON.parse(localStorage.getItem('confirmedBookings') || '[]') 
      : [];
    
    localStorage.setItem('confirmedBookings', JSON.stringify([...existingConfirmedBookings, confirmedBooking]));
    
    // Generate invoice for the confirmed booking
    const invoice = generateInvoice(confirmedBooking);
    
    // Show success message
    toast.success(`Booking ${bookingId} confirmed successfully!`, {
      description: "The booking has been added to your schedule."
    });
  };
  
  const handleCancelBooking = (bookingId: string) => {
    // Update the bookings state by removing the cancelled booking
    const updatedBookings = pendingBookings.filter(booking => booking.id !== bookingId);
    setPendingBookings(updatedBookings);
    
    // Update localStorage
    localStorage.setItem('pendingBookings', JSON.stringify(updatedBookings));
    
    // Show success message
    toast.success(`Booking ${bookingId} cancelled successfully!`);
  };
  
  // Get background color based on vehicle condition
  const getBookingBackground = (booking: Booking) => {
    if (booking.status === "pending") return "bg-amber-900/30 border-amber-700";
    if (booking.condition !== undefined && booking.condition < 5) return "bg-orange-800 border-orange-700";
    return "bg-gray-800 border-gray-700";
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
                      className={`rounded-lg p-4 border ${getBookingBackground(booking)}`}
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
                          <span>
                            {booking.date instanceof Date 
                              ? format(booking.date, "MMM dd, yyyy") 
                              : "Date not available"} 
                            at {booking.time || "Not specified"}
                          </span>
                        </div>
                        
                        <div className="flex items-center text-gray-300">
                          <MapPin className="w-4 h-4 mr-2 text-gold" />
                          <span>{booking.location}</span>
                        </div>
                        
                        <div className="flex items-center text-gray-300">
                          <User className="w-4 h-4 mr-2 text-gold" />
                          <span>{booking.contact || booking.email || "No contact provided"}</span>
                        </div>
                        
                        {/* Add vehicle condition indicator */}
                        {booking.condition !== undefined && (
                          <div className="flex items-center text-gray-300">
                            <span className={`text-sm ${booking.condition < 5 ? "text-orange-400" : "text-green-400"}`}>
                              Vehicle Condition: {booking.condition}/10
                            </span>
                          </div>
                        )}
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
                              className={`rounded-lg p-3 border-l-4 ${
                                booking.status === "pending" ? "border-amber-500" : "border-gold"
                              } ${getBookingBackground(booking)}`}
                            >
                              <div className="flex justify-between items-start mb-1">
                                <h4 className="font-medium text-white">{booking.customer}</h4>
                                <span className={`text-xs px-2 py-0.5 rounded-full ${
                                  booking.status === "pending" 
                                    ? "bg-amber-900/30 text-amber-400 border border-amber-700"
                                    : "bg-green-900/30 text-green-400 border border-green-700"
                                }`}>
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
                              
                              {booking.staff && booking.staff.length > 0 && (
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
                              )}
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

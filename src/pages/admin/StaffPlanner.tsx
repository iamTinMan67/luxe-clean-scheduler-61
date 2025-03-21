
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { format, addDays, parseISO } from "date-fns";
import { Pencil, Trash2, CalendarClock } from "lucide-react";

// Define the booking type with a more specific status type
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

// Helper function to validate booking status
const validateBookingStatus = (status: string): "pending" | "confirmed" | "cancelled" | "in-progress" | "completed" => {
  const validStatuses = ["pending", "confirmed", "cancelled", "in-progress", "completed"];
  return validStatuses.includes(status) 
    ? (status as "pending" | "confirmed" | "cancelled" | "in-progress" | "completed") 
    : "pending"; // Default to pending if invalid status
};

const StaffPlanner = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [view, setView] = useState("daily");
  const [pendingBookings, setPendingBookings] = useState<Booking[]>([]);
  const [confirmedBookings, setConfirmedBookings] = useState<Booking[]>([]);
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);
  const [newPackageType, setNewPackageType] = useState<string>("");
  const [rescheduledDate, setRescheduledDate] = useState<Date | undefined>(undefined);
  
  // Load bookings from localStorage
  useEffect(() => {
    // Load pending bookings
    const savedPendingBookings = localStorage.getItem('pendingBookings');
    if (savedPendingBookings) {
      try {
        const parsedBookings = JSON.parse(savedPendingBookings).map((booking: any) => ({
          ...booking,
          date: new Date(booking.date),
          // Ensure status is valid
          status: validateBookingStatus(booking.status)
        }));
        setPendingBookings(parsedBookings);
      } catch (error) {
        console.error('Error parsing pending bookings:', error);
      }
    }
    
    // Load confirmed bookings
    const savedConfirmedBookings = localStorage.getItem('confirmedBookings');
    if (savedConfirmedBookings) {
      try {
        const parsedBookings = JSON.parse(savedConfirmedBookings).map((booking: any) => ({
          ...booking,
          date: new Date(booking.date),
          // Ensure status is valid
          status: validateBookingStatus(booking.status)
        }));
        setConfirmedBookings(parsedBookings);
      } catch (error) {
        console.error('Error parsing confirmed bookings:', error);
      }
    }
  }, []);
  
  // Get all bookings for the selected date
  const getBookingsForDate = () => {
    const allBookings = [...confirmedBookings, ...pendingBookings];
    
    return allBookings.filter(booking => {
      const bookingDate = booking.date instanceof Date 
        ? booking.date 
        : new Date(booking.date);
      
      return date && 
        bookingDate.getDate() === date.getDate() &&
        bookingDate.getMonth() === date.getMonth() &&
        bookingDate.getFullYear() === date.getFullYear();
    });
  };
  
  // Handle booking confirmation
  const handleConfirmBooking = (booking: Booking) => {
    // Create a confirmed booking
    const confirmedBooking: Booking = {
      ...booking,
      status: "confirmed",
      startTime: booking.time,
      endTime: booking.time 
        ? `${parseInt(booking.time.split(':')[0]) + 2}:${booking.time.split(':')[1]}` 
        : "12:00",
      staff: ["James Carter", "Michael Scott"]
    };
    
    // Add to confirmed bookings
    const updatedConfirmedBookings = [...confirmedBookings, confirmedBooking];
    setConfirmedBookings(updatedConfirmedBookings);
    localStorage.setItem('confirmedBookings', JSON.stringify(updatedConfirmedBookings));
    
    // Remove from pending
    const updatedPendingBookings = pendingBookings.filter(b => b.id !== booking.id);
    setPendingBookings(updatedPendingBookings);
    localStorage.setItem('pendingBookings', JSON.stringify(updatedPendingBookings));
    
    // Generate invoice
    generateInvoice(confirmedBooking);
    
    toast.success("Booking confirmed", {
      description: `Booking for ${booking.customer} has been confirmed.`
    });
  };
  
  // Handle booking deletion
  const handleDeleteBooking = (booking: Booking) => {
    if (booking.status === "pending") {
      // Remove from pending
      const updatedPendingBookings = pendingBookings.filter(b => b.id !== booking.id);
      setPendingBookings(updatedPendingBookings);
      localStorage.setItem('pendingBookings', JSON.stringify(updatedPendingBookings));
    } else {
      // Remove from confirmed
      const updatedConfirmedBookings = confirmedBookings.filter(b => b.id !== booking.id);
      setConfirmedBookings(updatedConfirmedBookings);
      localStorage.setItem('confirmedBookings', JSON.stringify(updatedConfirmedBookings));
    }
    
    toast.success("Booking deleted", {
      description: `Booking for ${booking.customer} has been deleted.`
    });
  };
  
  // Generate invoice
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
    
    // Create the invoice object using the booking.id as the invoice ID
    const invoice = {
      id: booking.id, // Use booking ID as invoice ID
      bookingId: booking.id,
      customerId: booking.id,
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
    
    // Check if an invoice with this ID already exists
    const invoiceExists = existingInvoices.some((inv: any) => inv.id === booking.id);
    
    if (!invoiceExists) {
      localStorage.setItem('invoices', JSON.stringify([...existingInvoices, invoice]));
      
      // Send invoice notification
      sendNotification(booking, "invoice");
    }
    
    return invoice;
  };
  
  // Send SMS notification
  const sendNotification = (booking: Booking, type: "invoice" | "update" | "completion") => {
    // In a real app, this would connect to SMS API
    let message = "";
    
    switch (type) {
      case "invoice":
        message = `New invoice generated for ${booking.customer}`;
        break;
      case "update":
        message = `Booking updated for ${booking.customer}`;
        break;
      case "completion":
        message = `Thank you for your business, ${booking.customer}! Your ${booking.packageType} service is complete. We'd love your feedback: ${window.location.origin}/feedback/${booking.id}`;
        break;
    }
    
    console.log("SMS Notification:", message);
    
    toast.success(`Notification sent`, {
      description: message,
    });
  };
  
  // Handle package change
  const handlePackageChange = () => {
    if (!editingBooking || !newPackageType) return;
    
    // Update the booking
    const updatedBooking: Booking = {
      ...editingBooking,
      packageType: newPackageType
    };
    
    // Update in the appropriate list
    if (updatedBooking.status === "pending") {
      const updatedPendingBookings = pendingBookings.map(b => 
        b.id === updatedBooking.id ? updatedBooking : b
      );
      setPendingBookings(updatedPendingBookings);
      localStorage.setItem('pendingBookings', JSON.stringify(updatedPendingBookings));
    } else {
      const updatedConfirmedBookings = confirmedBookings.map(b => 
        b.id === updatedBooking.id ? updatedBooking : b
      );
      setConfirmedBookings(updatedConfirmedBookings);
      localStorage.setItem('confirmedBookings', JSON.stringify(updatedConfirmedBookings));
    }
    
    // Generate new invoice if it's a confirmed booking
    if (updatedBooking.status === "confirmed") {
      // Remove old invoice
      const existingInvoices = localStorage.getItem('invoices') 
        ? JSON.parse(localStorage.getItem('invoices') || '[]') 
        : [];
      
      const filteredInvoices = existingInvoices.filter((inv: any) => inv.id !== updatedBooking.id);
      localStorage.setItem('invoices', JSON.stringify(filteredInvoices));
      
      // Generate new invoice
      generateInvoice(updatedBooking);
      
      // Send notification
      sendNotification(updatedBooking, "update");
    }
    
    setEditingBooking(null);
    setNewPackageType("");
    
    toast.success("Package updated", {
      description: `Package updated to ${newPackageType} for ${updatedBooking.customer}`
    });
  };
  
  // Handle date reschedule
  const handleReschedule = () => {
    if (!editingBooking || !rescheduledDate) return;
    
    // Update the booking
    const updatedBooking: Booking = {
      ...editingBooking,
      date: rescheduledDate
    };
    
    // Update in the appropriate list
    if (updatedBooking.status === "pending") {
      const updatedPendingBookings = pendingBookings.map(b => 
        b.id === updatedBooking.id ? updatedBooking : b
      );
      setPendingBookings(updatedPendingBookings);
      localStorage.setItem('pendingBookings', JSON.stringify(updatedPendingBookings));
    } else {
      const updatedConfirmedBookings = confirmedBookings.map(b => 
        b.id === updatedBooking.id ? updatedBooking : b
      );
      setConfirmedBookings(updatedConfirmedBookings);
      localStorage.setItem('confirmedBookings', JSON.stringify(updatedConfirmedBookings));
    }
    
    // Send notification if confirmed
    if (updatedBooking.status === "confirmed") {
      sendNotification(updatedBooking, "update");
    }
    
    setEditingBooking(null);
    setRescheduledDate(undefined);
    
    toast.success("Booking rescheduled", {
      description: `Booking rescheduled to ${format(rescheduledDate, 'MMMM d, yyyy')} for ${updatedBooking.customer}`
    });
  };
  
  // Mark booking as completed
  const handleCompleteBooking = (booking: Booking) => {
    // Update the booking
    const updatedBooking: Booking = {
      ...booking,
      status: "completed"
    };
    
    // Update in confirmed bookings
    const updatedConfirmedBookings = confirmedBookings.map(b => 
      b.id === updatedBooking.id ? updatedBooking : b
    );
    setConfirmedBookings(updatedConfirmedBookings);
    localStorage.setItem('confirmedBookings', JSON.stringify(updatedConfirmedBookings));
    
    // Send completion notification with feedback link
    sendNotification(updatedBooking, "completion");
    
    toast.success("Booking completed", {
      description: `Service for ${updatedBooking.customer} has been marked as completed.`
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="container mx-auto py-8 px-4"
    >
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Staff Planner</h1>
        <p className="text-gold">Manage your team's schedule and assignments</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1 bg-black/60 border-gold/30">
          <CardHeader>
            <CardTitle className="text-white">Staff Members</CardTitle>
            <CardDescription className="text-gold/70">
              Select staff for scheduling
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {["John Smith", "Sarah Johnson", "Michael Brown", "Emma Wilson", "David Lee"].map((staff) => (
                <div key={staff} className="flex items-center space-x-2 p-2 hover:bg-white/5 rounded">
                  <input type="checkbox" id={staff} className="rounded text-gold" />
                  <label htmlFor={staff} className="text-white cursor-pointer">{staff}</label>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 bg-black/60 border-gold/30">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-white">Schedule View</CardTitle>
                <CardDescription className="text-gold/70">
                  Plan and organize team assignments
                </CardDescription>
              </div>
              <Tabs defaultValue="daily" value={view} onValueChange={setView}>
                <TabsList className="bg-black/60">
                  <TabsTrigger value="daily">Daily</TabsTrigger>
                  <TabsTrigger value="weekly">Weekly</TabsTrigger>
                  <TabsTrigger value="monthly">Monthly</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="w-full md:w-auto">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  className="bg-black/30 border border-gold/30 rounded-md"
                />
              </div>
              
              <div className="flex-1">
                <TabsContent value="daily" className="mt-0">
                  <h3 className="text-xl text-white font-medium mb-4">
                    {date?.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                  </h3>
                  
                  {/* Display bookings for the selected date */}
                  <div className="space-y-4">
                    {getBookingsForDate().length > 0 ? (
                      getBookingsForDate().map((booking) => (
                        <div 
                          key={booking.id}
                          className={`border ${
                            booking.status === "pending" ? "border-amber-500" : 
                            booking.status === "completed" ? "border-green-500" : "border-gold"
                          } rounded-md p-3 bg-black/40`}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <p className="text-white font-medium">{booking.customer}</p>
                              <p className="text-gold text-sm">{booking.time || "No time specified"}</p>
                            </div>
                            <div className="flex gap-2">
                              {/* Edit Package Button */}
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button 
                                    size="sm" 
                                    variant="outline"
                                    className="h-8 px-2 text-xs"
                                    onClick={() => {
                                      setEditingBooking(booking);
                                      setNewPackageType(booking.packageType);
                                    }}
                                  >
                                    <Pencil className="h-3 w-3 mr-1" /> Package
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="bg-gray-950 border-gray-800">
                                  <DialogHeader>
                                    <DialogTitle className="text-white">Change Package</DialogTitle>
                                    <DialogDescription className="text-gray-400">
                                      Update the service package for {editingBooking?.customer}
                                    </DialogDescription>
                                  </DialogHeader>
                                  <div className="py-4">
                                    <Select value={newPackageType} onValueChange={setNewPackageType}>
                                      <SelectTrigger className="w-full bg-black border-gray-800">
                                        <SelectValue placeholder="Select package" />
                                      </SelectTrigger>
                                      <SelectContent className="bg-gray-950 border-gray-800">
                                        <SelectItem value="basic">Basic Package</SelectItem>
                                        <SelectItem value="medium">Medium Package</SelectItem>
                                        <SelectItem value="elite">Elite Package</SelectItem>
                                        <SelectItem value="platinum">Platinum Package</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  <DialogFooter>
                                    <Button 
                                      variant="outline" 
                                      onClick={() => {
                                        setEditingBooking(null);
                                        setNewPackageType("");
                                      }}
                                      className="bg-gray-800 hover:bg-gray-700"
                                    >
                                      Cancel
                                    </Button>
                                    <Button 
                                      className="bg-gold hover:bg-gold/80 text-black"
                                      onClick={handlePackageChange}
                                    >
                                      Save Changes
                                    </Button>
                                  </DialogFooter>
                                </DialogContent>
                              </Dialog>
                              
                              {/* Reschedule Button */}
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button 
                                    size="sm" 
                                    variant="outline"
                                    className="h-8 px-2 text-xs"
                                    onClick={() => {
                                      setEditingBooking(booking);
                                      setRescheduledDate(booking.date instanceof Date ? booking.date : new Date(booking.date));
                                    }}
                                  >
                                    <CalendarClock className="h-3 w-3 mr-1" /> Reschedule
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="bg-gray-950 border-gray-800">
                                  <DialogHeader>
                                    <DialogTitle className="text-white">Reschedule Booking</DialogTitle>
                                    <DialogDescription className="text-gray-400">
                                      Pick a new date for {editingBooking?.customer}'s appointment
                                    </DialogDescription>
                                  </DialogHeader>
                                  <div className="py-4 flex justify-center">
                                    <Calendar
                                      mode="single"
                                      selected={rescheduledDate}
                                      onSelect={setRescheduledDate}
                                      initialFocus
                                      className="border border-gray-800 rounded-md"
                                    />
                                  </div>
                                  <DialogFooter>
                                    <Button 
                                      variant="outline" 
                                      onClick={() => {
                                        setEditingBooking(null);
                                        setRescheduledDate(undefined);
                                      }}
                                      className="bg-gray-800 hover:bg-gray-700"
                                    >
                                      Cancel
                                    </Button>
                                    <Button 
                                      className="bg-gold hover:bg-gold/80 text-black"
                                      onClick={handleReschedule}
                                    >
                                      Confirm Reschedule
                                    </Button>
                                  </DialogFooter>
                                </DialogContent>
                              </Dialog>
                              
                              {/* Delete Button */}
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button 
                                    size="sm" 
                                    variant="destructive"
                                    className="h-8 px-2 text-xs"
                                  >
                                    <Trash2 className="h-3 w-3 mr-1" /> Delete
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="bg-gray-950 border-gray-800">
                                  <DialogHeader>
                                    <DialogTitle className="text-white">Confirm Deletion</DialogTitle>
                                    <DialogDescription className="text-gray-400">
                                      Are you sure you want to delete this booking? This action cannot be undone.
                                    </DialogDescription>
                                  </DialogHeader>
                                  <DialogFooter>
                                    <Button 
                                      variant="outline" 
                                      className="bg-gray-800 hover:bg-gray-700"
                                    >
                                      Cancel
                                    </Button>
                                    <Button 
                                      variant="destructive"
                                      onClick={() => handleDeleteBooking(booking)}
                                    >
                                      Delete Booking
                                    </Button>
                                  </DialogFooter>
                                </DialogContent>
                              </Dialog>
                            </div>
                          </div>
                          
                          <div className="space-y-1 text-sm">
                            <p className="text-gray-300">Vehicle: <span className="text-white">{booking.vehicle}</span></p>
                            <p className="text-gray-300">Package: <span className="text-white">{booking.packageType}</span></p>
                            <p className="text-gray-300">Location: <span className="text-white">{booking.location}</span></p>
                            <p className="text-gray-300">Status: 
                              <span className={`ml-1 ${
                                booking.status === "pending" ? "text-amber-400" : 
                                booking.status === "confirmed" ? "text-blue-400" :
                                booking.status === "completed" ? "text-green-400" : "text-white"
                              }`}>{booking.status}</span>
                            </p>
                          </div>
                          
                          <div className="mt-3 flex gap-2">
                            {booking.status === "pending" && (
                              <Button 
                                size="sm" 
                                className="bg-green-600 hover:bg-green-700"
                                onClick={() => handleConfirmBooking(booking)}
                              >
                                Confirm Booking
                              </Button>
                            )}
                            
                            {booking.status === "confirmed" && (
                              <Button 
                                size="sm" 
                                className="bg-green-600 hover:bg-green-700"
                                onClick={() => handleCompleteBooking(booking)}
                              >
                                Mark as Completed
                              </Button>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-gray-400">
                        No bookings scheduled for this date
                      </div>
                    )}
                  </div>
                </TabsContent>
                
                <TabsContent value="weekly" className="mt-0">
                  <h3 className="text-xl text-white font-medium mb-4">Week View</h3>
                  <p className="text-white/70">Weekly schedule view coming soon</p>
                </TabsContent>
                
                <TabsContent value="monthly" className="mt-0">
                  <h3 className="text-xl text-white font-medium mb-4">Month View</h3>
                  <p className="text-white/70">Monthly schedule view coming soon</p>
                </TabsContent>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
};

export default StaffPlanner;

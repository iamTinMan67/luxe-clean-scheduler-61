
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Check, Image as ImageIcon, Upload } from "lucide-react";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useScheduledAppointments } from "@/hooks/useScheduledAppointments";
import { Booking } from "@/types/booking";

const PreInspection = () => {
  const [images, setImages] = useState<string[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<string>("");
  const [bookingDetails, setBookingDetails] = useState<Booking | null>(null);
  const { appointments, loading } = useScheduledAppointments();
  
  // Update booking details when a booking is selected
  useEffect(() => {
    if (selectedBooking) {
      const selected = appointments.find(booking => booking.id === selectedBooking);
      if (selected) {
        setBookingDetails(selected);
      }
    } else {
      setBookingDetails(null);
    }
  }, [selectedBooking, appointments]);
  
  // Placeholder function for image upload
  const handleImageUpload = () => {
    // In a real app, this would upload to a server
    // For now, we'll just add a placeholder image
    setImages([...images, "https://placeholder.pics/svg/300x200/DEDEDE/555555/Vehicle%20Image"]);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="container mx-auto py-8 px-4"
    >
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Pre-Inspection Report</h1>
        <p className="text-gold">Document the vehicle condition before commencement</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-black/60 border-gold/30">
            <CardHeader>
              <CardTitle className="text-white">Vehicle Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="customer" className="text-white text-sm font-medium block mb-1">
                    Customer Name
                  </label>
                  <Select
                    value={selectedBooking}
                    onValueChange={(value) => setSelectedBooking(value)}
                  >
                    <SelectTrigger className="bg-black/40 border-gold/30 text-white">
                      <SelectValue placeholder="Select a scheduled appointment" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-900 border-gold/30 text-white">
                      {loading ? (
                        <SelectItem value="loading" disabled>Loading appointments...</SelectItem>
                      ) : appointments.length > 0 ? (
                        appointments.map((booking) => (
                          <SelectItem key={booking.id} value={booking.id}>
                            {booking.customer} - {new Date(booking.date).toLocaleDateString()}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="none" disabled>No scheduled appointments found</SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label htmlFor="bookingId" className="text-white text-sm font-medium block mb-1">
                    Booking ID
                  </label>
                  <Input 
                    id="bookingId" 
                    className="bg-black/40 border-gold/30 text-white" 
                    placeholder="Enter booking ID" 
                    value={bookingDetails?.id || ""}
                    readOnly={!!bookingDetails}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="make" className="text-white text-sm font-medium block mb-1">
                    Make
                  </label>
                  <Input id="make" className="bg-black/40 border-gold/30 text-white" placeholder="Vehicle make" />
                </div>
                <div>
                  <label htmlFor="model" className="text-white text-sm font-medium block mb-1">
                    Model
                  </label>
                  <Input id="model" className="bg-black/40 border-gold/30 text-white" placeholder="Vehicle model" />
                </div>
                <div>
                  <label htmlFor="regNumber" className="text-white text-sm font-medium block mb-1">
                    Registration
                  </label>
                  <Input 
                    id="regNumber" 
                    className="bg-black/40 border-gold/30 text-white" 
                    placeholder="Reg. number" 
                    value={bookingDetails?.vehicleReg || ""}
                    readOnly={!!bookingDetails?.vehicleReg}
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="exteriorNotes" className="text-white text-sm font-medium block mb-1">
                  Exterior Condition Notes
                </label>
                <Textarea 
                  id="exteriorNotes" 
                  className="bg-black/40 border-gold/30 text-white min-h-[100px]" 
                  placeholder="Note any existing damage, scratches, dents, etc."
                />
              </div>
              
              <div>
                <label htmlFor="interiorNotes" className="text-white text-sm font-medium block mb-1">
                  Interior Condition Notes
                </label>
                <Textarea 
                  id="interiorNotes" 
                  className="bg-black/40 border-gold/30 text-white min-h-[100px]" 
                  placeholder="Note any dog hairs, stains, wear, etc."
                />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-black/60 border-gold/30">
            <CardHeader>
              <CardTitle className="text-white, text-align: center">Snapshot Anything Notable</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <Button 
                  onClick={handleImageUpload} 
                  className="gold-gradient text-black hover:shadow-gold/20 hover:shadow-lg"
                >
                  <Upload size={16} className="mr-2" />
                  Upload Photos
                </Button>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {images.map((image, index) => (
                  <div key={index} className="relative border border-gold/20 rounded overflow-hidden aspect-square">
                    <img 
                      src={image} 
                      alt={`Vehicle photo ${index + 1}`} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
                
                {images.length === 0 && (
                  <div className="col-span-full flex flex-col items-center justify-center text-white/60 p-8 border border-dashed border-gold/20 rounded-md">
                    <ImageIcon size={48} className="mb-2 opacity-50" />
                    <p>No images uploaded yet</p>
                    <p className="text-sm">Snap anything noted</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:col-span-1">
          <Card className="bg-black/60 border-gold/30 sticky top-24">
            <CardHeader>
              <CardTitle className="text-white">Pre-Inspection Checklist</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  "Exterior body condition documented",
                  "Interior condition documented",
                  "Existing damage photographed",
                  "Personal items noted and secured",
                  "Customer signature obtained",
                  "Staff signature provided"
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-3 p-2 rounded hover:bg-white/5">
                    <div className="h-6 w-6 rounded-full flex items-center justify-center border border-gold/50">
                      <Check size={14} className="text-gold" />
                    </div>
                    <span className="text-white">{item}</span>
                  </div>
                ))}
              </div>
              
              <div className="mt-8">
                <Button className="w-full gold-gradient text-black hover:shadow-gold/20 hover:shadow-lg">
                  Submit Report
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  );
};

export default PreInspection;

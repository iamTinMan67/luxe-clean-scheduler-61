
import React, { useState } from 'react';
import { Booking } from '@/types/booking';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Pencil, Trash2, CalendarClock } from "lucide-react";
import { format } from "date-fns";

interface BookingItemProps {
  booking: Booking;
  onConfirm: (booking: Booking) => void;
  onComplete: (booking: Booking) => void;
  onDelete: (booking: Booking) => void;
  onPackageChange: (booking: Booking, newPackage: string) => void;
  onReschedule: (booking: Booking, newDate: Date) => void;
}

const BookingItem: React.FC<BookingItemProps> = ({ 
  booking, 
  onConfirm, 
  onComplete, 
  onDelete, 
  onPackageChange, 
  onReschedule 
}) => {
  const [newPackageType, setNewPackageType] = useState<string>(booking.packageType);
  const [rescheduledDate, setRescheduledDate] = useState<Date | undefined>(
    booking.date instanceof Date ? booking.date : new Date(booking.date)
  );

  return (
    <div 
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
              >
                <Pencil className="h-3 w-3 mr-1" /> Package
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-gray-950 border-gray-800">
              <DialogHeader>
                <DialogTitle className="text-white">Change Package</DialogTitle>
                <DialogDescription className="text-gray-400">
                  Update the service package for {booking.customer}
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
                  className="bg-gray-800 hover:bg-gray-700"
                >
                  Cancel
                </Button>
                <Button 
                  className="bg-gold hover:bg-gold/80 text-black"
                  onClick={() => onPackageChange(booking, newPackageType)}
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
              >
                <CalendarClock className="h-3 w-3 mr-1" /> Reschedule
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-gray-950 border-gray-800">
              <DialogHeader>
                <DialogTitle className="text-white">Reschedule Booking</DialogTitle>
                <DialogDescription className="text-gray-400">
                  Pick a new date for {booking.customer}'s appointment
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
                  className="bg-gray-800 hover:bg-gray-700"
                >
                  Cancel
                </Button>
                <Button 
                  className="bg-gold hover:bg-gold/80 text-black"
                  onClick={() => rescheduledDate && onReschedule(booking, rescheduledDate)}
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
                  onClick={() => onDelete(booking)}
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
            onClick={() => onConfirm(booking)}
          >
            Confirm Booking
          </Button>
        )}
        
        {booking.status === "confirmed" && (
          <Button 
            size="sm" 
            className="bg-green-600 hover:bg-green-700"
            onClick={() => onComplete(booking)}
          >
            Mark as Completed
          </Button>
        )}
      </div>
    </div>
  );
};

export default BookingItem;

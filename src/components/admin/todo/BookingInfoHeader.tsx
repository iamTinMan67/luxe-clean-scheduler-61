
import { CheckCircle } from "lucide-react";
import { Booking } from "@/types/booking";

interface BookingInfoHeaderProps {
  currentBooking: Booking;
  completedTasks: number;
  totalTasks: number;
  progressPercentage: number;
}

const BookingInfoHeader = ({
  currentBooking,
  completedTasks,
  totalTasks,
  progressPercentage
}: BookingInfoHeaderProps) => {
  return (
    <div className="mb-4 p-4 border border-gold/20 rounded-md bg-black/40">
      <div className="flex justify-between mb-2">
        <span className="text-white font-semibold">{currentBooking.customer}</span>
        <span className="text-gold">{currentBooking.packageType} Package</span>
      </div>
      <div className="text-sm text-gray-400">
        <p>Vehicle: {currentBooking.vehicle} {currentBooking.vehicleReg ? `(${currentBooking.vehicleReg})` : ''}</p>
        <p>Location: {currentBooking.location}</p>
        <p>Date: {new Date(currentBooking.date).toLocaleDateString()} {currentBooking.time}</p>
        <p>Status: <span className="capitalize text-gold">{currentBooking.status}</span></p>
      </div>
      
      {/* Enhanced progress bar */}
      <div className="mt-3">
        <div className="flex justify-between text-sm text-gray-400 mb-1">
          <span>Progress</span>
          <span>{completedTasks}/{totalTasks} tasks completed ({progressPercentage}%)</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-3">
          <div 
            className="bg-gradient-to-r from-gold to-yellow-400 h-3 rounded-full transition-all duration-300" 
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </div>

      {/* Show completed status for finished jobs */}
      {currentBooking.status === "finished" && (
        <div className="mt-4 text-center">
          <div className="bg-green-900/40 text-green-400 px-4 py-2 rounded-md">
            <CheckCircle className="h-4 w-4 mr-2 inline" />
            Job Completed & Invoice Generated
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingInfoHeader;


import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Calendar } from "lucide-react";
import { Booking } from "@/types/booking";

interface BookingDetailsCardProps {
  booking: Booking;
  progress: number;
  estimatedCompletion: string | null;
}

const BookingDetailsCard = ({ booking, progress, estimatedCompletion }: BookingDetailsCardProps) => {
  return (
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
            <span className="text-gold capitalize">{booking.status.replace('-', ' ')}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Location:</span>
            <span className="text-white">{booking.location}</span>
          </div>
          {estimatedCompletion && estimatedCompletion !== "Completed" && (
            <div className="flex justify-between">
              <span className="text-gray-400">Est. Completion:</span>
              <span className="text-white">{estimatedCompletion}</span>
            </div>
          )}
        </div>
        
        <div className="mt-4">
          <div className="flex justify-between mb-1 text-sm">
            <span className="text-gray-400">Service Progress</span>
            <span className="text-white">{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
          {progress === 100 && (
            <p className="text-green-400 text-sm mt-1 text-center">✓ Service Complete!</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default BookingDetailsCard;

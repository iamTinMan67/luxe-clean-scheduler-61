
import { Input } from "@/components/ui/input";
import { DatePicker } from "@/components/ui/date-picker";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Booking } from "@/types/booking";
import { useAuth } from "@/context/AuthContext";
import { Search, Calendar } from "lucide-react";

interface EnhancedBookingSelectorProps {
  value: string;
  onChange: (value: string) => void;
  appointments: Booking[];
  loading: boolean;
  selectedDate: Date;
  onDateChange: (date: Date | undefined) => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

const EnhancedBookingSelector = ({ 
  value, 
  onChange, 
  appointments, 
  loading,
  selectedDate,
  onDateChange,
  searchTerm,
  onSearchChange
}: EnhancedBookingSelectorProps) => {
  const { user } = useAuth();
  const isAdmin = user?.user_metadata?.role === 'admin';

  return (
    <div className="space-y-4">
      {/* Date Picker */}
      <div className="flex items-center space-x-2">
        <Calendar className="h-4 w-4 text-gold" />
        <DatePicker
          date={selectedDate}
          onDateChange={onDateChange}
        />
      </div>

      {/* Search Bar - Only for Admin Users */}
      {isAdmin && (
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search by customer name..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 bg-black/50 border-gold/30 text-white"
          />
        </div>
      )}

      {/* Appointment Selector */}
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-full bg-black/50 border-gold/30">
          <SelectValue placeholder="Select an inspected appointment" />
        </SelectTrigger>
        <SelectContent className="bg-gray-900 border-gold/30 text-white max-h-60 overflow-y-auto">
          {loading ? (
            <SelectItem value="loading" disabled>Loading appointments...</SelectItem>
          ) : appointments.length > 0 ? (
            appointments.map((booking) => (
              <SelectItem key={booking.id} value={booking.id}>
                <div className="flex flex-col">
                  <span>{booking.customer} - {booking.vehicle}</span>
                  <span className="text-xs text-gray-400">
                    {new Date(booking.date).toLocaleDateString()} {booking.time}
                  </span>
                </div>
              </SelectItem>
            ))
          ) : (
            <SelectItem value="none" disabled>
              No inspected appointments found for this date
            </SelectItem>
          )}
        </SelectContent>
      </Select>
    </div>
  );
};

export default EnhancedBookingSelector;

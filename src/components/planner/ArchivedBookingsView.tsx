import React, { useState } from 'react';
import { format } from 'date-fns';
import { Booking } from '@/types/booking';
import { Calendar, Search, ChevronDown, ChevronUp, Clock, Package } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { getStatusInfo } from '@/utils/statusUtils';

interface ArchivedBookingsViewProps {
  archivedBookings: Booking[];
}

const ArchivedBookingsView: React.FC<ArchivedBookingsViewProps> = ({ archivedBookings }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'customer' | 'package'>('date');
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({});

  // Toggle open state for a specific booking
  const toggleOpen = (bookingId: string) => {
    setOpenItems(prev => ({
      ...prev,
      [bookingId]: !prev[bookingId]
    }));
  };

  // Filter bookings based on search term
  const filteredBookings = archivedBookings.filter(booking => {
    const searchLower = searchTerm.toLowerCase();
    return (
      booking.customer.toLowerCase().includes(searchLower) ||
      booking.vehicle?.toLowerCase().includes(searchLower) ||
      booking.packageType?.toLowerCase().includes(searchLower) ||
      booking.id.toLowerCase().includes(searchLower)
    );
  });

  // Sort the filtered bookings
  const sortedBookings = [...filteredBookings].sort((a, b) => {
    if (sortBy === 'date') {
      const dateA = a.date instanceof Date ? a.date : new Date(a.date);
      const dateB = b.date instanceof Date ? b.date : new Date(b.date);
      return dateB.getTime() - dateA.getTime(); // Recent first
    } else if (sortBy === 'customer') {
      return a.customer.localeCompare(b.customer);
    } else {
      return (a.packageType || '').localeCompare(b.packageType || '');
    }
  });

  return (
    <Card className="bg-gray-900 border-gray-800 shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="text-white text-xl">Archived Jobs</span>
          <div className="text-sm text-gray-400">
            {archivedBookings.length} finished jobs
          </div>
        </CardTitle>
        
        <div className="flex flex-col sm:flex-row gap-3 mt-4">
          <div className="relative flex-grow">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input
              className="pl-8 bg-gray-800 border-gray-700 text-white"
              placeholder="Search by customer, vehicle..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="w-full sm:w-44">
            <Select value={sortBy} onValueChange={(value) => setSortBy(value as any)}>
              <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-gray-700">
                <SelectItem value="date">Sort by Date</SelectItem>
                <SelectItem value="customer">Sort by Customer</SelectItem>
                <SelectItem value="package">Sort by Package</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-3">
          {sortedBookings.length > 0 ? (
            sortedBookings.map((booking) => {
              const statusInfo = getStatusInfo(booking.status);
              const bookingDate = booking.date instanceof Date ? booking.date : new Date(booking.date);
              
              return (
                <div 
                  key={booking.id}
                  className={`p-3 rounded-lg ${statusInfo.color}`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-white font-medium">{booking.customer}</h3>
                      <div className="text-sm text-gray-400">
                        <div className="flex items-center gap-1 mt-1">
                          <Calendar className="h-3 w-3" />
                          <span>{format(bookingDate, "MMM d, yyyy")}</span>
                          <Clock className="h-3 w-3 ml-2" />
                          <span>{booking.time || booking.startTime}</span>
                        </div>
                        <div className="flex items-center gap-1 mt-1">
                          <Package className="h-3 w-3" />
                          <span>{booking.packageType || "Standard"} Package</span>
                        </div>
                      </div>
                    </div>
                    
                    <span className={`text-xs px-2 py-0.5 rounded-full ${statusInfo.badgeColor === 'green-600' ? 'bg-green-900/30 text-green-400 border border-green-700' : 'bg-' + statusInfo.badgeColor + '/30'}`}>
                      {statusInfo.label}
                    </span>
                  </div>
                  
                  <Collapsible className="mt-3 pt-2 border-t border-gray-700">
                    <CollapsibleTrigger 
                      className="flex w-full items-center justify-between text-sm text-gray-400 hover:text-white"
                      onClick={() => toggleOpen(booking.id)}
                    >
                      <span>View Details</span>
                      <span className="ml-2">
                        {openItems[booking.id] ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                      </span>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="pt-3 space-y-2">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                        <div>
                          <p className="text-gray-500">Booking ID</p>
                          <p className="text-white">{booking.id}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Vehicle</p>
                          <p className="text-white">{booking.vehicle || "Not specified"}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Location</p>
                          <p className="text-white">{booking.location || "Not specified"}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Price</p>
                          <p className="text-white">£{booking.totalPrice || "0"}</p>
                        </div>
                      </div>
                      
                      {booking.notes && (
                        <div className="mt-2">
                          <p className="text-gray-500">Notes</p>
                          <p className="text-white">{booking.notes}</p>
                        </div>
                      )}

                      {booking.staff && booking.staff.length > 0 && (
                        <div className="mt-2">
                          <p className="text-gray-500">Staff Assigned</p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {booking.staff.map((staff, idx) => (
                              <span key={idx} className="bg-gray-700 px-2 py-0.5 rounded-full text-xs text-white">
                                {staff}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </CollapsibleContent>
                  </Collapsible>
                </div>
              );
            })
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-400">No archived bookings found</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ArchivedBookingsView;

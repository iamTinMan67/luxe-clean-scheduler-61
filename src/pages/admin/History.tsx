
import { useState, useEffect } from "react";
import { format } from "date-fns";
import AdminPageTitle from "@/components/admin/AdminPageTitle";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { useArchivedBookings } from "@/hooks/planner/useArchivedBookings";
import { Booking } from "@/types/booking";

const History = () => {
  const { archivedBookings } = useArchivedBookings();
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  
  // Filter bookings based on search query and finished status
  useEffect(() => {
    const filtered = archivedBookings
      .filter(booking => booking.status === "finished")
      .filter(booking => {
        const query = searchQuery.toLowerCase();
        return (
          booking.customer?.toLowerCase().includes(query) ||
          booking.vehicle?.toLowerCase().includes(query) ||
          booking.vehicleReg?.toLowerCase().includes(query) ||
          booking.packageType?.toLowerCase().includes(query) ||
          booking.location?.toLowerCase().includes(query) ||
          booking.email?.toLowerCase().includes(query) ||
          booking.notes?.toLowerCase().includes(query)
        );
      });
    
    setFilteredBookings(filtered);
  }, [archivedBookings, searchQuery]);

  const formatDate = (dateString: Date | string) => {
    if (!dateString) return "N/A";
    try {
      const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
      return format(date, "dd/MM/yyyy");
    } catch (error) {
      console.error("Date formatting error:", error);
      return "Invalid Date";
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <AdminPageTitle 
        title="Booking History"
        subtitle="View all completed bookings"
      />
      
      {/* Search Bar */}
      <div className="mb-6 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        <Input
          placeholder="Search by customer, vehicle, location, etc..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 bg-black/20 border-gray-700 text-white"
        />
      </div>
      
      {/* History Table */}
      <div className="rounded-md border border-gray-800 bg-black/50 backdrop-blur-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-gray-700 bg-black/50">
              <TableHead className="text-gray-300">Date</TableHead>
              <TableHead className="text-gray-300">Customer</TableHead>
              <TableHead className="text-gray-300">Vehicle</TableHead>
              <TableHead className="text-gray-300">Package</TableHead>
              <TableHead className="text-gray-300">Location</TableHead>
              <TableHead className="text-gray-300">Price</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredBookings.length > 0 ? (
              filteredBookings.map((booking) => (
                <TableRow key={booking.id} className="border-gray-800 hover:bg-gray-900/50">
                  <TableCell>{formatDate(booking.date)}</TableCell>
                  <TableCell>{booking.customer}</TableCell>
                  <TableCell>
                    {booking.vehicle}
                    {booking.vehicleReg && <span className="block text-xs text-gray-400">{booking.vehicleReg}</span>}
                  </TableCell>
                  <TableCell>{booking.packageType}</TableCell>
                  <TableCell>{booking.location}</TableCell>
                  <TableCell>£{booking.totalPrice?.toFixed(2) || "N/A"}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-6 text-gray-400">
                  {searchQuery ? "No matching records found" : "No finished bookings available"}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
      {/* Stats Section */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-black/30 border border-gray-800 rounded-md p-4">
          <h3 className="text-gold font-medium mb-2">Total Bookings</h3>
          <p className="text-2xl font-bold">{filteredBookings.length}</p>
        </div>
        <div className="bg-black/30 border border-gray-800 rounded-md p-4">
          <h3 className="text-gold font-medium mb-2">Total Revenue</h3>
          <p className="text-2xl font-bold">
            £{filteredBookings.reduce((sum, booking) => sum + (booking.totalPrice || 0), 0).toFixed(2)}
          </p>
        </div>
        <div className="bg-black/30 border border-gray-800 rounded-md p-4">
          <h3 className="text-gold font-medium mb-2">Most Popular Package</h3>
          {(() => {
            const packageCounts: Record<string, number> = {};
            filteredBookings.forEach(booking => {
              const pkg = booking.packageType || "Unknown";
              packageCounts[pkg] = (packageCounts[pkg] || 0) + 1;
            });
            
            const popularPackage = Object.entries(packageCounts)
              .sort((a, b) => b[1] - a[1])[0];
              
            return popularPackage ? (
              <p className="text-xl font-bold">{popularPackage[0]}</p>
            ) : (
              <p className="text-xl font-bold">N/A</p>
            );
          })()}
        </div>
      </div>
    </div>
  );
};

export default History;


import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { usePlannerCalendar } from "@/hooks/usePlannerCalendar";
import { Clock, AlertCircle, Car, Truck, Wrench, Plus } from "lucide-react";

const CompactPendingBookings = () => {
  const { pendingBookings, conflictCount } = usePlannerCalendar();

  // Helper function to get job type icon
  const getJobTypeIcon = (jobType?: string) => {
    if (!jobType) return <Car className="w-3 h-3 text-gold" />;
    
    switch (jobType.toLowerCase()) {
      case 'car':
        return <Car className="w-3 h-3 text-gold" />;
      case 'van':
        return <Truck className="w-3 h-3 text-gold" />;
      case 'other':
        return <Wrench className="w-3 h-3 text-gold" />;
      default:
        return <Car className="w-3 h-3 text-gold" />;
    }
  };

  // Helper function to get job type display text
  const getJobTypeDisplay = (jobType?: string) => {
    if (!jobType) return 'Car Service';
    
    switch (jobType.toLowerCase()) {
      case 'car':
        return 'Car Service';
      case 'van':
        return 'Van Service';
      case 'other':
        return 'Custom Service';
      default:
        return jobType;
    }
  };

  // Helper function to get additional services display - show ALL services
  const getAllAdditionalServices = (serviceIds?: string[]): string[] => {
    if (!serviceIds || !Array.isArray(serviceIds) || serviceIds.length === 0) return [];
    
    // Import additionalServices safely
    try {
      const { additionalServices } = require("@/data/servicePackageData");
      return serviceIds.map(id => {
        // Ensure id is a string and not an object
        const serviceId = typeof id === 'string' ? id : String(id);
        const service = additionalServices?.find((s: any) => s.id === serviceId);
        return service ? String(service.name) : serviceId;
      }).filter(Boolean);
    } catch (error) {
      console.warn("Could not load additional services data:", error);
      // Return service IDs as strings, ensuring they're not objects
      return serviceIds.map(id => typeof id === 'string' ? id : String(id)).filter(Boolean);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="bg-gray-900 border-gray-800">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-gold" />
              Pending Bookings
            </h3>
            <div className="flex items-center space-x-2">
              <div className="px-2 py-1 rounded-full bg-red-900/30 text-red-400 border border-red-700 text-xs font-medium">
                {pendingBookings?.length || 0}
              </div>
              {conflictCount > 0 && (
                <div className="px-2 py-1 rounded-full bg-orange-900/30 text-orange-400 border border-orange-700 text-xs font-medium">
                  {conflictCount} conflicts
                </div>
              )}
            </div>
          </div>
          
          {!pendingBookings || pendingBookings.length === 0 ? (
            <div className="text-center py-4 text-gray-400">
              <p className="text-xs">No pending bookings</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {pendingBookings.slice(0, 3).map(booking => {
                const additionalServicesList = getAllAdditionalServices(booking.additionalServices);
                
                return (
                  <div key={booking.id} className="bg-gray-800 rounded p-2 space-y-1">
                    {/* Job Type */}
                    <div className="flex items-center gap-2">
                      {getJobTypeIcon(booking.jobType)}
                      <span className="text-xs font-medium text-white">
                        {getJobTypeDisplay(booking.jobType)}
                      </span>
                    </div>
                    
                    {/* All Additional Services */}
                    {additionalServicesList.length > 0 && (
                      <div className="space-y-1">
                        {additionalServicesList.map((serviceName, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <Plus className="w-3 h-3 text-blue-400" />
                            <span className="text-xs text-blue-400">
                              {serviceName}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {/* Post Code */}
                    <div className="text-xs text-gray-400">
                      📍 {booking.location || 'No location'}
                    </div>
                  </div>
                );
              })}
              {pendingBookings.length > 3 && (
                <div className="text-xs text-gray-400 text-center pt-1">
                  +{pendingBookings.length - 3} more
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default CompactPendingBookings;


import { AlertCircle } from "lucide-react";

const TrackingNotFound = () => {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center">
        <AlertCircle className="mx-auto h-12 w-12 text-amber-500 mb-4" />
        <h3 className="text-xl font-medium text-white mb-2">Booking Not Found</h3>
        <p className="text-gray-400">The booking you're looking for doesn't exist or you don't have permission to view it.</p>
      </div>
    </div>
  );
};

export default TrackingNotFound;

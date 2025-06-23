
import { useState } from 'react';
import { useDataSynchronization } from '@/hooks/tracking/useDataSynchronization';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { RefreshCw, Database, Eye, EyeOff } from 'lucide-react';

const TrackingDebugPanel = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [debugData, setDebugData] = useState<any>(null);
  const { getAllBookingData } = useDataSynchronization();

  const refreshDebugData = () => {
    const data = getAllBookingData();
    setDebugData(data);
    console.log('=== Debug Data Refreshed ===', data);
  };

  if (!isVisible) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={() => setIsVisible(true)}
          variant="outline"
          size="sm"
          className="bg-gray-900 border-gray-700 text-gray-300 hover:bg-gray-800"
        >
          <Eye className="h-4 w-4 mr-2" />
          Debug Panel
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-96 max-h-[600px] overflow-auto">
      <Card className="bg-gray-900 border-gray-700">
        <CardHeader className="pb-2">
          <CardTitle className="text-white text-sm flex items-center justify-between">
            Tracking Debug Panel
            <div className="flex gap-2">
              <Button
                onClick={refreshDebugData}
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
              >
                <RefreshCw className="h-3 w-3" />
              </Button>
              <Button
                onClick={() => setIsVisible(false)}
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
              >
                <EyeOff className="h-3 w-3" />
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-2">
          <div className="space-y-3">
            <Button
              onClick={refreshDebugData}
              className="w-full"
              size="sm"
            >
              <Database className="h-4 w-4 mr-2" />
              Load Debug Data
            </Button>
            
            {debugData && (
              <div className="space-y-2 text-xs">
                <div>
                  <h4 className="text-white font-medium">Confirmed Bookings</h4>
                  <p className="text-gray-400">{debugData.confirmedBookings.length} items</p>
                </div>
                
                <div>
                  <h4 className="text-white font-medium">Planner Bookings</h4>
                  <p className="text-gray-400">{debugData.plannerCalendarBookings.length} items</p>
                </div>
                
                <div>
                  <h4 className="text-white font-medium">Service Progress</h4>
                  <p className="text-gray-400">{debugData.serviceProgress.length} items</p>
                </div>
                
                <div>
                  <h4 className="text-white font-medium">Tracking Progress</h4>
                  <p className="text-gray-400">{debugData.trackingProgress.length} items</p>
                </div>
                
                {debugData.serviceProgress.length > 0 && (
                  <div className="mt-2 p-2 bg-gray-800 rounded text-xs">
                    <h5 className="text-white font-medium mb-1">Latest Progress:</h5>
                    {debugData.serviceProgress.map((progress: any, index: number) => (
                      <div key={index} className="text-gray-300">
                        {progress.bookingId}: {progress.progressPercentage}%
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TrackingDebugPanel;

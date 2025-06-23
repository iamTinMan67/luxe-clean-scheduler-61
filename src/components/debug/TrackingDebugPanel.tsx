
import { useState } from 'react';
import { useDataSynchronization } from '@/hooks/tracking/useDataSynchronization';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { RefreshCw, Database, Eye, EyeOff, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

const TrackingDebugPanel = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [debugData, setDebugData] = useState<any>(null);
  const [bookingId, setBookingId] = useState('');
  const [consistencyResult, setConsistencyResult] = useState<boolean | null>(null);
  const { getAllBookingData, getTrackingData, validateConsistency } = useDataSynchronization();

  const refreshDebugData = () => {
    const data = getAllBookingData();
    setDebugData(data);
    console.log('=== Enhanced Debug Data Refreshed ===', data);
  };

  const checkSpecificBooking = () => {
    if (!bookingId.trim()) return;
    
    const trackingData = getTrackingData(bookingId);
    const isConsistent = validateConsistency(bookingId);
    
    setConsistencyResult(isConsistent);
    console.log('=== Specific Booking Debug ===', {
      bookingId,
      trackingData,
      isConsistent
    });
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
          Enhanced Debug
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-96 max-h-[700px] overflow-auto">
      <Card className="bg-gray-900 border-gray-700">
        <CardHeader className="pb-2">
          <CardTitle className="text-white text-sm flex items-center justify-between">
            Enhanced Tracking Debug Panel
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
            {/* General Debug Section */}
            <Button
              onClick={refreshDebugData}
              className="w-full"
              size="sm"
            >
              <Database className="h-4 w-4 mr-2" />
              Load All Debug Data
            </Button>
            
            {/* Specific Booking Debug */}
            <div className="space-y-2">
              <label className="text-white text-xs font-medium">Check Specific Booking:</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={bookingId}
                  onChange={(e) => setBookingId(e.target.value)}
                  placeholder="Enter Booking ID"
                  className="flex-1 px-2 py-1 text-xs bg-gray-800 border border-gray-600 rounded text-white"
                />
                <Button
                  onClick={checkSpecificBooking}
                  size="sm"
                  className="px-2 py-1 text-xs"
                >
                  Check
                </Button>
              </div>
              
              {consistencyResult !== null && (
                <div className={`flex items-center gap-1 text-xs ${
                  consistencyResult ? 'text-green-400' : 'text-red-400'
                }`}>
                  {consistencyResult ? (
                    <CheckCircle className="h-3 w-3" />
                  ) : (
                    <XCircle className="h-3 w-3" />
                  )}
                  Data {consistencyResult ? 'Consistent' : 'Inconsistent'}
                </div>
              )}
            </div>
            
            {debugData && (
              <div className="space-y-2 text-xs">
                <div>
                  <h4 className="text-white font-medium flex items-center gap-1">
                    <Database className="h-3 w-3" />
                    Storage Overview
                  </h4>
                  <div className="grid grid-cols-2 gap-2 mt-1">
                    <div className="bg-gray-800 p-2 rounded">
                      <div className="text-gray-400">Confirmed</div>
                      <div className="text-white font-medium">{debugData.confirmedBookings.length}</div>
                    </div>
                    <div className="bg-gray-800 p-2 rounded">
                      <div className="text-gray-400">Planner</div>
                      <div className="text-white font-medium">{debugData.plannerCalendarBookings.length}</div>
                    </div>
                    <div className="bg-gray-800 p-2 rounded">
                      <div className="text-gray-400">Service</div>
                      <div className="text-white font-medium">{debugData.serviceProgress.length}</div>
                    </div>
                    <div className="bg-gray-800 p-2 rounded">
                      <div className="text-gray-400">Tracking</div>
                      <div className="text-white font-medium">{debugData.trackingProgress.length}</div>
                    </div>
                  </div>
                </div>
                
                {debugData.serviceProgress.length > 0 && (
                  <div className="bg-gray-800 p-2 rounded">
                    <h5 className="text-white font-medium mb-1 flex items-center gap-1">
                      <CheckCircle className="h-3 w-3" />
                      Latest Progress:
                    </h5>
                    {debugData.serviceProgress.slice(-3).map((progress: any, index: number) => (
                      <div key={index} className="text-gray-300 flex justify-between">
                        <span className="truncate">{progress.bookingId.substring(0, 8)}...</span>
                        <span className="text-green-400">{progress.progressPercentage}%</span>
                      </div>
                    ))}
                  </div>
                )}
                
                {debugData.trackingProgress.length > 0 && (
                  <div className="bg-gray-800 p-2 rounded">
                    <h5 className="text-white font-medium mb-1 flex items-center gap-1">
                      <AlertTriangle className="h-3 w-3" />
                      Tracking Status:
                    </h5>
                    {debugData.trackingProgress.slice(-3).map((tracking: any, index: number) => (
                      <div key={index} className="text-gray-300">
                        <div className="flex justify-between">
                          <span className="truncate">{tracking.bookingId.substring(0, 8)}...</span>
                          <span className="text-blue-400">{tracking.progressPercentage}%</span>
                        </div>
                        <div className="text-xs text-gray-500">{tracking.currentStep}</div>
                      </div>
                    ))}
                  </div>
                )}
                
                <div className="text-xs text-gray-500 text-center">
                  Last updated: {new Date().toLocaleTimeString()}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TrackingDebugPanel;


import { clearMockDataFromStorage } from './bookingStorageFallback';
import { toast } from 'sonner';

export const performMockDataCleanup = (): void => {
  console.log("=== Manual Mock Data Cleanup Triggered ===");
  
  try {
    // Clear mock data from all localStorage keys
    clearMockDataFromStorage();
    
    // Show success message
    toast.success("Mock data cleanup completed successfully");
    
    // Suggest page refresh to see changes
    toast.info("Please refresh the page to see updated data");
    
    console.log("=== Manual Mock Data Cleanup Completed ===");
  } catch (error) {
    console.error("Error during mock data cleanup:", error);
    toast.error("Failed to cleanup mock data");
  }
};

// Function to check if there's any mock data in storage
export const checkForMockData = (): boolean => {
  const storageKeys = [
    'pendingBookings',
    'confirmedBookings', 
    'plannerCalendarBookings',
    'bookings'
  ];
  
  const mockIndicators = [
    'test-booking',
    'mock-booking',
    'example-booking',
    'demo-booking',
    'Test Customer',
    'Mock Customer',
    'Example Customer',
    'Demo Customer'
  ];
  
  for (const key of storageKeys) {
    const stored = localStorage.getItem(key);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        const hasMockData = parsed.some((booking: any) => {
          return mockIndicators.some(indicator => {
            const bookingText = `${booking.id || ''} ${booking.customer || ''} ${booking.yourName || ''}`.toLowerCase();
            return bookingText.includes(indicator.toLowerCase());
          });
        });
        
        if (hasMockData) {
          console.log(`Found mock data in ${key}`);
          return true;
        }
      } catch (error) {
        console.error(`Error checking ${key} for mock data:`, error);
      }
    }
  }
  
  return false;
};

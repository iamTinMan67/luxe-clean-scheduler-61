
// Utility to detect and clean up mock/test data from localStorage

// Function to detect mock/test bookings and other data
const isMockData = (item: any): boolean => {
  const mockIndicators = [
    'test-booking',
    'mock-booking', 
    'example-booking',
    'demo-booking',
    'Test Customer',
    'Mock Customer',
    'Example Customer', 
    'Demo Customer',
    'test-',
    'mock-',
    'demo-',
    'sample-'
  ];
  
  // Check various fields that might contain mock indicators
  const fieldsToCheck = [
    item.id,
    item.customer,
    item.yourName,
    item.name,
    item.title,
    item.description
  ];
  
  return fieldsToCheck.some(field => 
    field && mockIndicators.some(indicator => 
      field.toString().toLowerCase().includes(indicator.toLowerCase())
    )
  );
};

// Function to clean mock data from a specific localStorage key
const cleanMockDataFromKey = (key: string): number => {
  const stored = localStorage.getItem(key);
  if (!stored) return 0;
  
  try {
    const parsed = JSON.parse(stored);
    if (!Array.isArray(parsed)) return 0;
    
    const filtered = parsed.filter(item => !isMockData(item));
    const removedCount = parsed.length - filtered.length;
    
    if (removedCount > 0) {
      localStorage.setItem(key, JSON.stringify(filtered));
      console.log(`${key}: removed ${removedCount} mock items, ${filtered.length} real items remaining`);
    }
    
    return removedCount;
  } catch (error) {
    console.error(`Error cleaning ${key}:`, error);
    return 0;
  }
};

// Main function to clean all mock data from localStorage
export const cleanupMockData = (): void => {
  console.log("=== Starting Mock Data Cleanup ===");
  
  const keysToClean = [
    'pendingBookings',
    'confirmedBookings',
    'plannerCalendarBookings', 
    'bookings',
    'appointments',
    'serviceProgress',
    'inspectionReports',
    'invoices',
    'pendingInvoices',
    'archivedBookings',
    'feedback',
    'galleryItems',
    'albumItems'
  ];
  
  let totalRemoved = 0;
  
  keysToClean.forEach(key => {
    const removed = cleanMockDataFromKey(key);
    totalRemoved += removed;
  });
  
  // Force a page refresh if significant mock data was removed
  if (totalRemoved > 0) {
    console.log(`=== Mock Data Cleanup Complete: ${totalRemoved} total items removed ===`);
    
    // Trigger storage events for any components listening
    window.dispatchEvent(new Event('storage'));
    
    // Optional: Show a toast notification
    if (window.dispatchEvent) {
      window.dispatchEvent(new CustomEvent('mockDataCleaned', {
        detail: { removedCount: totalRemoved }
      }));
    }
  } else {
    console.log("=== Mock Data Cleanup Complete: No mock data found ===");
  }
};

// Function to run cleanup automatically on app initialization
export const initializeMockDataCleanup = (): void => {
  // Only run in development or if explicitly enabled
  if (import.meta.env.DEV || localStorage.getItem('enableMockDataCleanup') === 'true') {
    cleanupMockData();
  }
};

// Export individual functions for targeted cleanup
export { cleanMockDataFromKey, isMockData };

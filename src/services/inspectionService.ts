
import { Booking } from "@/types/booking";
import { packageOptions, additionalServices } from "@/data/servicePackageData";

export interface InspectionReport {
  id: string;
  bookingId: string;
  customer: string;
  vehicle: string;
  date: Date | string;
  time: string;
  images: string[];
  exteriorNotes: string;
  interiorNotes: string;
  createdAt: Date;
}

// Helper function to populate ToDo list based on booking package and additional services
const populateToDoList = (booking: Booking) => {
  // Find the package
  const packageOption = packageOptions.find(p => p.type === booking.packageType);
  
  if (packageOption) {
    // Create service tasks
    const serviceTasks = packageOption.tasks.map(task => ({
      id: `${task.id}-${booking.id}`,
      name: task.name,
      completed: false,
      allocatedTime: task.duration,
      appointment_id: booking.id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }));
    
    // Add additional services if present
    if (booking.additionalServices && Array.isArray(booking.additionalServices)) {
      booking.additionalServices.forEach(serviceId => {
        const service = additionalServices.find(s => s.id === serviceId);
        if (service) {
          serviceTasks.push({
            id: `${service.id}-${booking.id}`,
            name: service.name,
            completed: false,
            allocatedTime: service.duration || 30, // Default 30 mins
            appointment_id: booking.id,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });
        }
      });
    }
    
    // Save to localStorage
    const existingTasks = JSON.parse(localStorage.getItem('serviceTasks') || '[]');
    localStorage.setItem('serviceTasks', JSON.stringify([...existingTasks, ...serviceTasks]));
    
    // Create empty progress tracking data for this booking
    const bookingSteps = serviceTasks.map((task, index) => ({
      id: index + 1,
      name: task.name,
      completed: false,
      time: undefined,
      estimatedTime: `${task.allocatedTime} minutes`
    }));
    
    // Store steps for the progress tracking page
    const progressData = {
      bookingId: booking.id,
      steps: bookingSteps,
      updatedAt: new Date().toISOString()
    };
    
    const savedProgressData = JSON.parse(localStorage.getItem('bookingProgressData') || '[]');
    const existingDataIndex = savedProgressData.findIndex((p: any) => p.bookingId === booking.id);
    
    if (existingDataIndex >= 0) {
      savedProgressData[existingDataIndex] = progressData;
    } else {
      savedProgressData.push(progressData);
    }
    
    localStorage.setItem('bookingProgressData', JSON.stringify(savedProgressData));
    
    return serviceTasks.length;
  }
  
  return 0;
};

export const submitPreInspectionReport = async (
  booking: Booking,
  images: string[],
  exteriorNotes: string,
  interiorNotes: string
): Promise<boolean> => {
  try {
    // In a real app, this would send the data to a server
    // For now, store it in localStorage
    const reportId = `report-${Math.random().toString(36).substring(2, 15)}`;
    
    const report: InspectionReport = {
      id: reportId,
      bookingId: booking.id,
      customer: booking.customer,
      vehicle: booking.vehicle,
      date: booking.date,
      time: booking.time || '',
      images: images,
      exteriorNotes: exteriorNotes,
      interiorNotes: interiorNotes,
      createdAt: new Date()
    };
    
    // Get existing reports
    const existingReports = localStorage.getItem('inspectionReports');
    let reports = existingReports ? JSON.parse(existingReports) : [];
    
    // Add the new report
    reports.push(report);
    
    // Save the updated reports
    localStorage.setItem('inspectionReports', JSON.stringify(reports));
    
    // Make sure the booking is marked as inspected and maintain that status
    const confirmedBookingsStr = localStorage.getItem('confirmedBookings');
    if (confirmedBookingsStr) {
      const confirmedBookings = JSON.parse(confirmedBookingsStr);
      const updatedBookings = confirmedBookings.map((b: Booking) => {
        if (b.id === booking.id) {
          return { ...b, status: 'inspected', inspectionReportId: reportId };
        }
        return b;
      });
      
      localStorage.setItem('confirmedBookings', JSON.stringify(updatedBookings));
    }
    
    // Update planner calendar booking status as well
    const plannerBookingsStr = localStorage.getItem('plannerCalendarBookings');
    if (plannerBookingsStr) {
      const plannerBookings = JSON.parse(plannerBookingsStr);
      const updatedBookings = plannerBookings.map((b: Booking) => {
        if (b.id === booking.id) {
          return { ...b, status: 'inspected', inspectionReportId: reportId };
        }
        return b;
      });
      
      localStorage.setItem('plannerCalendarBookings', JSON.stringify(updatedBookings));
    }
    
    // Ensure the ToDo list is populated
    populateToDoList(booking);
    
    return true;
  } catch (error) {
    console.error("Error submitting pre-inspection report:", error);
    return false;
  }
};

export const getInspectionReport = (bookingId: string): InspectionReport | null => {
  try {
    const reportsStr = localStorage.getItem('inspectionReports');
    if (!reportsStr) return null;
    
    const reports: InspectionReport[] = JSON.parse(reportsStr);
    return reports.find(report => report.bookingId === bookingId) || null;
  } catch (error) {
    console.error("Error getting inspection report:", error);
    return null;
  }
};

export default {
  submitPreInspectionReport,
  getInspectionReport
};

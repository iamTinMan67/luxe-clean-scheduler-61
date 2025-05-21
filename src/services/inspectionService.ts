
import { Booking } from "@/types/booking";

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
      time: booking.time,
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
    
    // Update the booking status to in-progress
    const confirmedBookingsStr = localStorage.getItem('confirmedBookings');
    if (confirmedBookingsStr) {
      const confirmedBookings = JSON.parse(confirmedBookingsStr);
      const updatedBookings = confirmedBookings.map((b: Booking) => {
        if (b.id === booking.id) {
          return { ...b, status: 'in-progress', inspectionReportId: reportId };
        }
        return b;
      });
      
      localStorage.setItem('confirmedBookings', JSON.stringify(updatedBookings));
    }
    
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


import { toast } from "sonner";
import { Booking } from "@/types/booking";
import { InspectionChecklistItem, CustomChecklistItem } from "@/types/task";
import { supabase } from "@/integrations/supabase/client";

export interface InspectionReport {
  id: string;
  bookingId: string;
  exteriorNotes: string;
  interiorNotes: string;
  images: string[];
  date: string;
  type: "pre" | "post";
  standardChecklistItems: InspectionChecklistItem[];
  customChecklistItems: CustomChecklistItem[];
}

/**
 * Submit a pre-inspection report to Supabase
 */
export const submitPreInspectionReport = async (
  bookingDetails: Booking | null,
  images: string[],
  exteriorNotes: string,
  interiorNotes: string
): Promise<boolean> => {
  if (!bookingDetails) {
    toast.error("Please select a booking first");
    return false;
  }

  if (images.length === 0) {
    toast.error("No images uploaded. Consider adding vehicle condition photos.");
    return false;
  }

  // Get checklist data from localStorage
  let standardItems: InspectionChecklistItem[] = [];
  let customItems: CustomChecklistItem[] = [];
  
  try {
    const checklistData = localStorage.getItem('lastInspectionChecklist');
    if (checklistData) {
      const parsedData = JSON.parse(checklistData);
      standardItems = parsedData.standardItems || [];
      customItems = parsedData.customItems || [];
    }
  } catch (error) {
    console.error("Error parsing checklist data:", error);
  }

  try {
    // 1. First, insert the main inspection report
    const { data: reportData, error: reportError } = await supabase
      .from('inspection_reports')
      .insert({
        booking_id: bookingDetails.id,
        exterior_notes: exteriorNotes,
        interior_notes: interiorNotes,
        images: images,
        type: 'pre'
      })
      .select('id')
      .single();
    
    if (reportError) throw reportError;
    
    const reportId = reportData.id;

    // 2. Insert standard checklist items
    if (standardItems.length > 0) {
      const standardItemsToInsert = standardItems.map(item => ({
        report_id: reportId,
        item_id: item.id,
        label: item.label,
        completed: item.completed,
        required: item.required
      }));
      
      const { error: standardItemsError } = await supabase
        .from('inspection_checklist_items')
        .insert(standardItemsToInsert);
      
      if (standardItemsError) throw standardItemsError;
    }

    // 3. Insert custom checklist items
    if (customItems.length > 0) {
      const customItemsToInsert = customItems.map(item => ({
        report_id: reportId,
        label: item.label,
        completed: item.completed
      }));
      
      const { error: customItemsError } = await supabase
        .from('inspection_custom_items')
        .insert(customItemsToInsert);
      
      if (customItemsError) throw customItemsError;
    }

    // 4. Update booking status to "in-progress" in localStorage
    const confirmedBookings = JSON.parse(localStorage.getItem('confirmedBookings') || '[]');
    const updatedBookings = confirmedBookings.map((booking: Booking) => {
      if (booking.id === bookingDetails.id) {
        return {
          ...booking,
          status: "in-progress"
        };
      }
      return booking;
    });
    
    localStorage.setItem('confirmedBookings', JSON.stringify(updatedBookings));
    
    // Also update in planner calendar bookings if it exists there
    const plannerBookings = JSON.parse(localStorage.getItem('plannerCalendarBookings') || '[]');
    const updatedPlannerBookings = plannerBookings.map((booking: Booking) => {
      if (booking.id === bookingDetails.id) {
        return {
          ...booking,
          status: "in-progress"
        };
      }
      return booking;
    });
    
    localStorage.setItem('plannerCalendarBookings', JSON.stringify(updatedPlannerBookings));

    toast.success("Pre-inspection report has been saved and booking status updated to 'In Progress'");
    return true;
  } catch (error: any) {
    console.error("Error submitting inspection report:", error);
    toast.error("Failed to save inspection report", { description: error.message });
    return false;
  }
};

/**
 * Retrieve inspection reports for a specific booking
 */
export const getInspectionReports = async (bookingId: string): Promise<InspectionReport[]> => {
  try {
    // 1. Get all inspection reports for this booking
    const { data: reports, error: reportsError } = await supabase
      .from('inspection_reports')
      .select('*')
      .eq('booking_id', bookingId)
      .order('date', { ascending: false });
    
    if (reportsError) throw reportsError;
    
    if (!reports || reports.length === 0) {
      return [];
    }

    // 2. Fetch checklist items for each report
    const result: InspectionReport[] = await Promise.all(
      reports.map(async (report) => {
        // Get standard checklist items
        const { data: standardItems, error: standardItemsError } = await supabase
          .from('inspection_checklist_items')
          .select('*')
          .eq('report_id', report.id);
        
        if (standardItemsError) throw standardItemsError;
        
        // Get custom checklist items
        const { data: customItems, error: customItemsError } = await supabase
          .from('inspection_custom_items')
          .select('*')
          .eq('report_id', report.id);
        
        if (customItemsError) throw customItemsError;
        
        // Map to our types
        const mappedStandardItems: InspectionChecklistItem[] = standardItems.map(item => ({
          id: item.item_id,
          label: item.label,
          completed: item.completed,
          required: item.required,
          vehicleType: 'all' // default, we don't store this in DB
        }));
        
        const mappedCustomItems: CustomChecklistItem[] = customItems.map(item => ({
          id: item.id,
          label: item.label,
          completed: item.completed
        }));
        
        // Ensure the type is correctly cast to the string literal union type
        const inspectionType = report.type === 'pre' || report.type === 'post' 
          ? report.type as 'pre' | 'post'
          : 'pre'; // Default to 'pre' if somehow we get an invalid value
        
        return {
          id: report.id,
          bookingId: report.booking_id,
          exteriorNotes: report.exterior_notes || '',
          interiorNotes: report.interior_notes || '',
          images: report.images || [],
          date: report.date,
          type: inspectionType,
          standardChecklistItems: mappedStandardItems,
          customChecklistItems: mappedCustomItems
        };
      })
    );

    return result;
  } catch (error) {
    console.error("Error retrieving inspection reports:", error);
    toast.error("Failed to load inspection reports");
    return [];
  }
};

/**
 * Get the latest inspection report for a booking
 */
export const getLatestInspectionReport = async (bookingId: string): Promise<InspectionReport | null> => {
  const reports = await getInspectionReports(bookingId);
  return reports.length > 0 ? reports[0] : null;
};

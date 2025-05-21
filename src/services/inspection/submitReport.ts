
import { toast } from "sonner";
import { Booking } from "@/types/booking";
import { InspectionChecklistItem, CustomChecklistItem } from "@/types/task";
import { supabase } from "@/integrations/supabase/client";

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

    // 4. Update booking status to "inspected" in localStorage
    const confirmedBookings = JSON.parse(localStorage.getItem('confirmedBookings') || '[]');
    const updatedBookings = confirmedBookings.map((booking: Booking) => {
      if (booking.id === bookingDetails.id) {
        return {
          ...booking,
          status: "inspected" // Change status to "inspected" instead of "in-progress"
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
          status: "inspected" // Change status to "inspected" instead of "in-progress"
        };
      }
      return booking;
    });
    
    localStorage.setItem('plannerCalendarBookings', JSON.stringify(updatedPlannerBookings));

    toast.success("Pre-inspection report has been saved and booking status updated to 'Inspected'");
    return true;
  } catch (error: any) {
    console.error("Error submitting inspection report:", error);
    toast.error("Failed to save inspection report", { description: error.message });
    return false;
  }
};

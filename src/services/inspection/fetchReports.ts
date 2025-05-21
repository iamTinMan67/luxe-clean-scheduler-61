
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { InspectionReport } from "./types";
import { InspectionChecklistItem, CustomChecklistItem } from "@/types/task";

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


import { InspectionChecklistItem, CustomChecklistItem } from "@/types/task";

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

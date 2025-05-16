
// This file imports and re-exports toast functionality from the correct location

import { useToast as useToastOriginal } from "@/hooks/use-toast";
import { toast as toastOriginal } from "@/hooks/use-toast";

export const useToast = useToastOriginal;
export const toast = toastOriginal;

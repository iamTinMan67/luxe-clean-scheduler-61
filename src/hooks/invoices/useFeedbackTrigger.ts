
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useFeedbackTrigger = () => {
  useEffect(() => {
    // Set up real-time listener for invoice payment updates
    const subscription = supabase
      .channel('invoice-payments')
      .on('postgres_changes', 
        { 
          event: 'UPDATE', 
          schema: 'public', 
          table: 'invoices',
          filter: 'paid=eq.true'
        }, 
        (payload) => {
          const invoice = payload.new;
          if (invoice.paid && payload.old?.paid === false) {
            // Invoice was just marked as paid
            triggerFeedbackEvent(invoice);
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const triggerFeedbackEvent = async (invoice: any) => {
    try {
      // Generate feedback link
      const feedbackUrl = `${window.location.origin}/feedback?invoice=${invoice.id}`;
      
      // Log the feedback trigger
      console.log("Feedback event triggered for invoice:", invoice.reference_id);
      console.log("Feedback URL:", feedbackUrl);
      
      // Show notification to admin
      toast.success("Payment received!", {
        description: `Invoice ${invoice.reference_id} has been paid. Feedback request should be sent to ${invoice.customer_name}.`,
        action: {
          label: "Copy Feedback Link",
          onClick: () => {
            navigator.clipboard.writeText(feedbackUrl);
            toast.success("Feedback link copied to clipboard");
          }
        },
        duration: 10000
      });

      // In a real implementation, you would:
      // 1. Send an email to the customer with the feedback link
      // 2. Update any CRM systems
      // 3. Schedule follow-up reminders
      // 4. Log the event for analytics

    } catch (error) {
      console.error("Error triggering feedback event:", error);
    }
  };

  return { triggerFeedbackEvent };
};

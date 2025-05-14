
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import FeedbackForm from "@/components/feedback/FeedbackForm";
import FeedbackHeader from "@/components/feedback/FeedbackHeader";
import FeedbackLoading from "@/components/feedback/FeedbackLoading";
import { useFeedbackPage } from "@/hooks/useFeedbackPage";

const Feedback = () => {
  const { invoiceId } = useParams();
  const { customerName, serviceDate, loading } = useFeedbackPage(invoiceId);
  
  return (
    <div className="min-h-screen bg-black">
      <section className="relative py-24">
        <div className="container mx-auto px-4">
          <FeedbackHeader />
          
          <div className="max-w-2xl mx-auto">
            {loading ? (
              <FeedbackLoading />
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                {invoiceId ? (
                  <FeedbackForm 
                    bookingId={invoiceId}
                    customerName={customerName}
                    serviceDate={serviceDate}
                  />
                ) : (
                  <div className="text-center py-8 text-white">
                    <p>No booking reference found. Please use the link provided in your invoice.</p>
                  </div>
                )}
              </motion.div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Feedback;

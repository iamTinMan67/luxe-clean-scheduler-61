
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import ProgressHeader from "@/components/progress/ProgressHeader";
import BookingInfoCard from "@/components/progress/BookingInfoCard";
import CurrentActivity from "@/components/progress/CurrentActivity";
import ServiceTimeline from "@/components/progress/ServiceTimeline";
import { useProgressTracking } from "@/hooks/progress/useProgressTracking";

const ProgressPage = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const invoiceIdFromUrl = queryParams.get('invoiceId');
  
  const { booking, currentStep, currentStepIndex, formatDate } = useProgressTracking(invoiceIdFromUrl);
  
  return (
    <div className="min-h-screen bg-black">
      <section className="relative py-24">
        <div className="container mx-auto px-4">
          <ProgressHeader />
          
          <div className="max-w-4xl mx-auto">
            <BookingInfoCard booking={booking} formatDate={formatDate} />
            
            {currentStep && (
              <CurrentActivity currentStep={currentStep} />
            )}
            
            <ServiceTimeline steps={booking.steps} currentStepIndex={currentStepIndex} />
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProgressPage;

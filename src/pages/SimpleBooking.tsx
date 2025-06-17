
import React, { useEffect } from 'react';
import SimpleBookingForm from '@/components/booking/simple/SimpleBookingForm';
import BubblesEffect from '@/components/ui/BubblesEffect';

const SimpleBooking = () => {
  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
    
    // Additional safeguard for cases where immediate scroll doesn't work
    const timer = setTimeout(() => {
      window.scrollTo(0, 0);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black py-12 relative">
      <BubblesEffect />
      <div className="container mx-auto px-4 max-w-4xl relative z-10">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            Request Service
          </h1>
          <p className="text-gray-300 text-lg">
            Let us know about your service requirements
          </p>
        </div>
        
        <div className="bg-gray-900/50 backdrop-blur-sm rounded-lg border border-gray-800 p-8">
          <SimpleBookingForm />
        </div>
      </div>
    </div>
  );
};

export default SimpleBooking;


import React from 'react';
import SimpleBookingForm from '@/components/booking/simple/SimpleBookingForm';

const SimpleBooking = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black py-12">
      <div className="container mx-auto px-4 max-w-4xl">
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

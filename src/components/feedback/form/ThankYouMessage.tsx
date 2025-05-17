
import React from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ThankYouMessageProps {
  redirectPath: string;
}

const ThankYouMessage = ({ redirectPath }: ThankYouMessageProps) => {
  const navigate = useNavigate();
  
  return (
    <Card className="bg-gray-900/50 backdrop-blur-sm rounded-lg p-8 border border-gray-800">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-4">Thank You!</h2>
        <p className="text-gray-300 mb-6">
          You have already submitted feedback for this booking.
          We appreciate your input!
        </p>
        <Button 
          onClick={() => navigate(redirectPath)} 
          className="bg-gold hover:bg-gold/80 text-black font-bold transition-colors"
        >
          Return Home
        </Button>
      </div>
    </Card>
  );
};

export default ThankYouMessage;

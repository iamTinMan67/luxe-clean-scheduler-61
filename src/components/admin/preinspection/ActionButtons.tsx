
import { Button } from "@/components/ui/button";

interface ActionButtonsProps {
  isSubmitting: boolean;
  onAccept: () => void;
  onDecline: () => void;
  onStartInspection: () => void;
  showStartInspection: boolean;
  showInspectionComplete: boolean;
}

const ActionButtons = ({ 
  isSubmitting, 
  onAccept, 
  onDecline, 
  onStartInspection,
  showStartInspection,
  showInspectionComplete 
}: ActionButtonsProps) => {
  return (
    <div className="space-y-4">
      {/* Start Inspection button - shown when booking is selected and confirmed */}
      {showStartInspection && (
        <div className="flex gap-4">
          <Button 
            className="w-1/2 bg-blue-500 hover:bg-blue-600 text-white hover:shadow-lg"
            onClick={onStartInspection}
            disabled={isSubmitting}
          >
            Start Inspection
          </Button>
          <Button 
            className="w-1/2 bg-red-500 hover:bg-red-600 text-white"
            onClick={onDecline}
            disabled={isSubmitting}
          >
            Decline
          </Button>
        </div>
      )}
      
      {/* Inspection Complete button - shown at bottom when inspection is in progress */}
      {showInspectionComplete && (
        <div className="mt-6 pt-6 border-t border-gold/30">
          <Button 
            className="w-full bg-green-500 hover:bg-green-600 text-white hover:shadow-lg"
            onClick={onAccept}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Inspection Complete"}
          </Button>
        </div>
      )}
    </div>
  );
};

export default ActionButtons;

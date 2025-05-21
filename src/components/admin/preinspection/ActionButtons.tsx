
import { Button } from "@/components/ui/button";

interface ActionButtonsProps {
  isSubmitting: boolean;
  onAccept: () => void;
  onDecline: () => void;
}

const ActionButtons = ({ isSubmitting, onAccept, onDecline }: ActionButtonsProps) => {
  return (
    <div className="mt-4 mb-6 flex gap-4">
      <Button 
        className="w-1/2 bg-green-500 hover:bg-green-600 text-white hover:shadow-lg"
        onClick={onAccept}
        disabled={isSubmitting}
      >
        {isSubmitting ? "Submitting..." : "Accept"}
      </Button>
      <Button 
        className="w-1/2 bg-red-500 hover:bg-red-600 text-white"
        onClick={onDecline}
        disabled={isSubmitting}
      >
        Decline
      </Button>
    </div>
  );
};

export default ActionButtons;

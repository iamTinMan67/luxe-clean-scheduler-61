
import { Button } from "@/components/ui/button";

const SubmitButton = () => {
  return (
    <Button 
      type="submit" 
      className="w-full gold-gradient text-black hover:shadow-xl hover:shadow-gold/20 transition-all"
    >
      Request Booking
    </Button>
  );
};

export default SubmitButton;

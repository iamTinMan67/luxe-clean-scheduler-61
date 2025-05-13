
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const AlreadyLoggedIn = () => {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
      <div className="text-center mb-6">
        <CheckCircle2 className="mx-auto h-12 w-12 text-gold mb-4" />
        <h2 className="text-2xl font-bold mb-2">Already Logged In</h2>
        <p className="text-gray-400">You are already logged in to the system.</p>
      </div>
      <Button 
        onClick={() => window.location.href = '/'}
        className="gold-gradient text-black hover:shadow-xl hover:shadow-gold/20 transition-all"
      >
        Go to Home
      </Button>
    </div>
  );
};

export default AlreadyLoggedIn;

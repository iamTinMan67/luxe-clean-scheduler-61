
import { Facebook, Instagram, Twitter, Mail, Phone, MessageSquare, Smartphone } from "lucide-react";
import { toast } from "@/components/ui/use-toast"; 

const SocialLinks = ({ showLabels = false }: { showLabels?: boolean }) => {
  const handleCopyNumber = (number: string) => {
    navigator.clipboard.writeText(number);
    toast({
      description: "Phone number copied to clipboard!",
      duration: 3000,
    });
  };

  return (
    <div className={`flex ${showLabels ? 'flex-col space-y-3' : 'space-x-4'}`}>
      {/* Facebook */}
      <a 
        href="https://facebook.com/midcheshiremobilevaleting" 
        target="_blank" 
        rel="noopener noreferrer" 
        className={`${showLabels ? 'flex items-center space-x-2' : ''} text-gray-400 hover:text-blue-600 transition-colors duration-300`}
        aria-label="Facebook"
      >
        <Facebook size={20} />
        {showLabels && <span>Message on Facebook</span>}
      </a>

      {/* Instagram */}
      <a 
        href="https://instagram.com/midcheshiremobilevaleting" 
        target="_blank" 
        rel="noopener noreferrer" 
        className={`${showLabels ? 'flex items-center space-x-2' : ''} text-gray-400 hover:text-pink-500 transition-colors duration-300`}
        aria-label="Instagram"
      >
        <Instagram size={20} />
        {showLabels && <span>Follow on Instagram</span>}
      </a>

      {/* SMS */}
      <a 
        href="sms:+447927208228" 
        className={`${showLabels ? 'flex items-center space-x-2' : ''} text-gray-400 hover:text-yellow-500 transition-colors duration-300`}
        aria-label="Text Message"
      >
        <Smartphone size={20} />
        {showLabels && <span>Send a Text</span>}
      </a>

            <a 
        href="sms:+447845574743" 
        className={`${showLabels ? 'flex items-center space-x-2' : ''} text-gray-400 hover:text-yellow-500 transition-colors duration-300`}
        aria-label="Text Message"
      >
        <Smartphone size={20} />
        {showLabels && <span>Alternative</span>}
      </a>
    </div>
  );
};

export default SocialLinks;

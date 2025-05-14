
import { Facebook, Instagram, Twitter } from "lucide-react";

const SocialLinks = () => {
  return (
    <div className="flex space-x-4">
      <a 
        href="https://facebook.com" 
        target="_blank" 
        rel="noopener noreferrer" 
        className="text-gray-400 hover:text-gold transition-colors duration-300"
        aria-label="Facebook"
      >
        <Facebook size={20} />
      </a>
      <a 
        href="https://instagram.com" 
        target="_blank" 
        rel="noopener noreferrer" 
        className="text-gray-400 hover:text-gold transition-colors duration-300"
        aria-label="Instagram"
      >
        <Instagram size={20} />
      </a>
      <a 
        href="https://twitter.com" 
        target="_blank" 
        rel="noopener noreferrer" 
        className="text-gray-400 hover:text-gold transition-colors duration-300"
        aria-label="Twitter"
      >
        <Twitter size={20} />
      </a>
    </div>
  );
};

export default SocialLinks;

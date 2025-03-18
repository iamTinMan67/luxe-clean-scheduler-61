import { Mail, Phone, Facebook, Instagram, Twitter } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-black border-t border-gold/20 pt-16 pb-8 px-4 animate-fade-in">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div>
            <h3 className="text-xl font-bold text-white mb-4">Mid Cheshire Valeting</h3>
            <p className="text-gray-300 mb-4 max-w-md">
              Professional vehicle valeting service specializing in high-end vehicles profiles. 
              We also provide solutions for commercial fleets upon request.
            </p>
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
          </div>
          
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Services</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/services" className="text-gray-400 hover:text-gold transition-colors duration-300">
                  Basic Package
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-gray-400 hover:text-gold transition-colors duration-300">
                  Medium Package
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-gray-400 hover:text-gold transition-colors duration-300">
                  Premium Package
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-gray-400 hover:text-gold transition-colors duration-300">
                  Commercial Fleet Service
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-gold transition-colors duration-300">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-gray-400 hover:text-gold transition-colors duration-300">
                  Packages
                </Link>
              </li>
              <li>
                <Link to="/booking" className="text-gray-400 hover:text-gold transition-colors duration-300">
                  Book Now
                </Link>
              </li>
              <li>
                <Link to="/gallery" className="text-gray-400 hover:text-gold transition-colors duration-300">
                  Gallery
                </Link>
              </li>
              <li>
                <Link to="/progress" className="text-gray-400 hover:text-gold transition-colors duration-300">
                  Track Progress
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin className="mr-2 text-gold flex-shrink-0 mt-1" size={18} />
                <span className="text-gray-400">
                  14 Manor Square, Winsford, CW7 2YG
                </span>
              </li>
              <li className="flex items-center">
                <Phone className="mr-2 text-gold flex-shrink-0" size={18} />
                <a href="tel:+440123 456 789" className="text-gray-400 hover:text-gold transition-colors duration-300">
                  +44 0123 456 789
                </a>
              </li>
              <li className="flex items-center">
                <Mail className="mr-2 text-gold flex-shrink-0" size={18} />
                <a href="mailto:info@midcheshirevaleting.com" className="text-gray-400 hover:text-gold transition-colors duration-300">
                  info@midcheshirevaleting.com
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 pt-8 mt-8 text-center">
          <p className="text-gray-500">
            © {currentYear} Mid Cheshire Valeting. All rights reserved.
          </p>
          <div className="mt-2 flex justify-center space-x-4 text-sm">
            <Link to="/privacy" className="text-gray-500 hover:text-gold transition-colors duration-300">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-gray-500 hover:text-gold transition-colors duration-300">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

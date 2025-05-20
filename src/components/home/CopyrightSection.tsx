
import { Link } from "react-router-dom";

const CopyrightSection = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <div className="bg-black py-6 border-t border-gold/20">
      <div className="container mx-auto text-center">
        <p className="text-gray-500">
          © {currentYear} Mid Cheshire Valeting. Winsford. CW7 2YE. All rights reserved.
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
  );
};

export default CopyrightSection;

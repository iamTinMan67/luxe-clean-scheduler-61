
import { Link } from "react-router-dom";

const FooterCopyright = () => {
  const currentYear = new Date().getFullYear();
  
  return (
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
  );
};

export default FooterCopyright;

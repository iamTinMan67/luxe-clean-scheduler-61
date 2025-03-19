
import { Mail, Phone, MapPin } from "lucide-react";

const ContactInfo = () => {
  return (
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
  );
};

export default ContactInfo;

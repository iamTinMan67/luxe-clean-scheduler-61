
import { Mail, Phone, MapPin } from "lucide-react";

const ContactInfo = () => {
  return (
    <ul className="space-y-3">
      <li className="flex items-start">
        <Phone className="mr-2 text-gold flex-shrink-0" size={18} />
        <a href="tel:+447927208228" className="text-gray-400 hover:text-gold transition-colors duration-300">
          07927 208 228
        </a>
      </li>
      <li className="flex items-center">
        <Phone className="mr-2 text-gold flex-shrink-0" size={18} />
        <a href="tel:+447845574743" className="text-gray-400 hover:text-gold transition-colors duration-300">
          07845 574 743
        </a>
      </li>
      <li className="flex items-center">
        <Mail className="mr-2 text-gold flex-shrink-0" size={18} />
        <a href="mailto:midcheshiremobilevalet@gmail.com" className="text-gray-400 hover:text-gold transition-colors duration-300">
          midcheshiremobilevalet@gmail.com
        </a>
      </li>
    </ul>
  );
};

export default ContactInfo;

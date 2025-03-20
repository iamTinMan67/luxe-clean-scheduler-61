
import { Link } from "react-router-dom";

interface FooterLinksProps {
  links: Array<{
    to: string;
    label: string;
  }>;
}

const FooterLinks = ({ links }: FooterLinksProps) => {
  return (
    <ul className="space-y-2">
      {links.map((link, index) => (
        <li key={index}>
          <Link 
            to={link.to} 
            className="text-gray-400 hover:text-gold transition-colors duration-300"
          >
            {link.label}
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default FooterLinks;

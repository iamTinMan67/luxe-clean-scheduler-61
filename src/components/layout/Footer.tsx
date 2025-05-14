
import FooterSection from "./FooterSection";
import FooterLinks from "./FooterLinks";
import SocialLinks from "./SocialLinks";
import ContactInfo from "./ContactInfo";
import FooterCopyright from "./FooterCopyright";

const Footer = () => {
  const serviceLinks = [
    { to: "/services", label: "Main Package" },
    { to: "/services", label: "Elite Package" },
    { to: "/services", label: "Commercials" }
  ];
  
  return (

          
        <FooterSection title="Contact Us">
            <ContactInfo />
            <SocialLinks />
          </FooterSection>
        </div>
        
        <FooterCopyright />
      </div>
    </footer>
  );
};

export default Footer;

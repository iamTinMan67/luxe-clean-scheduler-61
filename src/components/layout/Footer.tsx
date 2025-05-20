
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
    <footer className="bg-black border-t border-gold/20 pt-16 pb-8 px-4 animate-fade-in">
      <div className="container mx-auto">
        <div className="flex flex-col items-center mb-12">
          <img 
            src="/lovable-uploads/20bcd8db-4042-4d14-9238-3fe36de9757f.png" 
            alt="Mid-Cheshire Mobile Valeting" 
            className="h-36 w-auto mb-8" 
          />
          
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

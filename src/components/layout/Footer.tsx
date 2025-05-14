
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          <div>
            <h3 className="text-xl font-bold text-white mb-4">Mid Cheshire Valeting</h3>
            <p className="text-gray-300 mb-4 max-w-md">
              Fully self-sufficiant and mobile, valeting and detailing service striving for excellence,
              every time. We can provide solutions for multiple bookings, block bookings and also commercial
              fleets upon request.
            </p>
          </div>
          
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

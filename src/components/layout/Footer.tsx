
import FooterSection from "./FooterSection";
import FooterLinks from "./FooterLinks";
import SocialLinks from "./SocialLinks";
import ContactInfo from "./ContactInfo";
import FooterCopyright from "./FooterCopyright";

const Footer = () => {
  const serviceLinks = [
    { to: "/services", label: "Main Package" },
    { to: "/services", label: "Elite Package" },
    { to: "/services", label: "Commercial Fleet Service" }
  ];
  
  // Remove Quick Links section
  
  return (
    <footer className="bg-black border-t border-gold/20 pt-16 pb-8 px-4 animate-fade-in">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          <div>
            <h3 className="text-xl font-bold text-white mb-4">Mid Cheshire Valeting</h3>
            <p className="text-gray-300 mb-4 max-w-md">
              Professional vehicle valeting service specializing in high-end vehicles profiles. 
              We also provide solutions for commercial fleets upon request.
            </p>
            <SocialLinks />
          </div>
          
          <FooterSection title="Services">
            <FooterLinks links={serviceLinks} />
          </FooterSection>
          
          <FooterSection title="Contact Us">
            <ContactInfo />
          </FooterSection>
        </div>
        
        <FooterCopyright />
      </div>
    </footer>
  );
};

export default Footer;

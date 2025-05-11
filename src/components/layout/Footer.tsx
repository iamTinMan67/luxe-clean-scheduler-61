
import FooterSection from "./FooterSection";
import SocialLinks from "./SocialLinks";
import FooterCopyright from "./FooterCopyright";

const Footer = () => {
  return (
    <footer className="bg-black border-t border-gold/20 pt-16 pb-8 px-4 animate-fade-in">
      <div className="container mx-auto">
        <div className="mb-12">
          <div>
            <h3 className="text-xl font-bold text-white mb-4">Mid Cheshire Valeting</h3>
            <p className="text-gray-300 mb-4 max-w-md">
              Professional valeting service striving for excellence, every time. 
              We provide solutions for multiple bookings, block bookings and also commercial fleets upon request.
            </p>
            <SocialLinks />
          </div>
        </div>
        
        <FooterCopyright />
      </div>
    </footer>
  );
};

export default Footer;

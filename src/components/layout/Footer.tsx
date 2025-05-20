
import FooterSection from "./FooterSection";
import FooterLinks from "./FooterLinks";
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
        <FooterCopyright />
      </div>
    </footer>
  );
};

export default Footer;

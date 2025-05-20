
import FooterCopyright from "./FooterCopyright";
import { useLocation } from "react-router-dom";

const Footer = () => {
  const location = useLocation();
  const isAdminDashboard = location.pathname === "/admin/dashboard";

  return (
    <footer className="bg-black border-t border-gold/20 pt-16 pb-8 px-4 animate-fade-in">
      <div className="container mx-auto">
        {/* Copyright Section */}
        <FooterCopyright />
      </div>
    </footer>
  );
};

export default Footer;

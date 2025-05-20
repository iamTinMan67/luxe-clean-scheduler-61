
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { useLocation } from "react-router-dom";

const Layout = () => {
  const location = useLocation();
  
  // Hide footer on all admin pages
  const isAdminPage = location.pathname.startsWith('/admin');

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      {(shouldShowFooter && !isAdminPage) && <Footer />}
    </div>
  );
};

export default Layout;

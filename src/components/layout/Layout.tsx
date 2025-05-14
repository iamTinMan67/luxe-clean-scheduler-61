
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { useLocation } from "react-router-dom";

const Layout = () => {
  const location = useLocation();
  
  // Check if current path is an admin page that should not have a footer
  const isAdminPageWithoutFooter = [
    '/admin/staff-planner', 
    '/admin/planner', 
    '/admin/manage-packages',
    '/admin/invoices',
    '/admin/gallery',
    '/admin/todo',
    '/admin/van-inventory',
    '/admin/warehouse-inventory'
  ].some(path => location.pathname.startsWith(path));

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      {!isAdminPageWithoutFooter && <Footer />}
    </div>
  );
};

export default Layout;

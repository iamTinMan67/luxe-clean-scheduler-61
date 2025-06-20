
import NavLink from "./NavLink";
import UserMenu from "./UserMenu";
import { useAuth } from "@/context/AuthContext";

const DesktopMenu = () => {
  const { isAdmin, isStaff } = useAuth();

  return (
    <nav className="hidden md:flex items-center space-x-1">
      <NavLink to="/">Home</NavLink>
      <NavLink to="/gallery">Gallery</NavLink>
      
      {(isAdmin || isStaff) && (
        <>
          <NavLink to="/admin/dashboard">Dashboard</NavLink>
          <NavLink to="/admin/analytics">Analytics</NavLink>
          <NavLink to="/admin/planner-calendar">Planner</NavLink>
          <NavLink to="/admin/pre-inspection">Pre-Inspection</NavLink>
          <NavLink to="/admin/todo-list">To-do List</NavLink>
          <NavLink to="/admin/invoices">Invoices</NavLink>
          <NavLink to="/admin/history">History</NavLink>
          <NavLink to="/admin/manage-packages">Packages</NavLink>
          <NavLink to="/admin/gallery-manager">Gallery Mgr</NavLink>
          <NavLink to="/admin/feedback-manager">Feedback</NavLink>
          <NavLink to="/admin/van-inventory">Van Inventory</NavLink>
          <NavLink to="/admin/warehouse-inventory">Warehouse</NavLink>
        </>
      )}
      
      <UserMenu />
    </nav>
  );
};

export default DesktopMenu;

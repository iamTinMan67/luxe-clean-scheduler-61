
import { ReactNode } from "react";
import { motion } from "framer-motion";

interface AdminPageTitleProps {
  title: string;
  subtitle?: string;
  children?: ReactNode;
}

const AdminPageTitle = ({ title, subtitle, children }: AdminPageTitleProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-8 text-center"
    >
      <h1 className="text-3xl font-bold text-white">
        {title} {title.includes("Dashboard") ? null : <span className="text-gold">Dashboard</span>}
      </h1>
      {subtitle && <p className="text-gray-400">{subtitle}</p>}
      {children}
    </motion.div>
  );
};

export default AdminPageTitle;

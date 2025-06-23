
import { motion } from "framer-motion";
import WelcomeHeader from "./splash/WelcomeHeader";
import CategorySection from "./splash/CategorySection";
import QuickStatsFooter from "./splash/QuickStatsFooter";
import PendingNotificationsView from "./splash/PendingNotificationsView";
import ManualDataMigration from "./ManualDataMigration";
import { categoryConfig } from "./splash/categoryConfig";

const AdminSplashScreen = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto py-8 px-4 space-y-8"
    >
      <WelcomeHeader />
      
      {/* Data Migration Section */}
      <ManualDataMigration />
      
      <PendingNotificationsView />
      
      <div className="grid gap-8">
        {categoryConfig.map((category, index) => (
          <CategorySection 
            key={category.id} 
            category={category} 
            index={index}
          />
        ))}
      </div>
      
      <QuickStatsFooter />
    </motion.div>
  );
};

export default AdminSplashScreen;

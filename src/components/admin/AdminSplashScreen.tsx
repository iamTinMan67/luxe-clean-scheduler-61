
import { motion } from "framer-motion";
import WelcomeHeader from "./splash/WelcomeHeader";
import CategorySection from "./splash/CategorySection";
import QuickStatsFooter from "./splash/QuickStatsFooter";
import PendingNotificationsView from "./splash/PendingNotificationsView";
import { categoryConfig } from "./splash/categoryConfig";
import { adminFunctions } from "./splash/adminFunctionsData";

const AdminSplashScreen = () => {
  // Group functions by category
  const categorizedFunctions = Object.entries(categoryConfig).map(([categoryKey, config], index) => {
    const functions = adminFunctions.filter(func => func.category === categoryKey);
    return {
      category: categoryKey,
      functions,
      config,
      categoryIndex: index
    };
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto py-8 px-4 space-y-8"
    >
      <WelcomeHeader />
      
      <PendingNotificationsView />
      
      <div className="grid gap-8">
        {categorizedFunctions.map(({ category, functions, config, categoryIndex }) => (
          <CategorySection 
            key={category} 
            category={category}
            functions={functions}
            config={config}
            categoryIndex={categoryIndex}
          />
        ))}
      </div>
      
      <QuickStatsFooter />
    </motion.div>
  );
};

export default AdminSplashScreen;

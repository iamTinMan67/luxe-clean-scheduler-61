
import { AdminFunction } from "./splash/types";
import { adminFunctions } from "./splash/adminFunctionsData";
import { categoryConfig } from "./splash/categoryConfig";
import WelcomeHeader from "./splash/WelcomeHeader";
import CategorySection from "./splash/CategorySection";
import QuickStatsFooter from "./splash/QuickStatsFooter";
import PendingNotificationsView from "./splash/PendingNotificationsView";

const AdminSplashScreen = () => {
  const groupedFunctions = adminFunctions.reduce((acc, func) => {
    if (!acc[func.category]) {
      acc[func.category] = [];
    }
    acc[func.category].push(func);
    return acc;
  }, {} as Record<string, AdminFunction[]>);

  return (
    <div className="space-y-8">
      <WelcomeHeader />

      {/* Featured Pending Notifications Section */}
      <PendingNotificationsView />

      {Object.entries(groupedFunctions).map(([category, functions], categoryIndex) => {
        const config = categoryConfig[category as keyof typeof categoryConfig];
        
        // Skip the notifications category since we're showing it as featured above
        if (category === 'notifications') {
          return null;
        }
        
        return (
          <CategorySection
            key={category}
            category={category}
            functions={functions}
            config={config}
            categoryIndex={categoryIndex}
          />
        );
      })}

      <QuickStatsFooter />
    </div>
  );
};

export default AdminSplashScreen;

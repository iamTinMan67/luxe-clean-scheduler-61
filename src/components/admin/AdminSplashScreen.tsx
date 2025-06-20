import { AdminFunction } from "./splash/types";
import { adminFunctions } from "./splash/adminFunctionsData";
import { categoryConfig } from "./splash/categoryConfig";
import WelcomeHeader from "./splash/WelcomeHeader";
import CategorySection from "./splash/CategorySection";
import QuickStatsFooter from "./splash/QuickStatsFooter";
import PendingNotificationsSummary from "./splash/PendingNotificationsSummary";

const AdminSplashScreen = () => {
  // Filter out notification items since we'll show them as a summary
  const filteredFunctions = adminFunctions.filter(func => func.category !== 'notifications');
  
  const groupedFunctions = filteredFunctions.reduce((acc, func) => {
    if (!acc[func.category]) {
      acc[func.category] = [];
    }
    acc[func.category].push(func);
    return acc;
  }, {} as Record<string, AdminFunction[]>);

  return (
    <div className="space-y-8">
      <WelcomeHeader />

      {/* Featured Pending Notifications Summary */}
      <PendingNotificationsSummary />

      {/* Other Categories */}
      {Object.entries(groupedFunctions).map(([category, functions], categoryIndex) => {
        const config = categoryConfig[category as keyof typeof categoryConfig];
        
        return (
          <CategorySection
            key={category}
            category={category}
            functions={functions}
            config={config}
            categoryIndex={categoryIndex + 1} // +1 to account for notifications summary
          />
        );
      })}

      <QuickStatsFooter />
    </div>
  );
};

export default AdminSplashScreen;

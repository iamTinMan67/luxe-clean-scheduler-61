
import HeroSection from "@/components/home/HeroSection";
import FeaturesSection from "@/components/home/FeaturesSection";
import FeedbackSection from "@/components/home/FeedbackSection";
import CTASection from "@/components/home/CTASection";
import DataMigrationTrigger from "@/components/DataMigrationTrigger";
import { useEffect, useState } from "react";

export default function Index() {
  const [showMigration, setShowMigration] = useState(false);
  
  useEffect(() => {
    // Check if we should show the migration button
    // Only show if data hasn't been migrated yet
    const isMigrated = localStorage.getItem("dataMigrationComplete") === "true";
    const hasData = localStorage.getItem("pendingBookings") || 
                   localStorage.getItem("confirmedBookings") ||
                   localStorage.getItem("warehouseInventory") ||
                   localStorage.getItem("galleryItems");
                   
    setShowMigration((!isMigrated && hasData) ? true : false);
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <HeroSection />
      
      {/* Migration Component - Only show if needed */}
      {showMigration && <DataMigrationTrigger />}
      
      {/* Features Section */}
      <FeaturesSection />
      
      {/* Call to Action Section */}
      <CTASection />
      
      {/* Customer Feedback Section - Now shows 6 items */}
      <FeedbackSection />
    </div>
  );
}

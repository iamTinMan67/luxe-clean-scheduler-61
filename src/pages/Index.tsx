import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import CTASection from "@/components/CTASection";
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
                   
    setShowMigration(!isMigrated && hasData);
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <HeroSection />
      
      {/* Migration Component - Only show if needed */}
      {showMigration && <DataMigrationTrigger />}
      
      {/* Features Section */}
      <FeaturesSection />
      
      {/* Testimonials Section */}
      <TestimonialsSection />
      
      {/* Call to Action Section */}
      <CTASection />
    </div>
  );
}

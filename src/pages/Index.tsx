
import HeroSection from "@/components/home/HeroSection";
import FeaturesSection from "@/components/home/FeaturesSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import CTASection from "@/components/home/CTASection";
import DataMigrationTrigger from "@/components/DataMigrationTrigger";
import ConnectWithUs from "@/components/shared/ConnectWithUs";
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
      
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {/* Features Section */}
            <FeaturesSection />
            
            {/* Testimonials Section */}
            <TestimonialsSection />
          </div>
          
          {/* Connect With Us - Right Side */}
          <div className="lg:col-span-1 mt-6 lg:mt-0">
            <ConnectWithUs />
          </div>
        </div>
      </div>
      
      {/* Call to Action Section */}
      <CTASection />
    </div>
  );
}


import HeroSection from "@/components/home/HeroSection";
import FeaturesSection from "@/components/home/FeaturesSection";
import FeedbackSection from "@/components/home/FeedbackSection";
import CTASection from "@/components/home/CTASection";
import CopyrightSection from "@/components/home/CopyrightSection";

export default function Index() {
  return (
    <div className="relative">
      {/* Hero Section */}
      <HeroSection />
      
      {/* Call to Action Section */}
      <CTASection />

      {/* Features Section */}
      <FeaturesSection />
      
      {/* Customer Feedback Section - Now shows 6 items */}
      <FeedbackSection />
      
      {/* Copyright Section - Only on home page */}
      <CopyrightSection />
    </div>
  );
}


import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import BrochurePreview from "@/components/brochure/BrochurePreview";
import { packageOptions } from "@/data/packageOptions";

const BrochurePage = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container mx-auto py-12 px-4"
    >
      <div className="flex items-center mb-8">
        <Link 
          to="/admin/management" 
          className="flex items-center space-x-2 text-yellow-400 hover:text-yellow-300 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Management</span>
        </Link>
      </div>

      <h1 className="text-3xl font-bold text-white mb-6 text-center">Service Brochure</h1>
      
      <Card className="bg-black/60 border-gold/30">
        <CardHeader>
          <CardTitle className="text-white">Service Information</CardTitle>
        </CardHeader>
        <CardContent>
          <BrochurePreview packages={packageOptions} />
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default BrochurePage;

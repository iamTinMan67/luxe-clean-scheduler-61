
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import StaffList from './StaffList';
import { motion } from "framer-motion";

const StaffAllocationList: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.4, delay: 0.2 }}
    >
      <Card className="bg-black/60 border-gold/30">
        <CardHeader>
          <CardTitle className="text-white">Staff Allocation</CardTitle>
          <CardDescription className="text-gold/70">
            Manage and assign your team members
          </CardDescription>
        </CardHeader>
        <CardContent>
          <StaffList />
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default StaffAllocationList;

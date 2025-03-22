
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const StaffList = () => {
  return (
    <Card className="lg:col-span-1 bg-black/60 border-gold/30">
      <CardHeader>
        <CardTitle className="text-white">Staff Members</CardTitle>
        <CardDescription className="text-gold/70">
          Select staff for scheduling
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {["John Smith", "Sarah Johnson", "Michael Brown", "Emma Wilson", "David Lee"].map((staff) => (
            <div key={staff} className="flex items-center space-x-2 p-2 hover:bg-white/5 rounded">
              <input type="checkbox" id={staff} className="rounded text-gold" />
              <label htmlFor={staff} className="text-white cursor-pointer">{staff}</label>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default StaffList;

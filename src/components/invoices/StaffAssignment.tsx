
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface StaffAssignmentProps {
  selectedStaff: string | undefined;
  setSelectedStaff: (staff: string | undefined) => void;
}

const StaffAssignment: React.FC<StaffAssignmentProps> = ({ selectedStaff, setSelectedStaff }) => {
  return (
    <Card className="bg-black/60 border-gold/30">
      <CardHeader>
        <CardTitle className="text-white">Staff Assignment</CardTitle>
      </CardHeader>
      <CardContent>
        <Select 
          value={selectedStaff} 
          onValueChange={(value) => setSelectedStaff(value === "" ? undefined : value)}
        >
          <SelectTrigger className="bg-black/40 border-gold/30 text-white">
            <SelectValue placeholder="Filter by staff member" />
          </SelectTrigger>
          <SelectContent className="bg-black border-gold/30">
            <SelectItem value="">All Staff</SelectItem>
            <SelectItem value="David Lee">David Lee</SelectItem>
            <SelectItem value="Sarah Johnson">Sarah Johnson</SelectItem>
            <SelectItem value="Michael Brown">Michael Brown</SelectItem>
            <SelectItem value="Emma Wilson">Emma Wilson</SelectItem>
          </SelectContent>
        </Select>
      </CardContent>
    </Card>
  );
};

export default StaffAssignment;

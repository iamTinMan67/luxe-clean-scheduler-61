
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { Booking } from '@/types/booking';

interface EditPackageDialogProps {
  booking: Booking;
  onPackageChange: (booking: Booking, newPackage: string) => void;
}

const EditPackageDialog: React.FC<EditPackageDialogProps> = ({ booking, onPackageChange }) => {
  const [newPackageType, setNewPackageType] = useState<string>(booking.packageType);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button 
          size="sm" 
          variant="outline"
          className="h-8 px-2 text-xs"
        >
          <Pencil className="h-3 w-3 mr-1" /> Package
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-gray-950 border-gray-800">
        <DialogHeader>
          <DialogTitle className="text-white">Change Package</DialogTitle>
          <DialogDescription className="text-gray-400">
            Update the service package for {booking.customer}
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <Select value={newPackageType} onValueChange={setNewPackageType}>
            <SelectTrigger className="w-full bg-black border-gray-800">
              <SelectValue placeholder="Select package" />
            </SelectTrigger>
            <SelectContent className="bg-gray-950 border-gray-800">
              <SelectItem value="basic">Basic Package</SelectItem>
              <SelectItem value="medium">Medium Package</SelectItem>
              <SelectItem value="elite">Elite Package</SelectItem>
              <SelectItem value="platinum">Platinum Package</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <DialogFooter>
          <Button 
            variant="outline" 
            className="bg-gray-800 hover:bg-gray-700"
          >
            Cancel
          </Button>
          <Button 
            className="bg-gold hover:bg-gold/80 text-black"
            onClick={() => onPackageChange(booking, newPackageType)}
          >
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditPackageDialog;

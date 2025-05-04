
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { Booking } from '@/types/booking';

interface DeleteBookingDialogProps {
  booking: Booking;
  onDelete: (booking: Booking) => void;
}

const DeleteBookingDialog: React.FC<DeleteBookingDialogProps> = ({ booking, onDelete }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button 
          size="sm" 
          variant="destructive"
          className="h-8 px-2 text-xs"
        >
          <Trash2 className="h-3 w-3 mr-1" /> Delete
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-gray-950 border-gray-800">
        <DialogHeader>
          <DialogTitle className="text-white">Confirm Deletion</DialogTitle>
          <DialogDescription className="text-gray-400">
            Are you sure you want to delete this booking? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button 
            variant="outline" 
            className="bg-gray-800 hover:bg-gray-700"
          >
            Cancel
          </Button>
          <Button 
            variant="destructive"
            onClick={() => onDelete(booking)}
          >
            Delete Booking
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteBookingDialog;

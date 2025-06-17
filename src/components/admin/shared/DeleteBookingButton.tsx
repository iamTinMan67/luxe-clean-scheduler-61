
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Booking } from "@/types/booking";
import { useBookingMutations } from "@/hooks/bookings/useBookingMutations";
import { toast } from "sonner";

interface DeleteBookingButtonProps {
  booking: Booking;
  onDeleteSuccess?: () => void;
}

const DeleteBookingButton = ({ booking, onDeleteSuccess }: DeleteBookingButtonProps) => {
  const { deleteBooking } = useBookingMutations();

  const handleDelete = async () => {
    try {
      await deleteBooking(booking);
      toast.success(`Booking for ${booking.customer} has been deleted`);
      if (onDeleteSuccess) {
        onDeleteSuccess();
      }
    } catch (error) {
      console.error('Error deleting booking:', error);
      toast.error('Failed to delete booking');
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="absolute bottom-2 right-2 h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-950/20"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="bg-gray-900 border-red-500/30">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-red-400">Delete Booking</AlertDialogTitle>
          <AlertDialogDescription className="text-gray-300">
            Are you sure you want to delete the booking for <strong>{booking.customer}</strong>?
            <br />
            <span className="text-sm text-gray-400 mt-2 block">
              Service: {booking.packageType} | Date: {booking.date instanceof Date ? booking.date.toLocaleDateString() : booking.date}
            </span>
            <br />
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="bg-gray-700 text-white hover:bg-gray-600">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            className="bg-red-600 text-white hover:bg-red-700"
          >
            Delete Booking
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteBookingButton;

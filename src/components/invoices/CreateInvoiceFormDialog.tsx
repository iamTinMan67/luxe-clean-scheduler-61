
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import CreateInvoiceForm from "./CreateInvoiceForm";

interface CreateInvoiceFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onInvoiceCreated: () => void;
}

const CreateInvoiceFormDialog = ({ open, onOpenChange, onInvoiceCreated }: CreateInvoiceFormDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gray-900 border-gray-800 max-w-4xl">
        <DialogHeader>
          <DialogTitle className="text-white">Create New Invoice</DialogTitle>
        </DialogHeader>
        <CreateInvoiceForm onInvoiceCreated={onInvoiceCreated} />
      </DialogContent>
    </Dialog>
  );
};

export default CreateInvoiceFormDialog;


import CreateInvoiceForm from "./CreateInvoiceForm";

interface CreateInvoiceFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onInvoiceCreated: () => void;
}

const CreateInvoiceFormDialog = ({ open, onOpenChange, onInvoiceCreated }: CreateInvoiceFormDialogProps) => {
  return (
    <CreateInvoiceForm 
      open={open}
      onOpenChange={onOpenChange}
      onInvoiceCreated={onInvoiceCreated}
    />
  );
};

export default CreateInvoiceFormDialog;

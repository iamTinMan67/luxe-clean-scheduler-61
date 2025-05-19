
import React from 'react';
import { DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface DialogActionsProps {
  onCancel: () => void;
  onConfirm: () => void;
  isConfirmDisabled: boolean;
}

const DialogActions: React.FC<DialogActionsProps> = ({ 
  onCancel, 
  onConfirm, 
  isConfirmDisabled 
}) => {
  return (
    <DialogFooter>
      <Button onClick={onCancel} variant="outline" className="border-gold/30 text-white hover:bg-gold/10">
        Cancel
      </Button>
      <Button 
        onClick={onConfirm} 
        className="gold-gradient text-black"
        disabled={isConfirmDisabled}
      >
        Confirm Assignment
      </Button>
    </DialogFooter>
  );
};

export default DialogActions;

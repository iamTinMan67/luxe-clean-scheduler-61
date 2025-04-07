
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useEffect } from "react";

type Van = {
  id: string;
  registration: string;
  name: string;
};

// Form schema for van
const vanSchema = z.object({
  registration: z.string().min(1, "Registration is required"),
  name: z.string().min(1, "Name is required"),
});

interface VanFormDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (values: z.infer<typeof vanSchema>) => void;
  editVan: Van | null;
}

const VanFormDialog = ({
  isOpen,
  onOpenChange,
  onSave,
  editVan
}: VanFormDialogProps) => {
  const form = useForm<z.infer<typeof vanSchema>>({
    resolver: zodResolver(vanSchema),
    defaultValues: {
      registration: "",
      name: "",
    },
  });

  // Reset form when edit van changes
  useEffect(() => {
    if (editVan) {
      form.reset({
        registration: editVan.registration,
        name: editVan.name,
      });
    } else {
      form.reset({
        registration: "",
        name: "",
      });
    }
  }, [editVan, form]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="bg-black/90 border-gold/30 text-white">
        <DialogHeader>
          <DialogTitle>{editVan ? "Edit Van" : "Add New Van"}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSave)} className="space-y-4">
            <FormField
              control={form.control}
              name="registration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Registration Number</FormLabel>
                  <FormControl>
                    <Input className="bg-black/40 border-gold/30 text-white" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Van Name</FormLabel>
                  <FormControl>
                    <Input className="bg-black/40 border-gold/30 text-white" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                className="border-gold/30 text-white hover:bg-gold/20"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" className="gold-gradient text-black hover:shadow-gold/20 hover:shadow-lg">
                {editVan ? "Update Van" : "Add Van"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default VanFormDialog;

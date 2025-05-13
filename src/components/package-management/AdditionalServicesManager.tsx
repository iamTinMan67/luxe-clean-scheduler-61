
import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Edit, Trash2, Clock } from "lucide-react";
import { AdditionalService } from "@/lib/types";
import { AdditionalServiceDialog } from "./AdditionalServiceDialog";
import DeleteConfirmationDialog from "./DeleteConfirmationDialog";

interface AdditionalServicesManagerProps {
  services: AdditionalService[];
  selectedService: AdditionalService | null;
  onSelectService: (service: AdditionalService) => void;
  onSaveService: (service: AdditionalService) => void;
  onDeleteService: (serviceId: string) => void;
  onUpdateServiceDuration: (serviceId: string, duration: number) => void;
}

const AdditionalServicesManager = ({
  services,
  selectedService,
  onSelectService,
  onSaveService,
  onDeleteService,
  onUpdateServiceDuration
}: AdditionalServicesManagerProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [serviceToEdit, setServiceToEdit] = useState<AdditionalService | null>(null);
  const [serviceToDelete, setServiceToDelete] = useState<string | null>(null);
  const [editingDuration, setEditingDuration] = useState<{id: string, value: number} | null>(null);

  const handleAddService = () => {
    setServiceToEdit(null);
    setIsDialogOpen(true);
  };

  const handleEditService = (service: AdditionalService) => {
    setServiceToEdit(service);
    setIsDialogOpen(true);
  };

  const handleDeleteService = (serviceId: string) => {
    setServiceToDelete(serviceId);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteService = () => {
    if (serviceToDelete) {
      onDeleteService(serviceToDelete);
      setIsDeleteDialogOpen(false);
      setServiceToDelete(null);
    }
  };

  const handleEditDuration = (service: AdditionalService) => {
    setEditingDuration({
      id: service.id,
      value: service.duration || 0
    });
  };

  const handleSaveDuration = () => {
    if (editingDuration) {
      onUpdateServiceDuration(editingDuration.id, editingDuration.value);
      setEditingDuration(null);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-white">Services List</h3>
        <Button 
          onClick={handleAddService}
          className="gold-gradient text-black hover:shadow-gold/20"
        >
          <Plus size={16} className="mr-1" /> Add Service
        </Button>
      </div>

      <div className="rounded-md border border-gold/30 bg-black/50">
        <Table>
          <TableHeader>
            <TableRow className="border-gold/20">
              <TableHead className="text-gold">Name</TableHead>
              <TableHead className="text-gold text-right">Price (£)</TableHead>
              <TableHead className="text-gold text-right">Duration (min)</TableHead>
              <TableHead className="text-gold text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {services.map((service) => (
              <TableRow key={service.id} className="border-gold/20 hover:bg-gold/5">
                <TableCell className="text-white">{service.name}</TableCell>
                <TableCell className="text-right text-white">£{service.price}</TableCell>
                <TableCell className="text-right">
                  {editingDuration && editingDuration.id === service.id ? (
                    <div className="flex items-center justify-end space-x-2">
                      <Input 
                        type="number" 
                        value={editingDuration.value} 
                        onChange={(e) => setEditingDuration({
                          ...editingDuration,
                          value: parseInt(e.target.value) || 0
                        })}
                        className="w-20 text-right bg-black/30 border-gold/30 text-white"
                      />
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="h-7 border-gold/30 text-white hover:bg-gold/20"
                        onClick={handleSaveDuration}
                      >
                        Save
                      </Button>
                    </div>
                  ) : (
                    <div 
                      className="flex items-center justify-end space-x-2 cursor-pointer group" 
                      onClick={() => handleEditDuration(service)}
                    >
                      <span className="text-white">{service.duration || 0}</span>
                      <Clock size={14} className="text-gold/50 group-hover:text-gold transition-colors" />
                    </div>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-1">
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      className="h-8 w-8 text-white hover:text-gold hover:bg-gold/10"
                      onClick={() => handleEditService(service)}
                    >
                      <Edit size={14} />
                    </Button>
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      className="h-8 w-8 text-white hover:text-red-500 hover:bg-red-500/10"
                      onClick={() => handleDeleteService(service.id)}
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <AdditionalServiceDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSave={onSaveService}
        service={serviceToEdit}
        isEditing={!!serviceToEdit}
      />

      <DeleteConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={confirmDeleteService}
        title="Delete Service"
        description="Are you sure you want to delete this service? This action cannot be undone."
      />
    </div>
  );
};

export default AdditionalServicesManager;

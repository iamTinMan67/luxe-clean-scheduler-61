
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { additionalServices } from "@/data/servicePackageData";
import AdditionalServicesManager from "@/components/package-management/AdditionalServicesManager";
import { useAdditionalServicesManager } from "@/hooks/useAdditionalServicesManager";
import AdminPageTitle from "@/components/admin/AdminPageTitle";

const ManageAdditionalServices = () => {
  const {
    services,
    selectedService,
    handleSelectService,
    handleSaveService,
    handleDeleteService,
    handleUpdateServiceDuration
  } = useAdditionalServicesManager(additionalServices);

  return (
    <div className="container py-20 px-4 mx-auto max-w-7xl">
      <AdminPageTitle 
        title="Manage Additional Services" 
        subtitle="Update additional services, set prices, and manage durations" 
      />
      
      <div className="grid grid-cols-1 gap-6 mt-6">
        <Card className="bg-black/60 border-gold/30">
          <CardHeader>
            <CardTitle className="text-white">Additional Services</CardTitle>
            <CardDescription className="text-gold/70">
              Manage your additional services pricing and durations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AdditionalServicesManager 
              services={services}
              selectedService={selectedService}
              onSelectService={handleSelectService}
              onSaveService={handleSaveService}
              onDeleteService={handleDeleteService}
              onUpdateServiceDuration={handleUpdateServiceDuration}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ManageAdditionalServices;

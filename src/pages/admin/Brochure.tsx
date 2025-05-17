
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { packageOptions } from "@/data/servicePackageData";
import BrochurePreview from "@/components/brochure/BrochurePreview";
import AdminPageTitle from "@/components/admin/AdminPageTitle";

const Brochure = () => {
  return (
    <div className="container py-20 px-4 mx-auto max-w-7xl">
      <AdminPageTitle 
        title="Service Brochure" 
        subtitle="Preview and print an A5 brochure of our services" 
      />
      
      <Card className="bg-black/60 border-gold/30">
        <CardHeader>
          <CardTitle className="text-white">Brochure Generator</CardTitle>
          <CardDescription className="text-gold/70">
            This brochure is formatted for A5 paper size and includes all service packages
          </CardDescription>
        </CardHeader>
        <CardContent>
          <BrochurePreview packages={packageOptions} />
        </CardContent>
      </Card>
    </div>
  );
};

export default Brochure;

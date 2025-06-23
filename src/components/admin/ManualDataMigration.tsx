
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { migrateAllData } from "@/utils/migrationUtils";
import { toast } from "sonner";
import { DatabaseBackup, CheckCircle, X } from "lucide-react";

export default function ManualDataMigration() {
  const [isMigrating, setIsMigrating] = useState(false);
  const [migrationComplete, setMigrationComplete] = useState(
    localStorage.getItem("dataMigrationComplete") === "true"
  );
  const [isHidden, setIsHidden] = useState(false);
  
  const handleMigrate = async () => {
    try {
      setIsMigrating(true);
      await migrateAllData();
      toast.success("Data successfully migrated to Supabase");
      setMigrationComplete(true);
      localStorage.setItem("dataMigrationComplete", "true");
    } catch (error) {
      console.error("Migration error:", error);
      toast.error("Failed to migrate data. Please try again.");
    } finally {
      setIsMigrating(false);
    }
  };

  const handleHide = () => {
    setIsHidden(true);
  };

  // Don't render if hidden or if migration is complete and user dismissed it
  if (isHidden) {
    return null;
  }

  return (
    <Card className="relative">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <DatabaseBackup className="w-5 h-5" />
            <CardTitle>Data Migration</CardTitle>
          </div>
          {migrationComplete && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleHide}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
        <CardDescription>
          Migrate your local data to the secure database for better reliability and performance
        </CardDescription>
      </CardHeader>
      <CardContent>
        {migrationComplete ? (
          <div className="flex items-center gap-2 text-green-600">
            <CheckCircle className="w-5 h-5" />
            <span>Data migration completed successfully</span>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              This will transfer your bookings, inventory, gallery items, and other data 
              from local storage to the database.
            </p>
            <Button 
              onClick={handleMigrate}
              disabled={isMigrating}
              className="w-full"
            >
              <DatabaseBackup className="w-4 h-4 mr-2" />
              {isMigrating ? "Migrating..." : "Start Migration"}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

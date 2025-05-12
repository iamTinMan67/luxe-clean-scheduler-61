
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { migrateAllData, checkMigrationStatus } from "@/utils/migrationUtils";
import { toast } from "sonner";
import { DatabaseBackup } from "lucide-react";

export default function DataMigrationTrigger() {
  const [isMigrating, setIsMigrating] = useState(false);
  
  const handleMigrate = async () => {
    try {
      setIsMigrating(true);
      await migrateAllData();
      toast.success("Data successfully migrated to Supabase");
      // Mark migration as complete in localStorage
      localStorage.setItem("dataMigrationComplete", "true");
    } catch (error) {
      console.error("Migration error:", error);
      toast.error("Failed to migrate data. Please try again.");
    } finally {
      setIsMigrating(false);
    }
  };

  return (
    <div className="flex flex-col items-center mt-6 mb-10">
      <Button 
        onClick={handleMigrate}
        disabled={isMigrating}
        className="gold-gradient text-black flex items-center gap-2"
      >
        <DatabaseBackup size={18} />
        {isMigrating ? "Migrating..." : "Migrate Data to Database"}
      </Button>
      <p className="text-sm text-gold/70 mt-2">
        Transfer your local data to our secure database for better reliability
      </p>
    </div>
  );
}

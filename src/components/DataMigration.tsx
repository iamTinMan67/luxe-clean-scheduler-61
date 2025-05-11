
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { migrateAllData, checkMigrationStatus } from "@/utils/migrationUtils";
import { DatabaseBackup, CheckCircle, AlertCircle } from "lucide-react";

export default function DataMigration() {
  const [open, setOpen] = useState(false);
  const [migrationStarted, setMigrationStarted] = useState(false);
  const [migrationComplete, setMigrationComplete] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    // Check if migration has already been completed
    const checkMigration = async () => {
      const localMigrationDone = localStorage.getItem("dataMigrationComplete") === "true";
      const dbMigrationDone = await checkMigrationStatus();
      
      if (!localMigrationDone && !dbMigrationDone) {
        setOpen(true);
      }
    };
    
    checkMigration();
  }, []);
  
  useEffect(() => {
    if (migrationStarted && !migrationComplete) {
      let progressInterval: NodeJS.Timeout;
      
      const startMigration = async () => {
        try {
          // Simulate progress updates (actual migration happens in migrateAllData)
          progressInterval = setInterval(() => {
            setProgress(prev => {
              if (prev >= 90) {
                clearInterval(progressInterval);
                return prev;
              }
              return prev + 10;
            });
          }, 500);
          
          // Actual migration
          await migrateAllData();
          
          // Complete progress and set migration as done
          clearInterval(progressInterval);
          setProgress(100);
          setMigrationComplete(true);
        } catch (err) {
          clearInterval(progressInterval);
          setError("Migration failed. Please try again.");
          console.error("Migration error:", err);
        }
      };
      
      startMigration();
      
      return () => {
        if (progressInterval) clearInterval(progressInterval);
      };
    }
  }, [migrationStarted, migrationComplete]);
  
  const handleStartMigration = () => {
    setMigrationStarted(true);
  };
  
  const handleClose = () => {
    if (migrationComplete || error) {
      setOpen(false);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px] text-center">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center justify-center gap-2">
            {!migrationStarted && <DatabaseBackup className="text-gold h-6 w-6" />}
            {migrationStarted && migrationComplete && <CheckCircle className="text-green-500 h-6 w-6" />}
            {migrationStarted && error && <AlertCircle className="text-red-500 h-6 w-6" />}
            {migrationStarted && !migrationComplete && !error && <DatabaseBackup className="text-gold h-6 w-6 animate-pulse" />}
            Data Migration
          </CardTitle>
          <CardDescription>
            {!migrationStarted && "Migrate your data from local storage to the database for better reliability and access across devices."}
            {migrationStarted && !migrationComplete && !error && "Migrating your data. Please don't close this window."}
            {migrationStarted && migrationComplete && "Migration completed successfully!"}
            {error && "Migration encountered an error."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {migrationStarted && (
            <div className="space-y-2">
              <Progress value={progress} className="h-2" />
              <p className="text-sm text-gray-500">{progress}% complete</p>
            </div>
          )}
          
          {error && (
            <div className="mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-md text-sm text-red-500">
              {error}
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-center">
          {!migrationStarted && (
            <Button onClick={handleStartMigration} className="gold-gradient text-black">
              Start Migration
            </Button>
          )}
          
          {(migrationComplete || error) && (
            <Button onClick={handleClose} className={error ? "bg-red-600" : "bg-green-600"}>
              {error ? "Try Later" : "Continue"}
            </Button>
          )}
        </CardFooter>
      </DialogContent>
    </Dialog>
  );
}

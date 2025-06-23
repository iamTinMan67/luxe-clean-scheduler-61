
import { supabase } from "@/integrations/supabase/client";
import { migrateAllData } from "@/utils/migrationUtils";
import { syncLocalStorageToSupabase } from "@/utils/dataSyncUtils";
import { toast } from "sonner";

class DataSyncService {
  private static instance: DataSyncService;
  private syncInterval: NodeJS.Timeout | null = null;
  private isSyncing = false;

  static getInstance(): DataSyncService {
    if (!DataSyncService.instance) {
      DataSyncService.instance = new DataSyncService();
    }
    return DataSyncService.instance;
  }

  // Check if initial migration is needed
  async checkAndPerformInitialMigration(): Promise<void> {
    try {
      const migrationComplete = localStorage.getItem('dataMigrationComplete') === 'true';
      
      if (!migrationComplete) {
        console.log('Initial migration needed - checking for data...');
        
        // Check if we have data in localStorage that needs migrating
        const hasLocalData = this.hasLocalStorageData();
        
        if (hasLocalData) {
          console.log('Local data found - starting migration...');
          await migrateAllData();
          console.log('Initial migration completed');
        } else {
          // No local data to migrate, mark as complete
          localStorage.setItem('dataMigrationComplete', 'true');
          console.log('No local data to migrate');
        }
      } else {
        console.log('Migration already completed');
      }
    } catch (error) {
      console.error('Error during initial migration check:', error);
    }
  }

  // Check if there's data in localStorage that needs migrating
  private hasLocalStorageData(): boolean {
    const keysToCheck = [
      'confirmedBookings',
      'pendingBookings',
      'plannerCalendarBookings',
      'warehouseInventory',
      'galleryItems',
      'testimonials',
      'customerFeedback',
      'serviceProgress',
      'vanInventory'
    ];

    return keysToCheck.some(key => {
      const data = localStorage.getItem(key);
      if (!data) return false;
      
      try {
        const parsed = JSON.parse(data);
        return Array.isArray(parsed) ? parsed.length > 0 : Object.keys(parsed).length > 0;
      } catch {
        return false;
      }
    });
  }

  // Start periodic sync (every 5 minutes)
  startPeriodicSync(): void {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
    }

    this.syncInterval = setInterval(async () => {
      await this.performSync();
    }, 5 * 60 * 1000); // 5 minutes

    console.log('Periodic data sync started (every 5 minutes)');
  }

  // Stop periodic sync
  stopPeriodicSync(): void {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
      console.log('Periodic data sync stopped');
    }
  }

  // Perform sync operation
  async performSync(): Promise<boolean> {
    if (this.isSyncing) {
      console.log('Sync already in progress, skipping...');
      return false;
    }

    this.isSyncing = true;
    
    try {
      console.log('Starting data sync...');
      await syncLocalStorageToSupabase();
      console.log('Data sync completed successfully');
      return true;
    } catch (error) {
      console.error('Data sync failed:', error);
      return false;
    } finally {
      this.isSyncing = false;
    }
  }

  // Manual sync with user feedback
  async manualSync(): Promise<boolean> {
    toast.info('Starting manual data sync...');
    
    const success = await this.performSync();
    
    if (success) {
      toast.success('Data sync completed successfully');
    } else {
      toast.error('Data sync failed - please try again');
    }
    
    return success;
  }

  // Check sync status
  isSyncInProgress(): boolean {
    return this.isSyncing;
  }

  // Initialize the service
  async initialize(): Promise<void> {
    try {
      // Check for initial migration
      await this.checkAndPerformInitialMigration();
      
      // Start periodic sync if migration is complete
      const migrationComplete = localStorage.getItem('dataMigrationComplete') === 'true';
      if (migrationComplete) {
        this.startPeriodicSync();
      }
    } catch (error) {
      console.error('Error initializing data sync service:', error);
    }
  }

  // Cleanup method
  cleanup(): void {
    this.stopPeriodicSync();
  }
}

export const dataSyncService = DataSyncService.getInstance();
export default DataSyncService;

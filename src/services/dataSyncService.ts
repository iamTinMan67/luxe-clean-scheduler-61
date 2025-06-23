
import { supabase } from "@/integrations/supabase/client";
import { migrateAllData } from "@/utils/migrationUtils";
import { syncLocalStorageToSupabase } from "@/utils/dataSyncUtils";

class DataSyncService {
  private static instance: DataSyncService;
  private syncInterval: NodeJS.Timeout | null = null;
  private isSyncing = false;
  private migrationAttempted = false;

  static getInstance(): DataSyncService {
    if (!DataSyncService.instance) {
      DataSyncService.instance = new DataSyncService();
    }
    return DataSyncService.instance;
  }

  // Silently check and perform initial migration
  async checkAndPerformInitialMigration(): Promise<void> {
    if (this.migrationAttempted) {
      return; // Only attempt migration once per session
    }
    
    this.migrationAttempted = true;
    
    try {
      const migrationComplete = localStorage.getItem('dataMigrationComplete') === 'true';
      
      if (!migrationComplete) {
        console.log('Silent migration check - looking for local data...');
        
        // Check if we have data in localStorage that needs migrating
        const hasLocalData = this.hasLocalStorageData();
        
        if (hasLocalData) {
          console.log('Local data found - starting silent migration...');
          await migrateAllData();
          console.log('Silent migration completed successfully');
        } else {
          // No local data to migrate, mark as complete
          localStorage.setItem('dataMigrationComplete', 'true');
          console.log('No local data to migrate - marking as complete');
        }
      } else {
        console.log('Migration already completed');
      }
    } catch (error) {
      console.error('Error during silent migration:', error);
      // Don't throw error to avoid disrupting app startup
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

  // Perform sync operation silently
  async performSync(): Promise<boolean> {
    if (this.isSyncing) {
      console.log('Sync already in progress, skipping...');
      return false;
    }

    this.isSyncing = true;
    
    try {
      console.log('Starting silent data sync...');
      await syncLocalStorageToSupabase();
      console.log('Silent data sync completed successfully');
      return true;
    } catch (error) {
      console.error('Silent data sync failed:', error);
      return false;
    } finally {
      this.isSyncing = false;
    }
  }

  // Manual sync with minimal feedback (for debugging purposes)
  async manualSync(): Promise<boolean> {
    console.log('Manual sync triggered');
    return await this.performSync();
  }

  // Check sync status
  isSyncInProgress(): boolean {
    return this.isSyncing;
  }

  // Initialize the service with silent migration
  async initialize(): Promise<void> {
    try {
      console.log('Initializing data sync service...');
      
      // Perform silent migration check
      await this.checkAndPerformInitialMigration();
      
      // Start periodic sync once migration is handled
      this.startPeriodicSync();
      
      console.log('Data sync service initialized successfully');
    } catch (error) {
      console.error('Error initializing data sync service:', error);
    }
  }

  // Cleanup method
  cleanup(): void {
    this.stopPeriodicSync();
    this.migrationAttempted = false;
  }
}

export const dataSyncService = DataSyncService.getInstance();
export default DataSyncService;

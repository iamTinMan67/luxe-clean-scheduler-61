
import { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { dataSyncService } from '@/services/dataSyncService';

export const useDataSync = () => {
  const { user } = useAuth();

  useEffect(() => {
    let mounted = true;

    const initializeSync = async () => {
      if (user && mounted) {
        console.log('User authenticated, initializing silent data sync...');
        await dataSyncService.initialize();
      }
    };

    initializeSync();

    // Cleanup function
    return () => {
      mounted = false;
      if (!user) {
        dataSyncService.cleanup();
      }
    };
  }, [user]);

  // Manual sync function for debugging purposes only
  const triggerManualSync = async () => {
    if (user) {
      console.log('Manual sync triggered by admin');
      return await dataSyncService.manualSync();
    }
    console.warn('User not authenticated, cannot sync');
    return false;
  };

  return {
    triggerManualSync,
    isSyncInProgress: dataSyncService.isSyncInProgress()
  };
};

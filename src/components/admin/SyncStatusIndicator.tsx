
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, RefreshCw, AlertCircle } from "lucide-react";
import { dataSyncService } from "@/services/dataSyncService";

export default function SyncStatusIndicator() {
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'success' | 'error'>('idle');
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);

  useEffect(() => {
    const checkSyncStatus = () => {
      const isInProgress = dataSyncService.isSyncInProgress();
      if (isInProgress && syncStatus !== 'syncing') {
        setSyncStatus('syncing');
      } else if (!isInProgress && syncStatus === 'syncing') {
        setSyncStatus('success');
        setLastSyncTime(new Date());
        // Reset to idle after showing success for 3 seconds
        setTimeout(() => setSyncStatus('idle'), 3000);
      }
    };

    const interval = setInterval(checkSyncStatus, 1000);
    return () => clearInterval(interval);
  }, [syncStatus]);

  // Only show indicator when actively syncing or showing success
  if (syncStatus === 'idle') {
    return null;
  }

  const getStatusConfig = () => {
    switch (syncStatus) {
      case 'syncing':
        return {
          icon: <RefreshCw size={14} className="animate-spin" />,
          text: 'Syncing...',
          variant: 'secondary' as const
        };
      case 'success':
        return {
          icon: <CheckCircle size={14} />,
          text: 'Synced',
          variant: 'default' as const
        };
      case 'error':
        return {
          icon: <AlertCircle size={14} />,
          text: 'Sync Error',
          variant: 'destructive' as const
        };
      default:
        return null;
    }
  };

  const config = getStatusConfig();
  if (!config) return null;

  return (
    <div className="flex items-center gap-2">
      <Badge variant={config.variant} className="flex items-center gap-1">
        {config.icon}
        {config.text}
      </Badge>
      {lastSyncTime && syncStatus === 'success' && (
        <span className="text-xs text-gray-500">
          {lastSyncTime.toLocaleTimeString()}
        </span>
      )}
    </div>
  );
}

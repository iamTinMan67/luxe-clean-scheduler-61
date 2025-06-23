
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
      setSyncStatus(isInProgress ? 'syncing' : 'idle');
    };

    const interval = setInterval(checkSyncStatus, 1000);
    return () => clearInterval(interval);
  }, []);

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
        return {
          icon: <CheckCircle size={14} />,
          text: 'Ready',
          variant: 'outline' as const
        };
    }
  };

  const config = getStatusConfig();

  return (
    <div className="flex items-center gap-2">
      <Badge variant={config.variant} className="flex items-center gap-1">
        {config.icon}
        {config.text}
      </Badge>
      {lastSyncTime && (
        <span className="text-xs text-gray-500">
          Last sync: {lastSyncTime.toLocaleTimeString()}
        </span>
      )}
    </div>
  );
}

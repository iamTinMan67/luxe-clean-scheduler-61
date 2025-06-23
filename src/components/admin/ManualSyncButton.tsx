
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { useDataSync } from "@/hooks/useDataSync";
import { useAuth } from "@/context/AuthContext";

export default function ManualSyncButton() {
  const [isLoading, setIsLoading] = useState(false);
  const { triggerManualSync } = useDataSync();
  const { isAdmin } = useAuth();

  // Only show for admin users
  if (!isAdmin) {
    return null;
  }

  const handleSync = async () => {
    setIsLoading(true);
    try {
      await triggerManualSync();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button 
      onClick={handleSync}
      disabled={isLoading}
      variant="outline"
      size="sm"
      className="flex items-center gap-2"
    >
      <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} />
      {isLoading ? "Syncing..." : "Sync Data"}
    </Button>
  );
}

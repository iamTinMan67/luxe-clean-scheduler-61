
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Edit, Trash2, Plus } from "lucide-react";

type Van = {
  id: string;
  registration: string;
  name: string;
};

interface VanSelectorProps {
  vans: Van[];
  activeVanId: string;
  onVanChange: (vanId: string) => void;
  onAddVan: () => void;
  onEditVan: (van: Van) => void;
  onDeleteVan: (id: string) => void;
}

const VanSelector = ({
  vans,
  activeVanId,
  onVanChange,
  onAddVan,
  onEditVan,
  onDeleteVan
}: VanSelectorProps) => {
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-xl font-bold text-white">Select Van</h2>
        <Button 
          variant="outline" 
          size="sm" 
          className="border-gold/30 text-white hover:bg-gold/20"
          onClick={onAddVan}
        >
          <Plus size={14} className="mr-1" /> Add Van
        </Button>
      </div>
      <Tabs value={activeVanId} onValueChange={onVanChange} className="mb-6">
        <TabsList className="bg-black/60">
          {vans.map((van) => (
            <TabsTrigger key={van.id} value={van.id} className="flex items-center gap-2">
              {van.registration}
              <div className="hidden sm:flex items-center gap-1">
                <span className="text-xs text-white/70">({van.name})</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 rounded-full hover:bg-gold/20"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEditVan(van);
                  }}
                >
                  <Edit size={10} />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 rounded-full hover:bg-red-500/20"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteVan(van.id);
                  }}
                >
                  <Trash2 size={10} />
                </Button>
              </div>
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>
  );
};

export default VanSelector;

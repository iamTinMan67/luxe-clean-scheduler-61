
import React from 'react';
import { Building, Home } from 'lucide-react';

interface ClientTypeBadgeProps {
  clientType?: string;
}

const ClientTypeBadge: React.FC<ClientTypeBadgeProps> = ({ clientType }) => {
  const getClientCategoryStyling = (type?: string) => {
    switch (type) {
      case "private":
        return "text-blue-400 border-blue-400";
      case "corporate":
        return "text-green-400 border-green-400";
      default:
        return "text-gray-400 border-gray-400";
    }
  };

  const getClientIcon = (type?: string) => {
    switch (type) {
      case "private":
        return <Home className="w-4 h-4 mr-1" />;
      case "corporate":
        return <Building className="w-4 h-4 mr-1" />;
      default:
        return null;
    }
  };

  const getClientLabel = (type?: string) => {
    switch (type) {
      case "private":
        return "Private";
      case "corporate":
        return "Commercial";
      default:
        return null;
    }
  };

  if (!clientType) return null;

  return (
    <div className={`flex items-center px-2 py-1 rounded-full border text-xs ${getClientCategoryStyling(clientType)}`}>
      {getClientIcon(clientType)}
      <span>{getClientLabel(clientType)}</span>
    </div>
  );
};

export default ClientTypeBadge;

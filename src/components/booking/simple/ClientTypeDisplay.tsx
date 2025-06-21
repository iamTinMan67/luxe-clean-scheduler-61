
import React from 'react';

const ClientTypeDisplay = () => {
  const savedClientType = localStorage.getItem('selectedClientType') || 'private';

  return (
    <div className="p-4 rounded-md bg-gold/10 border border-gold/30">
      <h3 className="font-medium text-gold mb-2">Service Type</h3>
      <p className="text-white">Other Services ({savedClientType === 'private' ? 'Private' : 'Commercial'})</p>
      <p className="text-sm text-gray-400 mt-1">Perfect for boats, caravans, mobile homes, and specialized cleaning services</p>
    </div>
  );
};

export default ClientTypeDisplay;

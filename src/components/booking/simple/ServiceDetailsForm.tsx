
import React from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface ServiceDetailsFormProps {
  jobDetails: string;
  setJobDetails: (value: string) => void;
  notes: string;
  setNotes: (value: string) => void;
}

const ServiceDetailsForm = ({
  jobDetails,
  setJobDetails,
  notes,
  setNotes,
}: ServiceDetailsFormProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white">Service Requirements</h3>
      
      <div className="space-y-2">
        <Label htmlFor="jobDetails" className="text-white">Service Description *</Label>
        <Textarea
          id="jobDetails"
          value={jobDetails}
          onChange={(e) => setJobDetails(e.target.value)}
          className="bg-gray-800 border-gray-700 text-white"
          placeholder="Please describe what you need cleaned (e.g., boat hull and deck, caravan interior/exterior, mobile home, etc.)"
          rows={4}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="notes" className="text-white">Additional Notes</Label>
        <Textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="bg-gray-800 border-gray-700 text-white"
          placeholder="Any additional information, special requirements, or access instructions"
          rows={3}
        />
      </div>
    </div>
  );
};

export default ServiceDetailsForm;

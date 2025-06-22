
import React from 'react';

interface BookingJobInfoProps {
  jobDetails?: string;
  notes?: string;
}

const BookingJobInfo: React.FC<BookingJobInfoProps> = ({ jobDetails, notes }) => {
  return (
    <>
      {jobDetails && (
        <div className="text-blue-300 text-sm mb-2 p-2 bg-blue-900/20 rounded border-l-2 border-blue-500">
          <strong>Job Details:</strong> {jobDetails}
        </div>
      )}

      {notes && (
        <div className="text-yellow-300 text-sm mb-3 p-2 bg-yellow-900/20 rounded border-l-2 border-yellow-500">
          <strong>Notes:</strong> {notes}
        </div>
      )}
    </>
  );
};

export default BookingJobInfo;

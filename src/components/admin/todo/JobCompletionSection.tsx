
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface JobCompletionSectionProps {
  allTasksCompleted: boolean;
  onFinishJob?: () => void;
}

const JobCompletionSection = ({ allTasksCompleted, onFinishJob }: JobCompletionSectionProps) => {
  if (!allTasksCompleted || !onFinishJob) {
    return null;
  }

  return (
    <div className="mt-6 p-4 border border-green-500/30 rounded-md bg-green-900/20">
      <div className="text-center">
        <p className="text-green-400 mb-3 font-medium">All tasks completed!</p>
        <Button 
          onClick={onFinishJob}
          className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-md font-medium text-lg"
          size="lg"
        >
          <CheckCircle className="h-5 w-5 mr-2" />
          Finish Job & Generate Invoice
        </Button>
        <p className="text-sm text-gray-400 mt-2">This will complete the job and generate an invoice for the customer</p>
      </div>
    </div>
  );
};

export default JobCompletionSection;

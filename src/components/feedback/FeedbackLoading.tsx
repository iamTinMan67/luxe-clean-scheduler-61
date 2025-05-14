
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

const FeedbackLoading = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-2xl mx-auto"
    >
      <Card className="bg-gray-900/50 backdrop-blur-sm rounded-lg p-8 border border-gray-800">
        <div className="space-y-6">
          <div className="mb-8 text-center">
            <Skeleton className="h-8 w-64 mx-auto mb-4" />
            <Skeleton className="h-4 w-40 mx-auto" />
            <div className="mt-6 flex justify-center space-x-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Skeleton key={star} className="h-10 w-10 rounded-full" />
              ))}
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <Skeleton className="h-4 w-24 mb-2" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div>
              <Skeleton className="h-4 w-32 mb-2" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div>
              <Skeleton className="h-4 w-28 mb-2" />
              <Skeleton className="h-32 w-full" />
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default FeedbackLoading;

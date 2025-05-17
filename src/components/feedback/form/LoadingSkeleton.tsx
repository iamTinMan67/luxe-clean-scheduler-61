
import React from "react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const LoadingSkeleton = () => {
  return (
    <Card className="bg-gray-900/50 backdrop-blur-sm rounded-lg p-8 border border-gray-800">
      <Skeleton className="h-12 w-3/4 mb-6" />
      <Skeleton className="h-8 w-1/2 mb-4" />
      <div className="space-y-4">
        <div className="flex justify-center space-x-2 mb-6">
          {[1, 2, 3, 4, 5].map((star) => (
            <Skeleton key={star} className="h-10 w-10 rounded-full" />
          ))}
        </div>
        <Skeleton className="h-12 w-full mb-4" />
        <Skeleton className="h-12 w-full mb-4" />
        <Skeleton className="h-24 w-full mb-4" />
      </div>
    </Card>
  );
};

export default LoadingSkeleton;

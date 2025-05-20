
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer 
} from "recharts";
import { useFeedbackData } from "@/hooks/useFeedbackData";
import { useEffect, useState } from "react";

interface RatingData {
  rating: number;
  count: number;
}

const FeedbackDistribution = () => {
  const [data, setData] = useState<RatingData[]>([]);
  const { feedback, loading } = useFeedbackData();
  
  useEffect(() => {
    if (!loading && feedback.length > 0) {
      // Count ratings from 1 to 5
      const ratingCounts = [0, 0, 0, 0, 0];
      
      feedback.forEach(item => {
        if (item.rating >= 1 && item.rating <= 5) {
          ratingCounts[item.rating - 1]++;
        }
      });
      
      // Format data for the chart
      const chartData = ratingCounts.map((count, index) => ({
        rating: index + 1,
        count
      }));
      
      setData(chartData);
    } else {
      // Sample data if no feedback is available
      setData([
        { rating: 1, count: 1 },
        { rating: 2, count: 2 },
        { rating: 3, count: 5 },
        { rating: 4, count: 12 },
        { rating: 5, count: 28 }
      ]);
    }
  }, [feedback, loading]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      <Card className="bg-gray-900 border-gray-800 p-6">
        <h3 className="text-lg font-bold text-white mb-4">Customer Feedback Distribution</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="rating" stroke="#9CA3AF" label={{ value: 'Rating (stars)', position: 'insideBottom', offset: -5, fill: '#9CA3AF' }} />
              <YAxis stroke="#9CA3AF" label={{ value: 'Number of Reviews', angle: -90, position: 'insideLeft', fill: '#9CA3AF' }} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', color: '#F9FAFB' }}
                itemStyle={{ color: '#F9FAFB' }}
                formatter={(value) => [`${value} reviews`, 'Count']}
                labelFormatter={(label) => `${label} stars`}
              />
              <Legend />
              <Bar dataKey="count" fill="#FFD700" name="Number of Reviews" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </motion.div>
  );
};

export default FeedbackDistribution;

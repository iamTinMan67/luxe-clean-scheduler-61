
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { 
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer 
} from "recharts";

interface PackageData {
  name: string;
  value: number;
}

interface PackageDistributionProps {
  data: PackageData[];
}

const PackageDistribution = ({ data }: PackageDistributionProps) => {
  const COLORS = ['#FFD700', '#0088FE', '#00C49F'];
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <Card className="bg-gray-900 border-gray-800 p-6">
        <h3 className="text-lg font-bold text-white mb-4">Service Package Distribution</h3>
        <div className="h-80 flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', color: '#F9FAFB' }}
                itemStyle={{ color: '#F9FAFB' }}
                formatter={(value) => [`${value}%`, 'Percentage']}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </motion.div>
  );
};

export default PackageDistribution;

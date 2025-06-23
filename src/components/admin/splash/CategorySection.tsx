
import { motion } from "framer-motion";
import { AdminFunction, CategoryConfig } from "./types";
import CategoryHeader from "./CategoryHeader";
import FunctionCard from "./FunctionCard";

interface CategorySectionProps {
  category: string;
  functions: AdminFunction[];
  config: CategoryConfig;
  categoryIndex: number;
}

const CategorySection = ({ category, functions, config, categoryIndex }: CategorySectionProps) => {
  const isFeatured = config.featured || false;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: categoryIndex * 0.1 }}
      className="space-y-4"
    >
      <CategoryHeader config={config} isFeatured={isFeatured} />

      <div className={`grid gap-4 ${isFeatured ? 'grid-cols-1' : 'grid-cols-2 md:grid-cols-4 lg:grid-cols-6'}`}>
        {functions.map((func, index) => (
          <FunctionCard
            key={func.id}
            func={func}
            index={index}
            categoryIndex={categoryIndex}
            isFeatured={isFeatured}
          />
        ))}
      </div>
    </motion.div>
  );
};

export default CategorySection;

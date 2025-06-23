
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

  // Fallback if no functions are available
  if (!functions || functions.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: categoryIndex * 0.1 }}
        className="space-y-4"
      >
        <CategoryHeader config={config} isFeatured={isFeatured} />
        <div className="text-center py-8 text-muted-foreground">
          <p>No functions available in this category</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: categoryIndex * 0.1 }}
      className="space-y-4"
    >
      <CategoryHeader config={config} isFeatured={isFeatured} />

      <div className={`grid gap-4 ${
        isFeatured 
          ? 'grid-cols-1' 
          : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6'
      }`}>
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

      {/* Optional section footer for featured categories */}
      {isFeatured && functions.length > 3 && (
        <div className="text-center pt-4">
          <p className="text-sm text-muted-foreground">
            {functions.length} functions available in this category
          </p>
        </div>
      )}
    </motion.div>
  );
};

export default CategorySection;

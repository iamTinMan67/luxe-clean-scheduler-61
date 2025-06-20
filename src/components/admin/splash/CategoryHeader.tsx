
import { CategoryConfig } from "./types";

interface CategoryHeaderProps {
  config: CategoryConfig;
  isFeatured: boolean;
}

const CategoryHeader = ({ config, isFeatured }: CategoryHeaderProps) => {
  const IconComponent = config.icon;

  return (
    <div className="flex items-center space-x-3 mb-4">
      <div className={`p-2 rounded-lg ${isFeatured ? 'bg-blue-500/20 border-blue-500/30' : `bg-${config.color}-500/20 border-${config.color}-500/30`} border`}>
        <IconComponent className={`w-5 h-5 ${isFeatured ? 'text-blue-400' : `text-${config.color}-400`}`} />
      </div>
      <h3 className="text-lg font-semibold text-white">{config.title}</h3>
      {isFeatured && (
        <span className="px-2 py-1 text-xs bg-blue-500/20 text-blue-400 rounded-full border border-blue-500/30">
          Featured
        </span>
      )}
    </div>
  );
};

export default CategoryHeader;


import { CategoryConfig } from "./types";

interface CategoryHeaderProps {
  config: CategoryConfig;
  isFeatured: boolean;
}

const CategoryHeader = ({ config, isFeatured }: CategoryHeaderProps) => {
  const IconComponent = config.icon;

  // Static class mappings for different colors
  const getColorClasses = (color: string, isFeatured: boolean) => {
    if (isFeatured) {
      return {
        bg: 'bg-blue-500/20',
        border: 'border-blue-500/30',
        text: 'text-blue-400'
      };
    }

    switch (color) {
      case 'blue':
        return {
          bg: 'bg-blue-500/20',
          border: 'border-blue-500/30',
          text: 'text-blue-400'
        };
      case 'green':
        return {
          bg: 'bg-green-500/20',
          border: 'border-green-500/30',
          text: 'text-green-400'
        };
      case 'purple':
        return {
          bg: 'bg-purple-500/20',
          border: 'border-purple-500/30',
          text: 'text-purple-400'
        };
      case 'yellow':
        return {
          bg: 'bg-yellow-500/20',
          border: 'border-yellow-500/30',
          text: 'text-yellow-400'
        };
      case 'red':
        return {
          bg: 'bg-red-500/20',
          border: 'border-red-500/30',
          text: 'text-red-400'
        };
      case 'indigo':
        return {
          bg: 'bg-indigo-500/20',
          border: 'border-indigo-500/30',
          text: 'text-indigo-400'
        };
      case 'pink':
        return {
          bg: 'bg-pink-500/20',
          border: 'border-pink-500/30',
          text: 'text-pink-400'
        };
      case 'orange':
        return {
          bg: 'bg-orange-500/20',
          border: 'border-orange-500/30',
          text: 'text-orange-400'
        };
      default:
        return {
          bg: 'bg-gray-500/20',
          border: 'border-gray-500/30',
          text: 'text-gray-400'
        };
    }
  };

  const colorClasses = getColorClasses(config.color, isFeatured);

  return (
    <div className="flex items-center space-x-3 mb-4">
      <div className={`p-2 rounded-lg ${colorClasses.bg} ${colorClasses.border} border`}>
        <IconComponent className={`w-5 h-5 ${colorClasses.text}`} />
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

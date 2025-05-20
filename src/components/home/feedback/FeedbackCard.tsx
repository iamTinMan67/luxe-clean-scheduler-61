
import { motion } from "framer-motion";
import { Star } from "lucide-react";

interface FeedbackCardProps {
  item: {
    id: string;
    name?: string;
    rating: number;
    comment: string;
    date?: string;
    images?: string[];
  };
  index: number;
}

const FeedbackCard = ({ item, index }: FeedbackCardProps) => {
  return (
    <motion.div
      key={item.id}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className="bg-gray-900/50 rounded-lg p-6 backdrop-blur-sm border border-gray-800 relative overflow-hidden"
    >
      {/* Rating stars */}
      <div className="flex mb-3">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={16}
            className={star <= item.rating ? "fill-gold text-gold" : "text-gray-500"}
          />
        ))}
      </div>
      
      <div className="text-5xl text-gold/20 absolute top-4 right-4">"</div>
      
      {/* Feedback content */}
      <p className="text-gray-300 mb-4 line-clamp-3">"{item.comment}"</p>
      
      {/* Customer info */}
      <div className="flex items-center mt-4">
        <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gold font-medium">
          {item.name ? item.name.charAt(0) : "C"}
        </div>
        <div className="ml-3">
          <h4 className="text-white text-sm font-medium">{item.name || "Customer"}</h4>
          {item.date && (
            <p className="text-gray-400 text-xs">
              {new Date(item.date).toLocaleDateString()}
            </p>
          )}
        </div>
      </div>
      
      {/* Image preview if available */}
      {item.images && item.images.length > 0 && (
        <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
          {item.images.slice(0, 2).map((image: string, idx: number) => (
            <div key={idx} className="w-16 h-16 flex-shrink-0 rounded-md overflow-hidden">
              <img
                src={image}
                alt="Customer feedback"
                className="w-full h-full object-cover"
              />
            </div>
          ))}
          {item.images.length > 2 && (
            <div className="w-16 h-16 flex-shrink-0 bg-gray-800 flex items-center justify-center rounded-md">
              <span className="text-xs text-gray-300">+{item.images.length - 2}</span>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default FeedbackCard;

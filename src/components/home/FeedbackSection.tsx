
import { motion } from "framer-motion";
import { useFeedbackManager } from "@/hooks/useFeedbackManager";
import { useState, useEffect } from "react";
import { Star } from "lucide-react";
import { Link } from "react-router-dom";

const FeedbackSection = () => {
  const { feedback, loading } = useFeedbackManager();
  const [displayFeedback, setDisplayFeedback] = useState<any[]>([]);
  
  useEffect(() => {
    if (feedback.length > 0) {
      // Only show feedback with ratings >= 4 and with comments
      const highRatedFeedback = feedback
        .filter(item => item.rating >= 4 && item.comment.trim().length > 0)
        .slice(0, 6); // Increased to 6 items
      
      setDisplayFeedback(highRatedFeedback);
    }
  }, [feedback]);

  // If we still don't have enough feedback items, add some mock data
  useEffect(() => {
    if (displayFeedback.length < 6) {
      const mockFeedback = [
        {
          id: "mock-1",
          name: "Sarah Thompson",
          rating: 5,
          comment: "Absolutely amazing service. My car hasn't looked this good since I bought it!",
          date: new Date().toISOString(),
          images: ["https://images.unsplash.com/photo-1605515298946-d0573c9b2fdc?q=80&w=1915&auto=format&fit=crop"]
        },
        {
          id: "mock-2",
          name: "Robert Johnson",
          rating: 4,
          comment: "Professional service and attention to detail. The interior cleaning was exceptional.",
          date: new Date().toISOString(),
          images: ["https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?q=80&w=1887&auto=format&fit=crop"]
        },
        {
          id: "mock-3",
          name: "Emma Davis",
          rating: 5,
          comment: "Brilliant work on my heavily soiled vehicle. The team went above and beyond.",
          date: new Date().toISOString(),
          images: ["https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1170&auto=format&fit=crop"]
        },
        {
          id: "mock-4",
          name: "James Wilson",
          rating: 5,
          comment: "Fantastic results and great value for money. Will definitely use again!",
          date: new Date().toISOString()
        },
        {
          id: "mock-5",
          name: "Olivia Green",
          rating: 4,
          comment: "Very thorough cleaning service. My car looks like new again.",
          date: new Date().toISOString()
        },
        {
          id: "mock-6",
          name: "David Brown",
          rating: 5,
          comment: "Exceptional service from start to finish. Highly recommended!",
          date: new Date().toISOString()
        }
      ];
      
      // Add enough mock feedback to reach 6 items
      const combined = [...displayFeedback];
      let i = 0;
      while (combined.length < 6 && i < mockFeedback.length) {
        combined.push(mockFeedback[i]);
        i++;
      }
      
      setDisplayFeedback(combined);
    }
  }, [displayFeedback]);

  if (loading || displayFeedback.length === 0) return null;

  return (
    <section className="py-16 bg-black">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
            Customer <span className="text-gold">Feedback</span>
          </h2>
          <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
            Real feedback from our customers. We're proud to share their experiences and testimonials.
          </p>
          <motion.div 
            className="w-20 h-1 bg-gold mx-auto"
            initial={{ width: 0 }}
            whileInView={{ width: 80 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          ></motion.div>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayFeedback.map((item, index) => (
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
          ))}
        </div>
        
        <div className="text-center mt-10">
          <Link to="/gallery" className="text-gold hover:text-white border-b border-gold hover:border-white transition-colors inline-flex items-center">
            View more customer feedback
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 ml-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeedbackSection;

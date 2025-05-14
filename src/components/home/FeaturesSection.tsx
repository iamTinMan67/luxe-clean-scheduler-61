
import { motion } from "framer-motion";
import { Droplets, ThumbsUp, Leaf, Zap } from "lucide-react";

const FeaturesSection = () => {
  const features = [
    {
      icon: <Droplets className="h-10 w-10 text-gold" />,
      title: "Self-Sufficient Equipment",
      description: "Our vans come fully equipped with independent water and low-noise level, power supplies and equipment, allowing us to operate anywhere."
    },
    {
      icon: <Leaf className="h-10 w-10 text-gold" />,
      title: "Eco-Friendly Products",
      description: "We use environmentally friendly machinery and cleaning products that are tough on dirt but gentle on your vehicle."
    },
    {
      icon: <ThumbsUp className="h-10 w-10 text-gold" />,
      title: "Satisfaction Guaranteed",
      description: "We're not happy until you're thrilled with the results of our squeaky-clean service."
    }
  ];
  
  const fadeInUpVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: [0.48, 0.15, 0.25, 0.96]
      }
    })
  };
  
  return (
    <section className="pt-4 py-12 bg-black">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <motion.h2 
            className="text-3xl md:text-4xl font-bold mb-4 text-white"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Why Choose <span className="text-white">Mid-Cheshire Valeting</span>
          </motion.h2>
          <motion.div 
            className="w-20 h-1 bg-gold mx-auto"
            initial={{ width: 0 }}
            whileInView={{ width: 80 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          ></motion.div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="bg-gray-900/50 rounded-lg p-6 backdrop-blur-sm border border-gray-800 hover:border-gold/30 transition-all hover:shadow-lg hover:shadow-gold/5"
              custom={index}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={fadeInUpVariants}
            >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2 text-white">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;

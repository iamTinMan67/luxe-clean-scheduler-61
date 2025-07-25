
import { motion } from "framer-motion";
import { Droplets, ThumbsUp, Leaf, Zap } from "lucide-react";

const FeaturesSection = () => {
  const features = [
    {
      icon: <Droplets className="h-10 w-10 text-gold" />,
      title: "Enviro-Friendly Equipment",
      description: "Our vans come fully equipped with low-noise, quiet power supplies and equipment."},
    {
      icon: <Leaf className="h-10 w-10 text-gold" />,
      title: "Eco-Friendly Products",
      description: "We only use environmentally friendly cleaning products that are tough on dirt-but gentle on your equipment."
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

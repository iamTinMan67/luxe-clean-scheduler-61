
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Droplets, Truck, ThumbsUp, Leaf, Shield, Zap } from "lucide-react";
import BubbleEffect from "@/components/effects/BubbleEffect";

const Index = () => {
  const navigate = useNavigate();
  
  const handleBooking = () => {
    navigate("/services");
  };
  
  const features = [
    {
      icon: <Droplets className="h-10 w-10 text-gold" />,
      title: "Self-Sufficient Equipment",
      description: "Our vans come fully equipped with water and power supplies, allowing us to operate anywhere."
    },
    {
      icon: <Leaf className="h-10 w-10 text-gold" />,
      title: "Eco-Friendly Products",
      description: "We use environmentally friendly cleaning products that are tough on dirt but gentle on your vehicle."
    },
    {
      icon: <Shield className="h-10 w-10 text-gold" />,
      title: "Premium Protection",
      description: "Our elite packages include ceramic coating and paint protection for long-lasting results."
    },
    {
      icon: <Truck className="h-10 w-10 text-gold" />,
      title: "Fleet Solutions",
      description: "Specialized services for commercial fleets of any size with flexible scheduling options."
    },
    {
      icon: <ThumbsUp className="h-10 w-10 text-gold" />,
      title: "Satisfaction Guaranteed",
      description: "We're not happy until you're thrilled with the results of our premium valeting service."
    },
    {
      icon: <Zap className="h-10 w-10 text-gold" />,
      title: "Efficient Service",
      description: "Our professional team works efficiently to minimize vehicle downtime without compromising quality."
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
    <div className="overflow-hidden">
      {/* Bubble Effect */}
      <BubbleEffect />
      
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Hero Background */}
        <div 
          className="absolute inset-0 bg-black z-0 bg-cover bg-center bg-no-repeat brightness-50"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1635775017492-1eb854ae5c02?q=80&w=1932&auto=format&fit=crop')",
          }}
        ></div>
        
        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black z-10"></div>
        
        {/* Content */}
        <div className="container mx-auto px-4 relative z-20 text-center max-w-4xl">
          <motion.h1 
            className="text-4xl md:text-6xl font-bold mb-6 text-white"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            Premium Vehicle Valeting For <span className="text-gold">Exceptional</span> Cars
          </motion.h1>
          
          <motion.p 
            className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.4 }}
          >
            Specialized cleaning and detailing services for high-end vehicles and commercial fleets
          </motion.p>
          
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6 }}
          >
            <button 
              onClick={handleBooking}
              className="gold-gradient text-black px-8 py-3 rounded-md font-medium text-lg flex items-center justify-center hover:shadow-lg hover:shadow-gold/20 transition-all"
            >
              Our Services
              <ArrowRight className="ml-2 h-5 w-5" />
            </button>
            
            <button 
              onClick={() => navigate("/gallery")}
              className="bg-white/10 backdrop-blur-sm text-white border border-white/20 px-8 py-3 rounded-md font-medium text-lg hover:bg-white/20 transition-all"
            >
              View Gallery
            </button>
          </motion.div>
        </div>
        
        {/* Scroll indicator */}
        <motion.div 
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, y: [0, 10, 0] }}
          transition={{ 
            opacity: { delay: 1, duration: 1 },
            y: { repeat: Infinity, duration: 1.5, ease: "easeInOut" }
          }}
        >
          <div className="h-14 w-8 rounded-full border-2 border-white/30 flex justify-center">
            <div className="w-1.5 h-3 bg-gold rounded-full mt-2"></div>
          </div>
        </motion.div>
      </section>
      
      {/* Features Section */}
      <section className="py-20 bg-black">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <motion.h2 
              className="text-3xl md:text-4xl font-bold mb-4 text-white"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              Why Choose <span className="text-gold">LuxeClean</span>
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
      
      {/* Testimonials */}
      <section className="py-20 bg-gradient-to-b from-black to-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <motion.h2 
              className="text-3xl md:text-4xl font-bold mb-4 text-white"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              What Our Clients Say
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
            {[
              {
                name: "James Wilson",
                car: "Bentley Continental GT",
                text: "Absolutely outstanding service. My Bentley looks better than the day I bought it. The attention to detail is remarkable."
              },
              {
                name: "Sarah Mitchell",
                car: "Range Rover Autobiography",
                text: "I've tried many valeting services but LuxeClean is by far the best. They take such care with every aspect of the cleaning process."
              },
              {
                name: "Robert Taylor",
                car: "Fleet Manager, Express Delivery",
                text: "Managing a fleet of 15 vans, I need reliability and consistency. LuxeClean delivers every time with their efficient service."
              }
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                className="bg-black rounded-lg p-8 relative glass-morphism"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <div className="text-6xl text-gold/20 absolute top-4 left-4">"</div>
                <p className="text-gray-300 relative z-10 mb-6">{testimonial.text}</p>
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-gold/20 flex items-center justify-center text-gold">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div className="ml-4">
                    <h4 className="text-white font-medium">{testimonial.name}</h4>
                    <p className="text-gray-400 text-sm">{testimonial.car}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <button 
              onClick={() => navigate("/gallery")}
              className="text-gold hover:text-white border-b border-gold hover:border-white transition-colors inline-flex items-center"
            >
              View more testimonials
              <ArrowRight className="ml-2 h-4 w-4" />
            </button>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-24 relative">
        <div 
          className="absolute inset-0 bg-black z-0 bg-cover bg-center bg-no-repeat brightness-30"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1550355291-bbee04a92027?q=80&w=1936&auto=format&fit=crop')",
          }}
        ></div>
        
        <div className="absolute inset-0 bg-black/70 z-0"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <motion.h2 
              className="text-3xl md:text-5xl font-bold mb-6 text-white"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              Ready to Experience the <span className="text-gold">Difference</span>?
            </motion.h2>
            
            <motion.p 
              className="text-xl text-gray-200 mb-8"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Book your premium valeting service today and give your vehicle the care it deserves.
            </motion.p>
            
            <motion.button 
              onClick={handleBooking}
              className="gold-gradient text-black px-10 py-4 rounded-md font-medium text-lg hover:shadow-xl hover:shadow-gold/20 transition-all"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              Book Now
            </motion.button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;

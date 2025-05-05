
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import { ArrowRight, Calendar, BarChart3, Search } from "lucide-react";

const CTASection = () => {
  return (
    <section className="bg-black py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Book Now Card */}
          <div className="bg-gray-900/50 backdrop-blur-sm rounded-lg p-6 border border-gray-800 flex flex-col">
            <div className="mb-4 bg-gold/10 p-3 rounded-full w-fit">
              <Calendar className="w-6 h-6 text-gold" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Book Your Valet</h3>
            <p className="text-gray-400 mb-6 flex-grow">
              Schedule a premium valeting service for your vehicle at your convenience.
            </p>
            <Link to="/booking">
              <Button className="w-full gold-gradient text-black hover:shadow-xl hover:shadow-gold/20 transition-all">
                Book Now <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>
          
          {/* View Packages Card */}
          <div className="bg-gray-900/50 backdrop-blur-sm rounded-lg p-6 border border-gray-800 flex flex-col">
            <div className="mb-4 bg-gold/10 p-3 rounded-full w-fit">
              <BarChart3 className="w-6 h-6 text-gold" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Our Packages</h3>
            <p className="text-gray-400 mb-6 flex-grow">
              Explore our range of premium valeting packages tailored to your vehicle's needs.
            </p>
            <Link to="/services">
              <Button className="w-full gold-gradient text-black hover:shadow-xl hover:shadow-gold/20 transition-all">
                View Packages <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>
          
          {/* Track Your Valet Card */}
          <div className="bg-gray-900/50 backdrop-blur-sm rounded-lg p-6 border border-gray-800 flex flex-col">
            <div className="mb-4 bg-gold/10 p-3 rounded-full w-fit">
              <Search className="w-6 h-6 text-gold" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Track Your Valet</h3>
            <p className="text-gray-400 mb-6 flex-grow">
              Enter your booking reference to track the real-time progress of your valet service.
            </p>
            <Link to="/track">
              <Button className="w-full gold-gradient text-black hover:shadow-xl hover:shadow-gold/20 transition-all">
                Track Now <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;

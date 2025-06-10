import { Link } from 'react-router-dom';
import { Calendar, BarChart3, Search } from 'lucide-react';

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Premium Mobile
              <span className="text-yellow-400"> Valeting</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
              Professional car valeting services that come to you. Expert cleaning, 
              exceptional results, unmatched convenience.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/book"
                className="bg-yellow-400 hover:bg-yellow-500 text-blue-900 px-8 py-4 rounded-lg font-semibold text-lg transition-colors duration-200"
              >
                Book Now
              </Link>
              <Link
                to="/packages"
                className="border-2 border-white hover:bg-white hover:text-blue-900 px-8 py-4 rounded-lg font-semibold text-lg transition-colors duration-200"
              >
                View Packages
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Actions Section */}
      <section className="bg-black pt-8 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Quick Book Card */}
            <div className="bg-gray-800 rounded-xl p-8 hover:bg-gray-700 transition-colors duration-200">
              <div className="w-12 h-12 bg-yellow-400 rounded-lg flex items-center justify-center mb-6">
                <Calendar className="text-blue-900" size={24} />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Quick Book A Slot</h3>
              <p className="text-gray-300 mb-6">
                Private. Main Package Only. Any Time. No Notes. Cash on completion. Just need contact details.
              </p>
              <Link
                to="/book"
                className="w-full bg-yellow-400 hover:bg-yellow-500 text-blue-900 px-6 py-3 rounded-lg font-semibold inline-flex items-center justify-center gap-2 transition-colors duration-200"
              >
                Reserve Now
                <span>→</span>
              </Link>
            </div>

            {/* Packages Card */}
            <div className="bg-gray-800 rounded-xl p-8 hover:bg-gray-700 transition-colors duration-200">
              <div className="w-12 h-12 bg-yellow-400 rounded-lg flex items-center justify-center mb-6">
                <BarChart3 className="text-blue-900" size={24} />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Our Packages</h3>
              <p className="text-gray-300 mb-6">
                Explore our range of valeting packages tailored to your specific needs.
              </p>
              <Link
                to="/packages"
                className="w-full bg-yellow-400 hover:bg-yellow-500 text-blue-900 px-6 py-3 rounded-lg font-semibold inline-flex items-center justify-center gap-2 transition-colors duration-200"
              >
                View Our Packages
                <span>→</span>
              </Link>
            </div>

            {/* Track Valet Card */}
            <div className="bg-gray-800 rounded-xl p-8 hover:bg-gray-700 transition-colors duration-200">
              <div className="w-12 h-12 bg-yellow-400 rounded-lg flex items-center justify-center mb-6">
                <Search className="text-blue-900" size={24} />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Track Your Valet</h3>
              <p className="text-gray-300 mb-6">
                Check-up on our progress.
              </p>
              <Link
                to="/track"
                className="w-full bg-yellow-400 hover:bg-yellow-500 text-blue-900 px-6 py-3 rounded-lg font-semibold inline-flex items-center justify-center gap-2 transition-colors duration-200"
              >
                Track Us Now
                <span>→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Our Service?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We bring professional car valeting directly to your location with 
              uncompromising quality and convenience.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Calendar className="text-blue-600" size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Mobile Service</h3>
              <p className="text-gray-600">
                We come to you - at home, work, or anywhere convenient. No need to travel or wait around.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <BarChart3 className="text-yellow-600" size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Professional Results</h3>
              <p className="text-gray-600">
                Expert technicians using premium products and equipment for exceptional results every time.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="text-green-600" size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Fully Insured</h3>
              <p className="text-gray-600">
                Complete peace of mind with full insurance coverage and satisfaction guarantee.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-900 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Transform Your Vehicle?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Book your mobile valeting service today and experience the convenience 
            of professional car care delivered to your doorstep.
          </p>
          <Link
            to="/book"
            className="bg-yellow-400 hover:bg-yellow-500 text-blue-900 px-8 py-4 rounded-lg font-semibold text-lg transition-colors duration-200 inline-block"
          >
            Book Your Service Now
          </Link>
        </div>
      </section>
    </div>
  );
}
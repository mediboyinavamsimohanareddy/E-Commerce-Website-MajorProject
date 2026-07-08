import { Link } from 'react-router-dom';
import { ArrowRight, ShoppingBag } from 'lucide-react';

const HeroBanner = () => {
  return (
    <div className="relative overflow-hidden bg-surface-50 dark:bg-surface-950 pt-20 sm:pt-24 lg:pt-32 pb-16 lg:pb-24">
      {/* Abstract Background Shapes */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-primary-500/20 blur-3xl"></div>
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-accent-500/20 blur-3xl"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8 items-center">
          
          {/* Text Content */}
          <div className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left animate-slide-in-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 text-sm font-semibold mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
              </span>
              New Collection 2024
            </div>
            
            <h1 className="text-4xl tracking-tight font-extrabold text-surface-900 dark:text-white sm:text-5xl md:text-6xl lg:text-5xl xl:text-6xl">
              <span className="block xl:inline">Premium Shopping</span>{' '}
              <span className="block gradient-text mt-1">Experience</span>
            </h1>
            
            <p className="mt-3 text-base text-surface-500 dark:text-surface-400 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0 text-balance">
              Discover a curated selection of the finest electronics, fashion, and home essentials. Elevate your lifestyle with Novexa mart today.
            </p>
            
            <div className="mt-8 sm:max-w-lg sm:mx-auto sm:text-center lg:text-left lg:mx-0 flex flex-col sm:flex-row gap-4">
              <Link to="/products" className="btn-primary w-full sm:w-auto text-lg group">
                Shop Now
                <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/categories" className="btn-secondary w-full sm:w-auto text-lg group">
                <ShoppingBag size={20} className="mr-2 text-surface-400 group-hover:text-surface-600 dark:group-hover:text-surface-200 transition-colors" />
                View Categories
              </Link>
            </div>
            
            <div className="mt-10 grid grid-cols-3 gap-4 border-t border-surface-200 dark:border-surface-800 pt-6">
              <div>
                <p className="text-2xl font-bold text-surface-900 dark:text-white">5k+</p>
                <p className="text-sm text-surface-500 dark:text-surface-400">Products</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-surface-900 dark:text-white">10k+</p>
                <p className="text-sm text-surface-500 dark:text-surface-400">Customers</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-surface-900 dark:text-white">4.9</p>
                <p className="text-sm text-surface-500 dark:text-surface-400">Rating</p>
              </div>
            </div>
          </div>
          
          {/* Hero Image Group */}
          <div className="mt-12 relative sm:max-w-lg sm:mx-auto lg:mt-0 lg:max-w-none lg:mx-0 lg:col-span-6 lg:flex lg:items-center animate-scale-in">
            <div className="relative mx-auto w-full rounded-2xl shadow-premium lg:max-w-md overflow-hidden aspect-[4/5] sm:aspect-square lg:aspect-[4/5]">
              <img
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 hover:scale-105"
                src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800"
                alt="Premium shopping experience"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-transparent"></div>
              
              {/* Floating Card */}
              <div className="absolute bottom-6 left-6 right-6 glass-card p-4 flex items-center justify-between animate-float">
                <div>
                  <p className="text-sm font-semibold text-surface-900 dark:text-white">MacBook Pro 16"</p>
                  <p className="text-xs text-primary-600 font-bold">$2,499.99</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-white dark:bg-surface-800 flex items-center justify-center text-primary-600 shadow-md">
                  <ArrowRight size={18} />
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default HeroBanner;

import HeroBanner from '../components/home/HeroBanner';
import CategoryGrid from '../components/home/CategoryGrid';
import FeaturedProducts from '../components/home/FeaturedProducts';

const Home = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <HeroBanner />
      <CategoryGrid />
      <FeaturedProducts />
      
      {/* Promotional Section */}
      <section className="section bg-white dark:bg-surface-900 border-y border-surface-200 dark:border-surface-800">
        <div className="page-container">
          <div className="relative rounded-3xl overflow-hidden bg-primary-900">
            <div className="absolute inset-0">
              <img 
                src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200" 
                alt="Sale promotion" 
                className="w-full h-full object-cover opacity-40 mix-blend-overlay"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-primary-900 to-transparent"></div>
            </div>
            
            <div className="relative py-16 px-8 md:py-20 md:px-16 max-w-2xl">
              <span className="inline-block px-3 py-1 bg-accent-500 text-white text-sm font-bold tracking-wider uppercase rounded-full mb-4">
                Limited Time Offer
              </span>
              <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-4">
                Summer Sale is Here!
              </h2>
              <p className="text-primary-100 text-lg mb-8">
                Get up to 50% off on selected electronics and fashion items. Upgrade your lifestyle without breaking the bank.
              </p>
              <div className="flex flex-wrap gap-4">
                <a href="/products" className="btn-accent px-8 py-3 text-lg shadow-glow-accent">
                  Shop the Sale
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section bg-surface-50 dark:bg-surface-950">
        <div className="page-container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="p-6 bg-white dark:bg-surface-900 rounded-2xl shadow-sm border border-surface-100 dark:border-surface-800">
              <div className="w-12 h-12 mx-auto bg-primary-100 dark:bg-primary-900/30 text-primary-600 flex items-center justify-center rounded-xl mb-4">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"></path></svg>
              </div>
              <h3 className="text-lg font-semibold text-surface-900 dark:text-white mb-2">Free Shipping</h3>
              <p className="text-surface-500 dark:text-surface-400 text-sm">On all orders over ₹10,000. Standard delivery applies.</p>
            </div>
            <div className="p-6 bg-white dark:bg-surface-900 rounded-2xl shadow-sm border border-surface-100 dark:border-surface-800">
              <div className="w-12 h-12 mx-auto bg-primary-100 dark:bg-primary-900/30 text-primary-600 flex items-center justify-center rounded-xl mb-4">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
              </div>
              <h3 className="text-lg font-semibold text-surface-900 dark:text-white mb-2">Secure Payments</h3>
              <p className="text-surface-500 dark:text-surface-400 text-sm">100% secure payment with 256-bit encryption.</p>
            </div>
            <div className="p-6 bg-white dark:bg-surface-900 rounded-2xl shadow-sm border border-surface-100 dark:border-surface-800">
              <div className="w-12 h-12 mx-auto bg-primary-100 dark:bg-primary-900/30 text-primary-600 flex items-center justify-center rounded-xl mb-4">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
              </div>
              <h3 className="text-lg font-semibold text-surface-900 dark:text-white mb-2">Easy Returns</h3>
              <p className="text-surface-500 dark:text-surface-400 text-sm">30 days return policy for a full refund or exchange.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

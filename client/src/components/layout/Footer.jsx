import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, ArrowRight } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-surface-950 border-t border-surface-200 dark:border-surface-800 pt-16 pb-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* Brand & Intro */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white">
                <span className="font-bold text-lg">N</span>
              </div>
              <span className="text-xl font-bold tracking-tight text-surface-900 dark:text-white">
                Novexa <span className="text-primary-600 dark:text-primary-400">mart</span>
              </span>
            </Link>
            <p className="text-surface-500 dark:text-surface-400 text-sm leading-relaxed">
              Your premium destination for the latest electronics, fashion, home decor, and more. Quality guaranteed with every purchase.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-surface-100 dark:bg-surface-900 flex items-center justify-center font-bold text-xs text-surface-500 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/30 transition-colors">
                FB
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-surface-100 dark:bg-surface-900 flex items-center justify-center font-bold text-xs text-surface-500 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/30 transition-colors">
                TW
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-surface-100 dark:bg-surface-900 flex items-center justify-center font-bold text-xs text-surface-500 hover:text-accent-500 hover:bg-accent-50 dark:hover:bg-accent-900/30 transition-colors">
                IG
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-surface-100 dark:bg-surface-900 flex items-center justify-center font-bold text-xs text-surface-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors">
                YT
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-surface-900 dark:text-white uppercase tracking-wider mb-6">Quick Links</h3>
            <ul className="space-y-4">
              <li>
                <Link to="/products" className="text-surface-500 dark:text-surface-400 hover:text-primary-600 dark:hover:text-primary-400 text-sm transition-colors">All Products</Link>
              </li>
              <li>
                <Link to="/categories/electronics" className="text-surface-500 dark:text-surface-400 hover:text-primary-600 dark:hover:text-primary-400 text-sm transition-colors">Electronics</Link>
              </li>
              <li>
                <Link to="/categories/fashion" className="text-surface-500 dark:text-surface-400 hover:text-primary-600 dark:hover:text-primary-400 text-sm transition-colors">Fashion</Link>
              </li>
              <li>
                <Link to="/about" className="text-surface-500 dark:text-surface-400 hover:text-primary-600 dark:hover:text-primary-400 text-sm transition-colors">About Us</Link>
              </li>
              <li>
                <Link to="/faq" className="text-surface-500 dark:text-surface-400 hover:text-primary-600 dark:hover:text-primary-400 text-sm transition-colors">FAQ</Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-sm font-semibold text-surface-900 dark:text-white uppercase tracking-wider mb-6">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-surface-500 dark:text-surface-400 text-sm">
                <MapPin size={18} className="text-primary-500 shrink-0 mt-0.5" />
                <span>123 Commerce Avenue, Tech District, San Francisco, CA 94107</span>
              </li>
              <li className="flex items-center gap-3 text-surface-500 dark:text-surface-400 text-sm">
                <Phone size={18} className="text-primary-500 shrink-0" />
                <span>+1 (800) 123-4567</span>
              </li>
              <li className="flex items-center gap-3 text-surface-500 dark:text-surface-400 text-sm">
                <Mail size={18} className="text-primary-500 shrink-0" />
                <span>support@novexamart.com</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-sm font-semibold text-surface-900 dark:text-white uppercase tracking-wider mb-6">Newsletter</h3>
            <p className="text-surface-500 dark:text-surface-400 text-sm mb-4">
              Subscribe to get special offers, free giveaways, and updates.
            </p>
            <form className="relative" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full pl-4 pr-12 py-3 rounded-xl bg-surface-100 dark:bg-surface-900 border-none text-surface-900 dark:text-white focus:ring-2 focus:ring-primary-500 text-sm"
                required
              />
              <button 
                type="submit"
                className="absolute right-1 top-1 bottom-1 w-10 flex items-center justify-center bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
              >
                <ArrowRight size={18} />
              </button>
            </form>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-surface-200 dark:border-surface-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-surface-500 dark:text-surface-400 text-sm text-center md:text-left">
            &copy; {new Date().getFullYear()} Novexa mart. All rights reserved.
          </p>
          <div className="flex gap-4">
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/200px-Visa_Inc._logo.svg.png" alt="Visa" className="h-6 opacity-50 hover:opacity-100 transition-opacity" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/200px-Mastercard-logo.svg.png" alt="Mastercard" className="h-6 opacity-50 hover:opacity-100 transition-opacity" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/PayPal.svg/200px-PayPal.svg.png" alt="PayPal" className="h-6 opacity-50 hover:opacity-100 transition-opacity" />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

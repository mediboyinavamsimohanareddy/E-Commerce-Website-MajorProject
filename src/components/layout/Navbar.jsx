import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  ShoppingBag, 
  Heart, 
  User, 
  Menu, 
  X, 
  Search, 
  Sun, 
  Moon,
  LogOut,
  Settings,
  LayoutDashboard
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useTheme } from '../../context/ThemeContext';
import { productsAPI } from '../../services/api';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  const { user, logout, isAuthenticated, isAdmin } = useAuth();
  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();
  const { isDark, toggleTheme } = useTheme();
  
  const navigate = useNavigate();
  const location = useLocation();
  const searchRef = useRef(null);
  const userMenuRef = useRef(null);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsUserMenuOpen(false);
    setShowSuggestions(false);
  }, [location]);

  // Click outside to close menus
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle search with debounce
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchQuery.trim().length < 2) {
        setSuggestions([]);
        return;
      }
      try {
        const { data } = await productsAPI.getSuggestions(searchQuery);
        setSuggestions(data.data);
      } catch (error) {
        console.error('Failed to fetch suggestions:', error);
      }
    };

    const timeoutId = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?keyword=${encodeURIComponent(searchQuery)}`);
      setShowSuggestions(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header 
      className={`fixed top-0 w-full z-40 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/80 dark:bg-surface-950/80 backdrop-blur-lg shadow-sm border-b border-surface-200 dark:border-surface-800' 
          : 'bg-white dark:bg-surface-950 border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white shadow-lg group-hover:scale-105 transition-transform duration-300">
                <ShoppingBag size={24} strokeWidth={2.5} />
              </div>
              <span className="text-2xl font-bold tracking-tight text-surface-900 dark:text-white">
                Novexa <span className="text-primary-600 dark:text-primary-400">mart</span>
              </span>
            </Link>
          </div>

          {/* Search Bar (Desktop) */}
          <div className="hidden md:block flex-1 max-w-xl mx-8 relative" ref={searchRef}>
            <form onSubmit={handleSearchSubmit} className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-surface-400 group-focus-within:text-primary-500 transition-colors">
                <Search size={20} />
              </div>
              <input
                type="text"
                placeholder="Search for premium products..."
                className="w-full pl-10 pr-4 py-2.5 rounded-full bg-surface-100 dark:bg-surface-900 border border-transparent focus:bg-white dark:focus:bg-surface-950 focus:border-primary-500/50 focus:ring-2 focus:ring-primary-500/20 text-surface-900 dark:text-white transition-all duration-300"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
              />
              <button type="submit" className="hidden" />
            </form>

            {/* Search Suggestions Dropdown */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-surface-900 rounded-xl shadow-premium border border-surface-100 dark:border-surface-800 overflow-hidden z-50">
                {suggestions.map((item) => (
                  <Link
                    key={item._id}
                    to={`/product/${item._id}`}
                    className="flex items-center gap-4 p-3 hover:bg-surface-50 dark:hover:bg-surface-800 transition-colors"
                  >
                    <img 
                      src={item.images[0]?.url || 'https://via.placeholder.com/40'} 
                      alt={item.name}
                      className="w-10 h-10 object-cover rounded-md"
                    />
                    <div>
                      <p className="text-sm font-medium text-surface-900 dark:text-white line-clamp-1">{item.name}</p>
                      <p className="text-xs text-primary-600 font-semibold">${item.price}</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Desktop Navigation Icons */}
          <div className="hidden md:flex items-center gap-6">
            <button 
              onClick={toggleTheme}
              className="text-surface-500 hover:text-primary-600 dark:text-surface-400 dark:hover:text-primary-400 transition-colors"
              aria-label="Toggle Theme"
            >
              {isDark ? <Sun size={22} /> : <Moon size={22} />}
            </button>

            <Link to="/wishlist" className="relative text-surface-500 hover:text-primary-600 dark:text-surface-400 dark:hover:text-primary-400 transition-colors">
              <Heart size={22} />
              {wishlistCount > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-accent-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border-2 border-white dark:border-surface-950">
                  {wishlistCount}
                </span>
              )}
            </Link>

            <Link to="/cart" className="relative text-surface-500 hover:text-primary-600 dark:text-surface-400 dark:hover:text-primary-400 transition-colors">
              <ShoppingBag size={22} />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-primary-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border-2 border-white dark:border-surface-950">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* User Dropdown */}
            {isAuthenticated ? (
              <div className="relative" ref={userMenuRef}>
                <button 
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 p-1 rounded-full hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary-600 to-accent-500 flex items-center justify-center text-white font-bold text-sm">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-3 w-56 bg-white dark:bg-surface-900 rounded-xl shadow-premium border border-surface-100 dark:border-surface-800 overflow-hidden py-1 z-50 animate-scale-in origin-top-right">
                    <div className="px-4 py-3 border-b border-surface-100 dark:border-surface-800">
                      <p className="text-sm font-semibold text-surface-900 dark:text-white truncate">{user?.name}</p>
                      <p className="text-xs text-surface-500 truncate">{user?.email}</p>
                    </div>
                    
                    {isAdmin && (
                      <Link to="/admin" className="flex items-center gap-3 px-4 py-2.5 text-sm text-surface-700 dark:text-surface-300 hover:bg-surface-50 dark:hover:bg-surface-800 hover:text-primary-600">
                        <LayoutDashboard size={16} /> Admin Dashboard
                      </Link>
                    )}
                    
                    <Link to="/profile" className="flex items-center gap-3 px-4 py-2.5 text-sm text-surface-700 dark:text-surface-300 hover:bg-surface-50 dark:hover:bg-surface-800 hover:text-primary-600">
                      <User size={16} /> My Profile
                    </Link>
                    <Link to="/orders" className="flex items-center gap-3 px-4 py-2.5 text-sm text-surface-700 dark:text-surface-300 hover:bg-surface-50 dark:hover:bg-surface-800 hover:text-primary-600">
                      <ShoppingBag size={16} /> My Orders
                    </Link>
                    <Link to="/settings" className="flex items-center gap-3 px-4 py-2.5 text-sm text-surface-700 dark:text-surface-300 hover:bg-surface-50 dark:hover:bg-surface-800 hover:text-primary-600">
                      <Settings size={16} /> Settings
                    </Link>
                    
                    <div className="border-t border-surface-100 dark:border-surface-800 mt-1">
                      <button 
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                      >
                        <LogOut size={16} /> Sign out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login" className="text-sm font-medium text-surface-600 dark:text-surface-300 hover:text-primary-600">Log in</Link>
                <Link to="/register" className="btn-primary py-2 px-4 text-sm">Sign up</Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-4">
            <Link to="/cart" className="relative text-surface-500 dark:text-surface-400">
              <ShoppingBag size={24} />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-primary-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-surface-600 dark:text-surface-300 p-1"
            >
              {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-surface-950 border-b border-surface-200 dark:border-surface-800 absolute w-full left-0 animate-fade-in-down shadow-lg">
          <div className="px-4 py-4 space-y-4">
            {/* Mobile Search */}
            <form onSubmit={handleSearchSubmit} className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-surface-400">
                <Search size={20} />
              </div>
              <input
                type="text"
                placeholder="Search products..."
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-surface-100 dark:bg-surface-900 border-none text-surface-900 dark:text-white focus:ring-2 focus:ring-primary-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>

            <div className="grid grid-cols-2 gap-2 pb-4 border-b border-surface-100 dark:border-surface-800">
              <Link to="/products" className="flex items-center justify-center gap-2 p-3 bg-surface-50 dark:bg-surface-900 rounded-xl text-sm font-medium">
                All Products
              </Link>
              <Link to="/categories" className="flex items-center justify-center gap-2 p-3 bg-surface-50 dark:bg-surface-900 rounded-xl text-sm font-medium">
                Categories
              </Link>
              <Link to="/wishlist" className="flex items-center justify-center gap-2 p-3 bg-surface-50 dark:bg-surface-900 rounded-xl text-sm font-medium">
                <Heart size={16} /> Wishlist ({wishlistCount})
              </Link>
              <button 
                onClick={toggleTheme}
                className="flex items-center justify-center gap-2 p-3 bg-surface-50 dark:bg-surface-900 rounded-xl text-sm font-medium"
              >
                {isDark ? <><Sun size={16}/> Light</> : <><Moon size={16}/> Dark</>}
              </button>
            </div>

            {isAuthenticated ? (
              <div className="space-y-1">
                <p className="px-3 text-xs font-semibold text-surface-500 uppercase tracking-wider mb-2">My Account</p>
                {isAdmin && (
                  <Link to="/admin" className="flex items-center gap-3 px-3 py-3 rounded-xl text-surface-700 dark:text-surface-300 hover:bg-surface-50 dark:hover:bg-surface-900">
                    <LayoutDashboard size={18} /> Admin Dashboard
                  </Link>
                )}
                <Link to="/profile" className="flex items-center gap-3 px-3 py-3 rounded-xl text-surface-700 dark:text-surface-300 hover:bg-surface-50 dark:hover:bg-surface-900">
                  <User size={18} /> Profile
                </Link>
                <Link to="/orders" className="flex items-center gap-3 px-3 py-3 rounded-xl text-surface-700 dark:text-surface-300 hover:bg-surface-50 dark:hover:bg-surface-900">
                  <ShoppingBag size={18} /> Orders
                </Link>
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  <LogOut size={18} /> Sign out
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-3 pt-2">
                <Link to="/login" className="btn-secondary w-full">Log in</Link>
                <Link to="/register" className="btn-primary w-full">Sign up</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;

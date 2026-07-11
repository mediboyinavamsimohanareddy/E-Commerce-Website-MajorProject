import { Link } from 'react-router-dom';
import { Star, ShoppingCart, Heart } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import toast from 'react-hot-toast';
import { formatPrice } from '../../utils/formatPrice';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  
  const inWishlist = isInWishlist(product._id);
  const discount = product.comparePrice > product.price 
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100) 
    : 0;

  const handleAddToCart = async (e) => {
    e.preventDefault();
    try {
      await addToCart(product._id, 1);
      toast.success('Added to cart');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add to cart');
    }
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    toggleWishlist(product);
    if (!inWishlist) {
      toast.success('Added to wishlist');
    }
  };

  return (
    <Link 
      to={`/product/${product._id}`}
      className="group flex flex-col bg-white dark:bg-surface-900 rounded-2xl border border-surface-200 dark:border-surface-800 overflow-hidden card-hover h-full"
    >
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-surface-100 dark:bg-surface-800">
        <img
          src={product.images[0]?.url || 'https://via.placeholder.com/400'}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {discount > 0 && (
            <span className="bg-accent-500 text-white text-xs font-bold px-2 py-1 rounded-md">
              -{discount}%
            </span>
          )}
          {product.featured && (
            <span className="bg-primary-600 text-white text-xs font-bold px-2 py-1 rounded-md shadow-lg shadow-primary-500/30">
              Featured
            </span>
          )}
        </div>

        {/* Quick Actions */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 translate-x-12 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300">
          <button
            onClick={handleWishlist}
            className={`w-9 h-9 rounded-full flex items-center justify-center shadow-md transition-colors ${
              inWishlist 
                ? 'bg-red-50 text-red-500 hover:bg-red-100 dark:bg-red-900/30 dark:hover:bg-red-900/50' 
                : 'bg-white text-surface-600 hover:text-red-500 dark:bg-surface-800 dark:text-surface-300 dark:hover:text-red-400'
            }`}
          >
            <Heart size={18} fill={inWishlist ? "currentColor" : "none"} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-grow">
        <div className="text-xs text-primary-600 dark:text-primary-400 font-semibold mb-1 uppercase tracking-wider">
          {product.category?.name || 'Category'}
        </div>
        
        <h3 className="text-sm font-semibold text-surface-900 dark:text-white line-clamp-2 mb-2 flex-grow">
          {product.name}
        </h3>
        
        <div className="flex items-center mb-3">
          <div className="flex items-center text-amber-400">
            <Star size={14} fill="currentColor" />
            <span className="ml-1 text-xs font-medium text-surface-600 dark:text-surface-400">
              {product.rating > 0 ? product.rating.toFixed(1) : 'New'} 
              <span className="text-surface-400"> ({product.numReviews})</span>
            </span>
          </div>
        </div>
        
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-surface-100 dark:border-surface-800">
          <div>
            <span className="text-lg font-bold text-surface-900 dark:text-white">
              {formatPrice(product.price)}
            </span>
            {product.comparePrice > product.price && (
              <span className="ml-2 text-xs text-surface-400 line-through">
                {formatPrice(product.comparePrice)}
              </span>
            )}
          </div>
          
          <button
            onClick={handleAddToCart}
            disabled={product.stock <= 0}
            className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
              product.stock > 0 
                ? 'bg-primary-50 text-primary-600 hover:bg-primary-600 hover:text-white dark:bg-primary-900/20 dark:hover:bg-primary-600'
                : 'bg-surface-100 text-surface-400 cursor-not-allowed dark:bg-surface-800'
            }`}
          >
            <ShoppingCart size={18} />
          </button>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;

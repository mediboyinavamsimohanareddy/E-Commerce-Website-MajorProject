import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Trash2 } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';
import { formatPrice } from '../utils/formatPrice';

const Wishlist = () => {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  const handleMoveToCart = async (product) => {
    try {
      await addToCart(product._id, 1);
      removeFromWishlist(product._id);
      toast.success('Moved to cart');
    } catch (error) {
      toast.error('Failed to move to cart');
    }
  };

  if (!wishlist?.length) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center pt-20 pb-12 px-4 sm:px-6">
        <div className="w-24 h-24 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center text-red-400 mb-6">
          <Heart size={40} />
        </div>
        <h2 className="text-3xl font-bold text-surface-900 dark:text-white mb-4">Your wishlist is empty</h2>
        <p className="text-surface-500 dark:text-surface-400 mb-8 max-w-md text-center">
          Save items you love and they will show up here. Ready to find something amazing?
        </p>
        <Link to="/products" className="btn-primary">
          Explore Products
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-16 min-h-screen bg-surface-50 dark:bg-surface-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-8 animate-fade-in-down">
          <h1 className="text-3xl font-bold text-surface-900 dark:text-white">My Wishlist</h1>
          <p className="mt-2 text-surface-500 dark:text-surface-400">
            {wishlist.length} {wishlist.length === 1 ? 'item' : 'items'} saved
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-fade-in-up">
          {wishlist.map((product) => (
            <div 
              key={product._id} 
              className="bg-white dark:bg-surface-900 rounded-2xl border border-surface-200 dark:border-surface-800 overflow-hidden shadow-sm flex flex-col"
            >
              <div className="relative aspect-square overflow-hidden bg-surface-100 dark:bg-surface-800">
                <img
                  src={product.images?.[0]?.url || 'https://via.placeholder.com/400'}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => removeFromWishlist(product._id)}
                  className="absolute top-3 right-3 w-8 h-8 bg-white/80 dark:bg-surface-900/80 backdrop-blur rounded-full flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white transition-colors shadow-sm"
                  aria-label="Remove from wishlist"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              <div className="p-4 flex flex-col flex-grow">
                <Link to={`/product/${product._id}`} className="text-sm font-semibold text-surface-900 dark:text-white line-clamp-2 mb-2 hover:text-primary-600 transition-colors">
                  {product.name}
                </Link>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xl font-bold text-surface-900 dark:text-white">
                    {formatPrice(product.price)}
                  </span>
                  <span className={`text-sm font-medium ${product.stock > 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                    {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                  </span>
                </div>
                
                <div className="mt-auto">
                  <button
                    onClick={() => handleMoveToCart(product)}
                    disabled={product.stock <= 0}
                    className="w-full btn-secondary text-sm"
                  >
                    <ShoppingCart size={16} className="mr-2" />
                    {product.stock <= 0 ? 'Out of Stock' : 'Move to Cart'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Wishlist;

import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Star, ShoppingCart, Heart, Minus, Plus, Truck, RotateCcw, ShieldCheck } from 'lucide-react';
import { productsAPI } from '../services/api';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/common/Loader';
import ProductCard from '../components/product/ProductCard';
import toast from 'react-hot-toast';
import { formatPrice } from '../utils/formatPrice';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { isAuthenticated } = useAuth();
  
  const inWishlist = product ? isInWishlist(product._id) : false;

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        setLoading(true);
        const { data } = await productsAPI.getOne(id);
        setProduct(data.data);
        
        // Fetch related products (same category)
        if (data.data.category) {
          const relatedRes = await productsAPI.getAll({ 
            category: data.data.category._id,
            limit: 4 
          });
          setRelatedProducts(
            relatedRes.data.data.filter(p => p._id !== data.data._id).slice(0, 4)
          );
        }
      } catch (error) {
        toast.error('Failed to load product details');
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
    window.scrollTo(0, 0);
  }, [id]);

  const handleAddToCart = async () => {
    try {
      await addToCart(product._id, quantity);
      toast.success(`${quantity} ${quantity > 1 ? 'items' : 'item'} added to cart`);
    } catch (error) {
      toast.error('Failed to add to cart');
    }
  };

  const handleBuyNow = async () => {
    try {
      await addToCart(product._id, quantity);
      navigate('/cart');
    } catch (error) {
      toast.error('Failed to add to cart');
    }
  };

  const handleQuantity = (type) => {
    if (type === 'inc' && quantity < product.stock) {
      setQuantity(prev => prev + 1);
    } else if (type === 'dec' && quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  if (loading) return <Loader fullScreen />;
  if (!product) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center">
      <h2 className="text-2xl font-bold text-surface-900 dark:text-white mb-4">Product Not Found</h2>
      <Link to="/products" className="btn-primary">Back to Products</Link>
    </div>
  );

  const discount = product.comparePrice > product.price 
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100) 
    : 0;

  return (
    <div className="pt-24 pb-16 min-h-screen bg-surface-50 dark:bg-surface-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb */}
        <nav className="flex text-sm text-surface-500 dark:text-surface-400 mb-8 animate-fade-in-down">
          <Link to="/" className="hover:text-primary-600 transition-colors">Home</Link>
          <span className="mx-2">/</span>
          <Link to="/products" className="hover:text-primary-600 transition-colors">Products</Link>
          <span className="mx-2">/</span>
          {product.category && (
            <>
              <Link to={`/products?category=${product.category._id}`} className="hover:text-primary-600 transition-colors">
                {product.category.name}
              </Link>
              <span className="mx-2">/</span>
            </>
          )}
          <span className="text-surface-900 dark:text-white font-medium truncate max-w-[200px] sm:max-w-none">
            {product.name}
          </span>
        </nav>

        {/* Product Section */}
        <div className="bg-white dark:bg-surface-900 rounded-3xl p-6 lg:p-10 shadow-sm border border-surface-100 dark:border-surface-800 mb-16 animate-fade-in-up">
          <div className="lg:grid lg:grid-cols-2 lg:gap-12 xl:gap-16">
            
            {/* Image Gallery */}
            <div className="mb-10 lg:mb-0">
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-surface-100 dark:bg-surface-800 mb-4 border border-surface-200 dark:border-surface-700 group">
                <img
                  src={product.images[activeImage]?.url || 'https://via.placeholder.com/600'}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {discount > 0 && (
                  <div className="absolute top-4 left-4 bg-accent-500 text-white font-bold px-3 py-1.5 rounded-lg shadow-lg">
                    -{discount}% OFF
                  </div>
                )}
                {product.stock === 0 && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center backdrop-blur-sm">
                    <span className="bg-red-500 text-white font-bold px-6 py-2 rounded-xl text-lg transform -rotate-12">
                      OUT OF STOCK
                    </span>
                  </div>
                )}
              </div>
              
              {/* Thumbnails */}
              {product.images.length > 1 && (
                <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
                  {product.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImage(idx)}
                      className={`relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-all ${
                        activeImage === idx 
                          ? 'border-primary-500 ring-2 ring-primary-500/20 ring-offset-2 dark:ring-offset-surface-900' 
                          : 'border-transparent hover:border-surface-300 dark:hover:border-surface-600'
                      }`}
                    >
                      <img src={img.url} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="flex flex-col">
              {product.brand && (
                <span className="text-primary-600 dark:text-primary-400 font-bold uppercase tracking-wider text-sm mb-2">
                  {product.brand}
                </span>
              )}
              <h1 className="text-3xl sm:text-4xl font-bold text-surface-900 dark:text-white mb-4">
                {product.name}
              </h1>
              
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center text-amber-400">
                  <Star size={18} fill="currentColor" />
                  <span className="ml-1.5 text-sm font-bold text-surface-700 dark:text-surface-300">
                    {product.rating > 0 ? product.rating.toFixed(1) : 'No reviews'}
                  </span>
                </div>
                <span className="w-1 h-1 rounded-full bg-surface-300 dark:bg-surface-600"></span>
                <span className="text-sm text-surface-600 dark:text-surface-400 hover:text-primary-600 cursor-pointer transition-colors">
                  {product.numReviews} Reviews
                </span>
                <span className="w-1 h-1 rounded-full bg-surface-300 dark:bg-surface-600"></span>
                <span className={`text-sm font-medium ${product.stock > 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                  {product.stock > 0 ? `In Stock (${product.stock})` : 'Out of Stock'}
                </span>
              </div>

              <div className="flex items-end gap-3 mb-8">
                <span className="text-4xl font-extrabold text-surface-900 dark:text-white">
                  {formatPrice(product.price)}
                </span>
                {product.comparePrice > product.price && (
                  <span className="text-xl text-surface-400 line-through mb-1">
                    {formatPrice(product.comparePrice)}
                  </span>
                )}
              </div>

              <p className="text-surface-600 dark:text-surface-300 mb-8 leading-relaxed">
                {product.description}
              </p>

              {/* Action Area */}
              <div className="mt-auto border-t border-surface-200 dark:border-surface-800 pt-8">
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                  {/* Quantity Selector */}
                  <div className="flex items-center justify-between border border-surface-300 dark:border-surface-700 rounded-xl bg-surface-50 dark:bg-surface-900/50 p-1 w-full sm:w-32 h-14">
                    <button 
                      onClick={() => handleQuantity('dec')}
                      disabled={quantity <= 1}
                      className="w-10 h-10 flex items-center justify-center text-surface-600 dark:text-surface-400 hover:bg-white dark:hover:bg-surface-800 rounded-lg disabled:opacity-50 transition-colors"
                    >
                      <Minus size={18} />
                    </button>
                    <span className="font-semibold text-surface-900 dark:text-white">{quantity}</span>
                    <button 
                      onClick={() => handleQuantity('inc')}
                      disabled={quantity >= product.stock}
                      className="w-10 h-10 flex items-center justify-center text-surface-600 dark:text-surface-400 hover:bg-white dark:hover:bg-surface-800 rounded-lg disabled:opacity-50 transition-colors"
                    >
                      <Plus size={18} />
                    </button>
                  </div>

                  <button 
                    onClick={handleAddToCart}
                    disabled={product.stock === 0}
                    className="flex-1 btn-primary h-14 text-lg"
                  >
                    <ShoppingCart size={20} className="mr-2" />
                    {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                  </button>

                  <button 
                    onClick={handleBuyNow}
                    disabled={product.stock === 0}
                    className="flex-1 inline-flex items-center justify-center px-6 py-3 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-semibold rounded-xl shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:shadow-emerald-500/30 transform hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 ease-out focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 dark:focus:ring-offset-surface-900 h-14 text-lg"
                  >
                    Buy Now
                  </button>

                  <button 
                    onClick={() => {
                      toggleWishlist(product);
                      if (!inWishlist) toast.success('Added to wishlist');
                    }}
                    className={`w-14 h-14 flex items-center justify-center rounded-xl border-2 transition-all ${
                      inWishlist 
                        ? 'border-red-500 bg-red-50 dark:bg-red-900/20 text-red-500' 
                        : 'border-surface-200 dark:border-surface-700 hover:border-red-300 text-surface-500 hover:text-red-500 dark:text-surface-400 dark:hover:text-red-400'
                    }`}
                    aria-label="Toggle Wishlist"
                  >
                    <Heart size={24} fill={inWishlist ? 'currentColor' : 'none'} />
                  </button>
                </div>

                {/* Guarantees */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-surface-50 dark:bg-surface-900/50">
                    <Truck className="text-primary-500" size={24} />
                    <span className="text-sm font-medium text-surface-700 dark:text-surface-300">Free Delivery</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-surface-50 dark:bg-surface-900/50">
                    <RotateCcw className="text-primary-500" size={24} />
                    <span className="text-sm font-medium text-surface-700 dark:text-surface-300">30 Day Return</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-surface-50 dark:bg-surface-900/50">
                    <ShieldCheck className="text-primary-500" size={24} />
                    <span className="text-sm font-medium text-surface-700 dark:text-surface-300">1 Year Warranty</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-surface-900 dark:text-white mb-6">Customer Reviews</h2>
          <div className="bg-white dark:bg-surface-900 rounded-3xl p-6 lg:p-10 shadow-sm border border-surface-100 dark:border-surface-800">
            {product.reviews && product.reviews.length > 0 ? (
              <div className="space-y-6 divide-y divide-surface-100 dark:divide-surface-800">
                {product.reviews.map((review) => (
                  <div key={review._id} className="pt-6 first:pt-0">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary-500 to-accent-500 flex items-center justify-center text-white font-bold text-sm">
                          {review.user?.name?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-surface-900 dark:text-white">{review.user?.name || 'User'}</p>
                          <p className="text-xs text-surface-500 dark:text-surface-400">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex text-amber-400">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={14} fill={i < review.rating ? 'currentColor' : 'none'} className={i < review.rating ? '' : 'text-surface-300 dark:text-surface-600'} />
                        ))}
                      </div>
                    </div>
                    <p className="text-surface-700 dark:text-surface-300 text-sm mt-3 ml-13">
                      {review.comment}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-surface-500 dark:text-surface-400 mb-4">No reviews yet.</p>
                {isAuthenticated && (
                  <button className="btn-secondary">Be the first to review</button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-surface-900 dark:text-white mb-6">You Might Also Like</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {relatedProducts.map(prod => (
                <ProductCard key={prod._id} product={prod} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;

import { Link } from 'react-router-dom';
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import Loader from '../components/common/Loader';

const Cart = () => {
  const { cart, loading, updateQuantity, removeFromCart, clearCart } = useCart();

  const handleQuantity = (itemId, currentQuantity, type, stock) => {
    let newQuantity = currentQuantity;
    if (type === 'inc' && currentQuantity < stock) {
      newQuantity += 1;
    } else if (type === 'dec' && currentQuantity > 1) {
      newQuantity -= 1;
    }
    
    if (newQuantity !== currentQuantity) {
      updateQuantity(itemId, newQuantity);
    }
  };

  if (loading) return <Loader fullScreen />;

  if (!cart?.items?.length) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center pt-20 pb-12 px-4 sm:px-6">
        <div className="w-24 h-24 bg-surface-100 dark:bg-surface-800 rounded-full flex items-center justify-center text-surface-400 mb-6">
          <ShoppingBag size={40} />
        </div>
        <h2 className="text-3xl font-bold text-surface-900 dark:text-white mb-4">Your cart is empty</h2>
        <p className="text-surface-500 dark:text-surface-400 mb-8 max-w-md text-center">
          Looks like you haven't added anything to your cart yet. Discover our premium collection and find something you love.
        </p>
        <Link to="/products" className="btn-primary">
          Start Shopping
        </Link>
      </div>
    );
  }

  // Calculate totals
  const subtotal = cart.totalPrice || 0;
  const shipping = subtotal > 100 ? 0 : 10;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  return (
    <div className="pt-24 pb-16 min-h-screen bg-surface-50 dark:bg-surface-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex items-end justify-between mb-8 animate-fade-in-down">
          <div>
            <h1 className="text-3xl font-bold text-surface-900 dark:text-white">Shopping Cart</h1>
            <p className="mt-2 text-surface-500 dark:text-surface-400">
              {cart.items.length} {cart.items.length === 1 ? 'item' : 'items'} in your cart
            </p>
          </div>
          <button 
            onClick={clearCart}
            className="text-sm text-red-500 font-medium hover:text-red-600 transition-colors"
          >
            Clear Cart
          </button>
        </div>

        <div className="lg:grid lg:grid-cols-12 lg:gap-8 lg:items-start animate-fade-in-up">
          
          {/* Cart Items List */}
          <div className="lg:col-span-8 space-y-4">
            {cart.items.map((item) => (
              <div 
                key={item._id} 
                className="bg-white dark:bg-surface-900 rounded-2xl p-4 sm:p-6 border border-surface-200 dark:border-surface-800 flex flex-col sm:flex-row items-center gap-6 shadow-sm"
              >
                <div className="w-full sm:w-28 h-28 flex-shrink-0 bg-surface-100 dark:bg-surface-800 rounded-xl overflow-hidden border border-surface-200 dark:border-surface-700">
                  <img
                    src={item.product?.images?.[0]?.url || 'https://via.placeholder.com/150'}
                    alt={item.product?.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="flex-1 flex flex-col justify-between w-full">
                  <div className="flex justify-between items-start">
                    <Link to={`/product/${item.product?._id}`} className="text-lg font-semibold text-surface-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 transition-colors line-clamp-2 pr-4">
                      {item.product?.name}
                    </Link>
                    <button 
                      onClick={() => removeFromCart(item._id)}
                      className="text-surface-400 hover:text-red-500 transition-colors p-1"
                      aria-label="Remove item"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                  
                  <div className="mt-4 flex items-center justify-between w-full">
                    <div className="flex items-center border border-surface-300 dark:border-surface-700 rounded-xl bg-surface-50 dark:bg-surface-900 p-1">
                      <button 
                        onClick={() => handleQuantity(item._id, item.quantity, 'dec', item.product?.stock)}
                        disabled={item.quantity <= 1}
                        className="w-8 h-8 flex items-center justify-center text-surface-600 dark:text-surface-400 hover:bg-white dark:hover:bg-surface-800 rounded-lg disabled:opacity-50 transition-colors"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="w-10 text-center font-semibold text-surface-900 dark:text-white text-sm">
                        {item.quantity}
                      </span>
                      <button 
                        onClick={() => handleQuantity(item._id, item.quantity, 'inc', item.product?.stock)}
                        disabled={item.quantity >= (item.product?.stock || 0)}
                        className="w-8 h-8 flex items-center justify-center text-surface-600 dark:text-surface-400 hover:bg-white dark:hover:bg-surface-800 rounded-lg disabled:opacity-50 transition-colors"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                    <div className="text-right">
                      <span className="block text-lg font-bold text-surface-900 dark:text-white">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                      <span className="text-xs text-surface-500 dark:text-surface-400">
                        ${item.price.toFixed(2)} each
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-4 mt-8 lg:mt-0">
            <div className="glass-card p-6 lg:p-8 sticky top-28">
              <h2 className="text-xl font-bold text-surface-900 dark:text-white mb-6 border-b border-surface-200 dark:border-surface-800 pb-4">
                Order Summary
              </h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-surface-600 dark:text-surface-400">
                  <span>Subtotal</span>
                  <span className="font-medium text-surface-900 dark:text-white">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-surface-600 dark:text-surface-400">
                  <span>Shipping estimate</span>
                  <span className="font-medium text-surface-900 dark:text-white">
                    {shipping === 0 ? <span className="text-emerald-500 font-semibold">Free</span> : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between text-surface-600 dark:text-surface-400">
                  <span>Tax estimate</span>
                  <span className="font-medium text-surface-900 dark:text-white">${tax.toFixed(2)}</span>
                </div>
              </div>
              
              <div className="border-t border-surface-200 dark:border-surface-800 pt-4 mb-8">
                <div className="flex justify-between items-end">
                  <span className="text-lg font-bold text-surface-900 dark:text-white">Total</span>
                  <span className="text-2xl font-extrabold text-primary-600 dark:text-primary-400">${total.toFixed(2)}</span>
                </div>
              </div>
              
              <Link to="/checkout" className="btn-primary w-full text-lg shadow-glow">
                Checkout
                <ArrowRight size={20} className="ml-2" />
              </Link>
              
              <div className="mt-6 text-center text-sm text-surface-500 dark:text-surface-400 flex flex-col items-center gap-2">
                <p>or</p>
                <Link to="/products" className="text-primary-600 font-medium hover:text-primary-700 transition-colors">
                  Continue Shopping &rarr;
                </Link>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Cart;

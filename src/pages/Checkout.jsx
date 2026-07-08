import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { ordersAPI } from '../services/api';
import toast from 'react-hot-toast';
import { CheckCircle, CreditCard, MapPin, Package } from 'lucide-react';

const Checkout = () => {
  const { cart, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [shippingAddress, setShippingAddress] = useState({
    street: user?.address?.street || '',
    city: user?.address?.city || '',
    state: user?.address?.state || '',
    zipCode: user?.address?.zipCode || '',
    country: user?.address?.country || '',
  });
  const [paymentMethod, setPaymentMethod] = useState('card');

  useEffect(() => {
    if (!cart?.items?.length) {
      navigate('/cart');
    }
  }, [cart, navigate]);

  const subtotal = cart?.totalPrice || 0;
  const shipping = subtotal > 100 ? 0 : 10;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const handleAddressSubmit = (e) => {
    e.preventDefault();
    setStep(2);
  };

  const handlePlaceOrder = async () => {
    try {
      setLoading(true);
      const { data } = await ordersAPI.create({
        shippingAddress,
        paymentMethod
      });
      
      // Auto-clear cart context state since server clears it
      await clearCart();
      toast.success('Order placed successfully!');
      
      // Simulate payment processing step, then redirect
      setStep(3);
      setTimeout(() => {
        navigate(`/orders`);
      }, 3000);
      
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  if (!cart?.items?.length) return null;

  return (
    <div className="pt-24 pb-16 min-h-screen bg-surface-50 dark:bg-surface-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Progress Steps */}
        <div className="max-w-3xl mx-auto mb-10">
          <div className="flex items-center justify-between relative">
            <div className="absolute left-0 top-1/2 w-full h-0.5 bg-surface-200 dark:bg-surface-700 -z-10"></div>
            
            {[
              { num: 1, label: 'Shipping', icon: MapPin },
              { num: 2, label: 'Payment', icon: CreditCard },
              { num: 3, label: 'Success', icon: CheckCircle },
            ].map((s) => (
              <div key={s.num} className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-4 border-surface-50 dark:border-surface-950 ${
                  step >= s.num 
                    ? 'bg-primary-600 text-white' 
                    : 'bg-surface-200 dark:bg-surface-700 text-surface-500'
                }`}>
                  <s.icon size={18} />
                </div>
                <span className={`mt-2 text-xs font-semibold ${
                  step >= s.num ? 'text-primary-600 dark:text-primary-400' : 'text-surface-500'
                }`}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:grid lg:grid-cols-12 lg:gap-8 lg:items-start">
          
          {/* Main Form Area */}
          <div className="lg:col-span-8 space-y-6">
            
            {step === 1 && (
              <div className="glass-card p-6 md:p-8 animate-fade-in-up">
                <h2 className="text-xl font-bold text-surface-900 dark:text-white mb-6">Shipping Address</h2>
                <form onSubmit={handleAddressSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">Street Address</label>
                    <input
                      type="text"
                      required
                      value={shippingAddress.street}
                      onChange={(e) => setShippingAddress({...shippingAddress, street: e.target.value})}
                      className="input-field"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">City</label>
                      <input
                        type="text"
                        required
                        value={shippingAddress.city}
                        onChange={(e) => setShippingAddress({...shippingAddress, city: e.target.value})}
                        className="input-field"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">State/Province</label>
                      <input
                        type="text"
                        required
                        value={shippingAddress.state}
                        onChange={(e) => setShippingAddress({...shippingAddress, state: e.target.value})}
                        className="input-field"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">ZIP/Postal Code</label>
                      <input
                        type="text"
                        required
                        value={shippingAddress.zipCode}
                        onChange={(e) => setShippingAddress({...shippingAddress, zipCode: e.target.value})}
                        className="input-field"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">Country</label>
                      <input
                        type="text"
                        required
                        value={shippingAddress.country}
                        onChange={(e) => setShippingAddress({...shippingAddress, country: e.target.value})}
                        className="input-field"
                      />
                    </div>
                  </div>
                  
                  <div className="mt-8 flex justify-end">
                    <button type="submit" className="btn-primary">
                      Continue to Payment
                    </button>
                  </div>
                </form>
              </div>
            )}

            {step === 2 && (
              <div className="glass-card p-6 md:p-8 animate-fade-in-up">
                <h2 className="text-xl font-bold text-surface-900 dark:text-white mb-6">Payment Method</h2>
                
                <div className="space-y-4">
                  <label className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-colors ${
                    paymentMethod === 'card' ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/10' : 'border-surface-200 dark:border-surface-700'
                  }`}>
                    <input 
                      type="radio" 
                      name="payment" 
                      value="card" 
                      checked={paymentMethod === 'card'} 
                      onChange={() => setPaymentMethod('card')}
                      className="text-primary-600 focus:ring-primary-500"
                    />
                    <div>
                      <p className="font-semibold text-surface-900 dark:text-white">Credit / Debit Card</p>
                      <p className="text-sm text-surface-500">Secure payment via Stripe (Mocked)</p>
                    </div>
                  </label>
                  
                  <label className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-colors ${
                    paymentMethod === 'paypal' ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/10' : 'border-surface-200 dark:border-surface-700'
                  }`}>
                    <input 
                      type="radio" 
                      name="payment" 
                      value="paypal" 
                      checked={paymentMethod === 'paypal'} 
                      onChange={() => setPaymentMethod('paypal')}
                      className="text-primary-600 focus:ring-primary-500"
                    />
                    <div>
                      <p className="font-semibold text-surface-900 dark:text-white">PayPal</p>
                    </div>
                  </label>
                </div>
                
                <div className="mt-8 flex justify-between">
                  <button onClick={() => setStep(1)} className="btn-secondary">
                    Back
                  </button>
                  <button 
                    onClick={handlePlaceOrder} 
                    disabled={loading}
                    className="btn-primary shadow-glow"
                  >
                    {loading ? 'Processing...' : `Pay $${total.toFixed(2)}`}
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="glass-card p-12 text-center flex flex-col items-center animate-bounce-in">
                <div className="w-20 h-20 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mb-6">
                  <CheckCircle size={40} />
                </div>
                <h2 className="text-3xl font-bold text-surface-900 dark:text-white mb-2">Order Confirmed!</h2>
                <p className="text-surface-500 mb-8 max-w-sm">
                  Thank you for your purchase. We are processing your order and will redirect you to your order history shortly.
                </p>
                <div className="w-6 h-6 border-2 border-primary-500/30 border-t-primary-500 rounded-full animate-spin"></div>
              </div>
            )}

          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-4 mt-8 lg:mt-0">
            <div className="glass-card p-6 sticky top-28">
              <h2 className="text-lg font-bold text-surface-900 dark:text-white mb-4 border-b border-surface-200 dark:border-surface-800 pb-4 flex items-center gap-2">
                <Package size={20} /> Order Items ({cart.items.length})
              </h2>
              
              <div className="space-y-4 mb-6 max-h-[40vh] overflow-y-auto custom-scrollbar pr-2">
                {cart.items.map((item) => (
                  <div key={item._id} className="flex gap-4">
                    <img 
                      src={item.product?.images?.[0]?.url} 
                      alt="" 
                      className="w-16 h-16 rounded-lg object-cover bg-surface-100"
                    />
                    <div className="flex-1 text-sm">
                      <p className="font-semibold text-surface-900 dark:text-white line-clamp-1">{item.product?.name}</p>
                      <p className="text-surface-500">Qty: {item.quantity}</p>
                      <p className="font-medium text-primary-600">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="space-y-3 pt-4 border-t border-surface-200 dark:border-surface-800">
                <div className="flex justify-between text-sm text-surface-600 dark:text-surface-400">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-surface-600 dark:text-surface-400">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between text-sm text-surface-600 dark:text-surface-400">
                  <span>Tax</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-surface-900 dark:text-white pt-2 border-t border-surface-200 dark:border-surface-800">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Checkout;

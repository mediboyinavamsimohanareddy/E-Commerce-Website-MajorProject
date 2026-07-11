import { useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { CheckCircle, Package, ArrowRight, ChevronRight, ShoppingBag } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const OrderSuccess = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId');
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // If not authenticated or no orderId, redirect home
    if (!isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  if (!orderId) {
    return (
      <div className="pt-32 pb-16 min-h-[80vh] flex flex-col items-center justify-center bg-surface-50 dark:bg-surface-950">
        <h1 className="text-2xl font-bold mb-4">Invalid Order Session</h1>
        <Link to="/" className="btn-primary">Return Home</Link>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-16 min-h-screen bg-surface-50 dark:bg-surface-950 flex flex-col items-center justify-center px-4">
      
      <div className="max-w-2xl w-full bg-white dark:bg-surface-900 rounded-3xl p-8 sm:p-12 shadow-xl border border-surface-200 dark:border-surface-800 animate-fade-in-up text-center relative overflow-hidden">
        
        {/* Background Decoration */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-400 via-emerald-500 to-emerald-600"></div>
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-primary-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col items-center relative z-10">
          <div className="w-24 h-24 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-500 rounded-full flex items-center justify-center mb-8 shadow-inner animate-bounce-in">
            <CheckCircle size={48} className="drop-shadow-sm" />
          </div>
          
          <h1 className="text-4xl font-extrabold text-surface-900 dark:text-white mb-4 tracking-tight">
            Order Confirmed!
          </h1>
          
          <p className="text-lg text-surface-600 dark:text-surface-300 mb-2">
            Thank you for your purchase. Your order has been placed successfully.
          </p>
          <p className="text-surface-500 dark:text-surface-400 mb-8">
            We will send a confirmation email with your order details and tracking information shortly.
          </p>

          <div className="bg-surface-50 dark:bg-surface-800 rounded-2xl p-6 w-full mb-10 border border-surface-200 dark:border-surface-700 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-left flex-1">
              <p className="text-sm font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wider mb-1">Order Number</p>
              <p className="text-xl font-bold text-primary-600 dark:text-primary-400 break-all">#{orderId.toUpperCase()}</p>
            </div>
            <div className="h-12 w-px bg-surface-300 dark:bg-surface-600 hidden sm:block"></div>
            <Link to={`/orders`} className="flex items-center text-sm font-semibold text-primary-600 dark:text-primary-400 hover:text-primary-700 transition-colors group">
              Track Order
              <ChevronRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
            <Link to="/orders" className="btn-secondary h-14 w-full group">
              <Package size={20} className="mr-2 text-surface-500 group-hover:text-surface-700 dark:group-hover:text-surface-200 transition-colors" />
              View Orders
            </Link>
            <Link to="/products" className="btn-primary h-14 w-full group shadow-glow">
              <ShoppingBag size={20} className="mr-2" />
              Continue Shopping
            </Link>
          </div>
        </div>

      </div>

    </div>
  );
};

export default OrderSuccess;

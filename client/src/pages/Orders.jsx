import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, ChevronRight } from 'lucide-react';
import { ordersAPI } from '../services/api';
import Loader from '../components/common/Loader';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await ordersAPI.getMyOrders();
        setOrders(data.data);
      } catch (error) {
        console.error('Failed to load orders', error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300';
      case 'processing': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300';
      case 'shipped': return 'bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300';
      case 'delivered': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300';
      case 'cancelled': return 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300';
      default: return 'bg-surface-100 text-surface-700';
    }
  };

  if (loading) return <Loader fullScreen />;

  return (
    <div className="pt-24 pb-16 min-h-screen bg-surface-50 dark:bg-surface-950">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <h1 className="text-3xl font-bold text-surface-900 dark:text-white mb-8 animate-fade-in-down">
          Order History
        </h1>

        {orders.length === 0 ? (
          <div className="glass-card text-center py-16 animate-fade-in-up">
            <div className="w-20 h-20 bg-surface-100 dark:bg-surface-800 rounded-full flex items-center justify-center text-surface-400 mx-auto mb-4">
              <Package size={32} />
            </div>
            <h3 className="text-xl font-bold text-surface-900 dark:text-white mb-2">No orders found</h3>
            <p className="text-surface-500 mb-6">Looks like you haven't made any purchases yet.</p>
            <Link to="/products" className="btn-primary">Start Shopping</Link>
          </div>
        ) : (
          <div className="space-y-6 animate-fade-in-up">
            {orders.map((order) => (
              <div key={order._id} className="glass-card overflow-hidden">
                {/* Order Header */}
                <div className="bg-surface-100/50 dark:bg-surface-800/50 border-b border-surface-200 dark:border-surface-800 px-6 py-4 flex flex-wrap gap-4 items-center justify-between">
                  <div>
                    <p className="text-sm text-surface-500">Order ID</p>
                    <p className="font-mono text-sm font-medium text-surface-900 dark:text-white">#{order._id.substring(0, 8)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-surface-500">Date</p>
                    <p className="text-sm font-medium text-surface-900 dark:text-white">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-surface-500">Total</p>
                    <p className="text-sm font-bold text-primary-600 dark:text-primary-400">
                      ${order.totalPrice.toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                </div>
                
                {/* Order Items preview */}
                <div className="p-6">
                  <div className="flex flex-wrap gap-4">
                    {order.items.slice(0, 4).map((item, idx) => (
                      <div key={idx} className="relative group cursor-pointer" title={item.name}>
                        <img 
                          src={item.image || 'https://via.placeholder.com/60'} 
                          alt="" 
                          className="w-16 h-16 rounded-lg object-cover border border-surface-200 dark:border-surface-700"
                        />
                        <div className="absolute -top-2 -right-2 bg-surface-900 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center">
                          {item.quantity}
                        </div>
                      </div>
                    ))}
                    {order.items.length > 4 && (
                      <div className="w-16 h-16 rounded-lg bg-surface-100 dark:bg-surface-800 flex items-center justify-center text-sm font-medium text-surface-500">
                        +{order.items.length - 4}
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Actions */}
                <div className="px-6 py-4 bg-surface-50 dark:bg-surface-900/30 border-t border-surface-200 dark:border-surface-800 flex justify-end">
                  <button className="text-sm font-semibold text-primary-600 hover:text-primary-700 flex items-center gap-1">
                    View Details <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;

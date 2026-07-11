import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Package, CheckCircle, Truck, MapPin, ArrowLeft, XCircle } from 'lucide-react';
import { ordersAPI } from '../services/api';
import Loader from '../components/common/Loader';
import toast from 'react-hot-toast';

const TrackOrder = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const { data } = await ordersAPI.getOne(id);
        setOrder(data.data);
      } catch (error) {
        toast.error('Failed to load order tracking details');
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  if (loading) return <Loader fullScreen />;

  if (!order) {
    return (
      <div className="pt-24 pb-16 min-h-[60vh] flex flex-col items-center justify-center text-center">
        <h2 className="text-2xl font-bold text-surface-900 dark:text-white mb-4">Order Not Found</h2>
        <Link to="/orders" className="btn-primary">Back to Orders</Link>
      </div>
    );
  }

  // Determine current step based on status
  const statuses = ['pending', 'confirmed', 'packed', 'shipped', 'out for delivery', 'delivered', 'cancelled'];
  const statusIndex = statuses.indexOf(order.status);
  const isCancelled = order.status === 'cancelled';

  // Simplified UI milestones: Placed -> Confirmed -> Shipped -> Delivered
  const milestones = [
    { title: 'Order Placed', icon: Package, isActive: true },
    { title: 'Confirmed', icon: CheckCircle, isActive: statusIndex >= 1 && !isCancelled },
    { title: 'Shipped', icon: Truck, isActive: statusIndex >= 3 && !isCancelled },
    { title: 'Delivered', icon: MapPin, isActive: statusIndex >= 5 && !isCancelled }
  ];

  return (
    <div className="pt-24 pb-16 min-h-screen bg-surface-50 dark:bg-surface-950">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-6 animate-fade-in-down">
          <Link to="/orders" className="text-sm font-semibold text-surface-500 hover:text-primary-600 flex items-center gap-1 mb-4">
            <ArrowLeft size={16} /> Back to My Orders
          </Link>
          <h1 className="text-3xl font-bold text-surface-900 dark:text-white">Track Order</h1>
          {order.trackingId && (
            <p className="mt-2 text-surface-500 dark:text-surface-400 font-mono text-sm">
              Tracking ID: {order.trackingId}
            </p>
          )}
        </div>

        <div className="glass-card p-6 md:p-10 animate-fade-in-up">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 pb-6 border-b border-surface-200 dark:border-surface-800 gap-4">
            <div>
              <p className="text-sm text-surface-500">Order #{order._id}</p>
              <p className="font-semibold text-surface-900 dark:text-white text-lg">
                Estimated Delivery: {new Date(new Date(order.createdAt).getTime() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString()}
              </p>
            </div>
            <div>
              <span className={`px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wider ${
                isCancelled ? 'bg-red-100 text-red-700' : 
                order.status === 'delivered' ? 'bg-emerald-100 text-emerald-700' : 'bg-primary-100 text-primary-700'
              }`}>
                {order.status}
              </span>
            </div>
          </div>

          {isCancelled ? (
            <div className="py-12 flex flex-col items-center justify-center text-center">
              <div className="w-20 h-20 bg-red-100 text-red-500 rounded-full flex items-center justify-center mb-6">
                <XCircle size={40} />
              </div>
              <h2 className="text-2xl font-bold text-surface-900 dark:text-white mb-2">Order Cancelled</h2>
              <p className="text-surface-500">This order has been cancelled and cannot be delivered.</p>
            </div>
          ) : (
            <div className="relative py-8 md:py-12 px-4 md:px-8">
              
              {/* Progress Line */}
              <div className="absolute top-1/2 md:top-24 left-8 md:left-[10%] right-8 md:right-[10%] h-1 bg-surface-200 dark:bg-surface-800 -translate-y-1/2 z-0 hidden md:block">
                <div 
                  className="h-full bg-emerald-500 transition-all duration-1000 ease-out"
                  style={{ width: `${(milestones.filter(m => m.isActive).length - 1) / (milestones.length - 1) * 100}%` }}
                ></div>
              </div>

              {/* Milestones */}
              <div className="relative z-10 flex flex-col md:flex-row justify-between gap-8 md:gap-0">
                {milestones.map((milestone, idx) => {
                  const Icon = milestone.icon;
                  return (
                    <div key={idx} className="flex md:flex-col items-center gap-4 md:gap-3 text-center">
                      <div className={`relative w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center border-4 transition-all duration-500 ${
                        milestone.isActive 
                          ? 'bg-emerald-500 border-emerald-100 dark:border-emerald-900 text-white shadow-lg shadow-emerald-500/30 scale-110' 
                          : 'bg-surface-100 dark:bg-surface-800 border-surface-50 dark:border-surface-900 text-surface-400'
                      }`}>
                        <Icon size={idx === 0 ? 20 : 24} className={!milestone.isActive ? 'opacity-50' : ''} />
                      </div>
                      <div className="text-left md:text-center">
                        <p className={`font-bold text-sm md:text-base ${milestone.isActive ? 'text-surface-900 dark:text-white' : 'text-surface-400'}`}>
                          {milestone.title}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="mt-12 bg-surface-50 dark:bg-surface-900/50 rounded-2xl p-6 border border-surface-200 dark:border-surface-800">
            <h3 className="text-lg font-bold text-surface-900 dark:text-white mb-4">Shipping Details</h3>
            <p className="text-surface-600 dark:text-surface-300 font-medium">{order.user.name}</p>
            <p className="text-surface-500">{order.shippingAddress.street}</p>
            <p className="text-surface-500">{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}</p>
            <p className="text-surface-500">{order.shippingAddress.country}</p>
            {order.shippingAddress.phone && (
              <p className="text-surface-500 mt-1">Phone: {order.shippingAddress.phone}</p>
            )}
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default TrackOrder;

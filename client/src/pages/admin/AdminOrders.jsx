import { useState, useEffect } from 'react';
import { ordersAPI } from '../../services/api';
import Loader from '../../components/common/Loader';
import toast from 'react-hot-toast';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data } = await ordersAPI.getAllAdmin({ limit: 50 });
      setOrders(data.data);
    } catch (error) {
      toast.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await ordersAPI.updateStatus(id, newStatus);
      toast.success(`Order status updated to ${newStatus}`);
      fetchOrders(); // Refresh to get updated data
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const statusOptions = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return 'bg-amber-100 text-amber-700';
      case 'processing': return 'bg-blue-100 text-blue-700';
      case 'shipped': return 'bg-purple-100 text-purple-700';
      case 'delivered': return 'bg-emerald-100 text-emerald-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-surface-100 text-surface-700';
    }
  };

  return (
    <div className="animate-fade-in-up">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-surface-900 dark:text-white">Manage Orders</h1>
      </div>

      <div className="bg-white dark:bg-surface-900 rounded-2xl border border-surface-200 dark:border-surface-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-surface-50 dark:bg-surface-800/50 text-surface-500 dark:text-surface-400 font-semibold uppercase tracking-wider text-xs">
              <tr>
                <th className="px-6 py-4">Order ID</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Total</th>
                <th className="px-6 py-4">Payment</th>
                <th className="px-6 py-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-200 dark:divide-surface-700/50">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-10 text-center"><Loader /></td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-10 text-center text-surface-500">No orders found.</td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order._id} className="hover:bg-surface-50 dark:hover:bg-surface-800/50 transition-colors">
                    <td className="px-6 py-4 font-mono text-xs font-medium text-surface-900 dark:text-white">
                      {order._id}
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-surface-900 dark:text-white">{order.user?.name || 'Guest'}</p>
                      <p className="text-xs text-surface-500">{order.user?.email}</p>
                    </td>
                    <td className="px-6 py-4 text-surface-600 dark:text-surface-300">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 font-bold text-surface-900 dark:text-white">
                      ${order.totalPrice.toFixed(2)}
                    </td>
                    <td className="px-6 py-4">
                      <span className="capitalize text-surface-600 dark:text-surface-300 text-xs font-semibold px-2 py-1 bg-surface-100 dark:bg-surface-800 rounded-md">
                        {order.paymentInfo?.method || 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <select 
                        value={order.status}
                        onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                        className={`text-xs font-bold uppercase tracking-wider rounded-full px-3 py-1.5 appearance-none cursor-pointer outline-none ${getStatusColor(order.status)}`}
                      >
                        {statusOptions.map(status => (
                          <option key={status} value={status} className="bg-white text-surface-900">{status}</option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminOrders;

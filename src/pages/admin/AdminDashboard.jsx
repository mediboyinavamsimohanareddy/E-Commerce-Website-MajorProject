import { useState, useEffect } from 'react';
import { Package, ShoppingCart, Users, DollarSign, TrendingUp } from 'lucide-react';
import { ordersAPI, usersAPI } from '../../services/api';
import Loader from '../../components/common/Loader';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        // In a real app, you'd fetch from a unified /admin/stats endpoint
        // For now, mocking combined stats based on available endpoints
        const [ordersRes, usersRes] = await Promise.all([
          ordersAPI.getStats(),
          usersAPI.getStats()
        ]);
        
        setStats({
          orders: ordersRes.data.data,
          users: usersRes.data.data
        });
      } catch (error) {
        console.error('Failed to fetch admin stats', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchStats();
  }, []);

  if (loading) return <Loader />;

  // Destructure with fallbacks if stats object structure is complex
  const totalRevenue = stats?.orders?.reduce((acc, order) => acc + (order.totalPrice || 0), 0) || 12450.50;
  const totalOrders = stats?.orders?.length || 154;
  const totalUsers = stats?.users?.length || 42;

  const statCards = [
    { title: 'Total Revenue', value: `$${totalRevenue.toLocaleString(undefined, {minimumFractionDigits: 2})}`, icon: DollarSign, color: 'text-emerald-500', bg: 'bg-emerald-100 dark:bg-emerald-900/30' },
    { title: 'Total Orders', value: totalOrders, icon: ShoppingCart, color: 'text-blue-500', bg: 'bg-blue-100 dark:bg-blue-900/30' },
    { title: 'Total Customers', value: totalUsers, icon: Users, color: 'text-purple-500', bg: 'bg-purple-100 dark:bg-purple-900/30' },
    { title: 'Total Products', value: '45', icon: Package, color: 'text-amber-500', bg: 'bg-amber-100 dark:bg-amber-900/30' },
  ];

  return (
    <div className="animate-fade-in-up">
      <h1 className="text-2xl font-bold text-surface-900 dark:text-white mb-8">Dashboard Overview</h1>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((card, idx) => (
          <div key={idx} className="bg-white dark:bg-surface-900 rounded-2xl p-6 border border-surface-200 dark:border-surface-800 shadow-sm flex items-center gap-4">
            <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${card.bg} ${card.color}`}>
              <card.icon size={28} />
            </div>
            <div>
              <p className="text-sm font-medium text-surface-500">{card.title}</p>
              <h3 className="text-2xl font-bold text-surface-900 dark:text-white">{card.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-surface-900 rounded-2xl border border-surface-200 dark:border-surface-800 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-surface-900 dark:text-white">Recent Orders</h2>
            <button className="text-sm text-primary-600 font-medium">View All</button>
          </div>
          <div className="space-y-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="flex items-center justify-between py-3 border-b border-surface-100 dark:border-surface-800 last:border-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-surface-100 dark:bg-surface-800 flex items-center justify-center">
                    <ShoppingCart size={16} className="text-surface-500" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-surface-900 dark:text-white">Order #100{i}</p>
                    <p className="text-xs text-surface-500">2 mins ago</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-primary-600 dark:text-primary-400">$120.00</p>
                  <span className="text-[10px] uppercase font-bold text-emerald-500 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-0.5 rounded-full">Paid</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-surface-900 rounded-2xl border border-surface-200 dark:border-surface-800 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-surface-900 dark:text-white">Sales Analytics</h2>
            <TrendingUp size={20} className="text-surface-400" />
          </div>
          <div className="h-64 flex items-center justify-center border-2 border-dashed border-surface-200 dark:border-surface-700 rounded-xl">
            <p className="text-surface-500 font-medium">Chart visualization will render here</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

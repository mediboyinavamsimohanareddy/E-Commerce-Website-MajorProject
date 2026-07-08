import { useState, useEffect } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  Settings, 
  LogOut,
  Menu,
  X,
  Plus
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isAdmin) {
      navigate('/');
    }
  }, [isAdmin, navigate]);

  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location]);

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard, exact: true },
    { name: 'Products', path: '/admin/products', icon: Package },
    { name: 'Add Product', path: '/admin/products/add', icon: Plus },
    { name: 'Orders', path: '/admin/orders', icon: ShoppingCart },
    { name: 'Users', path: '/admin/users', icon: Users },
    { name: 'Settings', path: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-950 flex flex-col pt-16 md:pt-20">
      
      {/* Mobile Sidebar Toggle */}
      <div className="lg:hidden bg-white dark:bg-surface-900 border-b border-surface-200 dark:border-surface-800 p-4 flex items-center justify-between">
        <h1 className="text-xl font-bold text-surface-900 dark:text-white">Admin Panel</h1>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 text-surface-600 dark:text-surface-300">
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <div className="flex-1 flex overflow-hidden">
        
        {/* Sidebar Navigation */}
        <aside className={`
          fixed lg:static inset-y-0 left-0 z-40 w-64 bg-white dark:bg-surface-900 border-r border-surface-200 dark:border-surface-800 transform transition-transform duration-300 ease-in-out lg:transform-none mt-16 md:mt-20 lg:mt-0 flex flex-col h-[calc(100vh-4rem)] md:h-[calc(100vh-5rem)]
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
          <div className="p-6">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-primary-100 dark:bg-primary-900/30 text-primary-600 flex items-center justify-center font-bold">
                A
              </div>
              <div>
                <p className="font-bold text-surface-900 dark:text-white">Admin Panel</p>
                <p className="text-xs text-surface-500">{user?.name}</p>
              </div>
            </div>

            <nav className="space-y-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.path}
                  end={item.exact}
                  className={({ isActive }) => `
                    flex items-center gap-3 px-4 py-3 rounded-xl transition-all
                    ${isActive 
                      ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 font-medium' 
                      : 'text-surface-600 dark:text-surface-400 hover:bg-surface-50 dark:hover:bg-surface-800 hover:text-surface-900 dark:hover:text-white'}
                  `}
                >
                  <item.icon size={20} />
                  {item.name}
                </NavLink>
              ))}
            </nav>
          </div>

          <div className="mt-auto p-6 border-t border-surface-200 dark:border-surface-800">
            <button 
              onClick={() => { logout(); navigate('/'); }}
              className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors"
            >
              <LogOut size={20} />
              Logout Admin
            </button>
          </div>
        </aside>

        {/* Overlay for mobile */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-30 lg:hidden mt-16 md:mt-20"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-6xl mx-auto">
            <Outlet />
          </div>
        </main>

      </div>
    </div>
  );
};

export default AdminLayout;

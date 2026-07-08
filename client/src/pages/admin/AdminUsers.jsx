import { useState, useEffect } from 'react';
import { Users, Trash2 } from 'lucide-react';
import { usersAPI } from '../../services/api';
import Loader from '../../components/common/Loader';
import toast from 'react-hot-toast';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const { data } = await usersAPI.getAll({ limit: 50 });
        setUsers(data.data);
      } catch (error) {
        toast.error('Failed to fetch users');
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await usersAPI.delete(id);
        toast.success('User deleted successfully');
        setUsers(users.filter(u => u._id !== id));
      } catch (error) {
        toast.error('Failed to delete user');
      }
    }
  };

  const handleRoleChange = async (id, role) => {
    try {
      await usersAPI.update(id, { role });
      toast.success(`User role updated to ${role}`);
      setUsers(users.map(u => u._id === id ? { ...u, role } : u));
    } catch (error) {
      toast.error('Failed to update role');
    }
  };

  return (
    <div className="animate-fade-in-up">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-surface-900 dark:text-white">Manage Users</h1>
      </div>

      <div className="bg-white dark:bg-surface-900 rounded-2xl border border-surface-200 dark:border-surface-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-surface-50 dark:bg-surface-800/50 text-surface-500 dark:text-surface-400 font-semibold uppercase tracking-wider text-xs">
              <tr>
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Joined</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-200 dark:divide-surface-700/50">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-10 text-center"><Loader /></td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-10 text-center text-surface-500">No users found.</td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user._id} className="hover:bg-surface-50 dark:hover:bg-surface-800/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white font-bold text-sm shadow-sm">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <p className="font-medium text-surface-900 dark:text-white">{user.name}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-surface-600 dark:text-surface-300">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 text-surface-600 dark:text-surface-300">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <select 
                        value={user.role}
                        onChange={(e) => handleRoleChange(user._id, e.target.value)}
                        className={`text-xs font-bold uppercase tracking-wider rounded-full px-3 py-1.5 appearance-none cursor-pointer outline-none ${
                          user.role === 'admin' ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400' : 'bg-surface-100 text-surface-700 dark:bg-surface-800 dark:text-surface-300'
                        }`}
                      >
                        <option value="user" className="bg-white text-surface-900">User</option>
                        <option value="admin" className="bg-white text-surface-900">Admin</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => handleDelete(user._id)}
                        className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
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

export default AdminUsers;

import { useState } from 'react';
import { User, Mail, Phone, MapPin, Save, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    street: user?.address?.street || '',
    city: user?.address?.city || '',
    state: user?.address?.state || '',
    zipCode: user?.address?.zipCode || '',
    country: user?.address?.country || '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await updateProfile({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: {
          street: formData.street,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          country: formData.country,
        }
      });
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-24 pb-16 min-h-screen bg-surface-50 dark:bg-surface-950">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-8 flex items-center gap-4 animate-fade-in-down">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-3xl font-bold text-surface-900 dark:text-white">My Profile</h1>
            <p className="text-surface-500 dark:text-surface-400">Manage your account information and preferences</p>
          </div>
        </div>

        <div className="glass-card p-6 md:p-8 animate-fade-in-up">
          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* Personal Info */}
            <div>
              <h2 className="text-lg font-bold text-surface-900 dark:text-white mb-4 flex items-center gap-2 border-b border-surface-200 dark:border-surface-700 pb-2">
                <User size={20} className="text-primary-500" /> Personal Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">Full Name</label>
                  <input type="text" name="name" value={formData.name} onChange={handleChange} className="input-field" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">Email Address</label>
                  <div className="relative">
                    <input type="email" name="email" value={formData.email} onChange={handleChange} className="input-field pr-10" required />
                    <Shield size={16} className="absolute right-3 top-3.5 text-emerald-500" title="Verified" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">Phone Number</label>
                  <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="input-field" />
                </div>
              </div>
            </div>

            {/* Address */}
            <div>
              <h2 className="text-lg font-bold text-surface-900 dark:text-white mb-4 flex items-center gap-2 border-b border-surface-200 dark:border-surface-700 pb-2">
                <MapPin size={20} className="text-primary-500" /> Default Shipping Address
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">Street Address</label>
                  <input type="text" name="street" value={formData.street} onChange={handleChange} className="input-field" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">City</label>
                    <input type="text" name="city" value={formData.city} onChange={handleChange} className="input-field" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">State/Province</label>
                    <input type="text" name="state" value={formData.state} onChange={handleChange} className="input-field" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">ZIP/Postal Code</label>
                    <input type="text" name="zipCode" value={formData.zipCode} onChange={handleChange} className="input-field" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">Country</label>
                    <input type="text" name="country" value={formData.country} onChange={handleChange} className="input-field" />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-surface-200 dark:border-surface-800">
              <button type="submit" disabled={loading} className="btn-primary shadow-glow flex items-center gap-2">
                {loading ? 'Saving...' : <><Save size={18} /> Save Changes</>}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;

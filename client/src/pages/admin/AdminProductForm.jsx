import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Upload, X, ArrowLeft, Save } from 'lucide-react';
import { productsAPI, categoriesAPI } from '../../services/api';
import toast from 'react-hot-toast';
import Loader from '../../components/common/Loader';

const AdminProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    comparePrice: '',
    category: '',
    brand: '',
    stock: '',
    featured: false,
    existingImages: []
  });

  useEffect(() => {
    const initForm = async () => {
      try {
        const catRes = await categoriesAPI.getAll();
        setCategories(catRes.data.data);

        if (isEdit) {
          const { data } = await productsAPI.getOne(id);
          const p = data.data;
          setFormData({
            name: p.name,
            description: p.description,
            price: p.price,
            comparePrice: p.comparePrice || '',
            category: p.category?._id || '',
            brand: p.brand || '',
            stock: p.stock,
            featured: p.featured,
            existingImages: p.images || []
          });
        }
      } catch (error) {
        toast.error('Failed to load data');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    initForm();
  }, [id, isEdit]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 5) {
      toast.error('Maximum 5 images allowed');
      return;
    }
    setImageFiles(files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      
      const productData = {
        name: formData.name,
        description: formData.description,
        price: Number(formData.price),
        comparePrice: formData.comparePrice ? Number(formData.comparePrice) : undefined,
        category: formData.category,
        brand: formData.brand,
        stock: Number(formData.stock),
        featured: formData.featured,
      };

      let productId = id;

      if (isEdit) {
        await productsAPI.update(id, productData);
        toast.success('Product updated successfully');
      } else {
        const { data } = await productsAPI.create(productData);
        productId = data.data._id;
        toast.success('Product created successfully');
      }

      // Handle Image Uploads if any new files selected
      if (imageFiles.length > 0) {
        const uploadForm = new FormData();
        imageFiles.forEach(file => {
          uploadForm.append('images', file);
        });
        await productsAPI.uploadImages(productId, uploadForm);
        toast.success('Images uploaded successfully');
      }

      navigate('/admin/products');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save product');
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="max-w-4xl mx-auto animate-fade-in-up">
      <div className="flex items-center gap-4 mb-8">
        <Link to="/admin/products" className="p-2 bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800 rounded-xl hover:bg-surface-50 dark:hover:bg-surface-800 transition-colors text-surface-600 dark:text-surface-300">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-2xl font-bold text-surface-900 dark:text-white">
          {isEdit ? 'Edit Product' : 'Add New Product'}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Basic Info */}
        <div className="glass-card p-6 md:p-8">
          <h2 className="text-lg font-bold text-surface-900 dark:text-white mb-6">Basic Information</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">Product Name</label>
              <input type="text" name="name" required value={formData.name} onChange={handleChange} className="input-field" placeholder="e.g., iPhone 15 Pro Max" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">Category</label>
                <select name="category" required value={formData.category} onChange={handleChange} className="input-field appearance-none">
                  <option value="" disabled>Select a category</option>
                  {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">Brand</label>
                <input type="text" name="brand" required value={formData.brand} onChange={handleChange} className="input-field" placeholder="e.g., Apple" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">Description</label>
              <textarea name="description" required value={formData.description} onChange={handleChange} rows="5" className="input-field resize-none" placeholder="Product description..." />
            </div>
          </div>
        </div>

        {/* Pricing & Inventory */}
        <div className="glass-card p-6 md:p-8">
          <h2 className="text-lg font-bold text-surface-900 dark:text-white mb-6">Pricing & Inventory</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">Price ($)</label>
              <input type="number" step="0.01" min="0" name="price" required value={formData.price} onChange={handleChange} className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">Compare at Price ($)</label>
              <input type="number" step="0.01" min="0" name="comparePrice" value={formData.comparePrice} onChange={handleChange} className="input-field" placeholder="Optional" />
            </div>
            <div>
              <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">Stock Quantity</label>
              <input type="number" min="0" name="stock" required value={formData.stock} onChange={handleChange} className="input-field" />
            </div>
          </div>
          <div className="pt-2">
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" name="featured" checked={formData.featured} onChange={handleChange} className="w-5 h-5 rounded border-surface-300 text-primary-600 focus:ring-primary-500" />
              <span className="text-sm font-medium text-surface-700 dark:text-surface-300">Feature this product on homepage</span>
            </label>
          </div>
        </div>

        {/* Images */}
        <div className="glass-card p-6 md:p-8">
          <h2 className="text-lg font-bold text-surface-900 dark:text-white mb-6">Product Images</h2>
          
          {isEdit && formData.existingImages.length > 0 && (
            <div className="mb-6">
              <p className="text-sm text-surface-500 mb-3">Current Images (Re-uploading new images will replace these)</p>
              <div className="flex gap-4 overflow-x-auto pb-2">
                {formData.existingImages.map((img, idx) => (
                  <img key={idx} src={img.url} alt="" className="w-24 h-24 object-cover rounded-lg border border-surface-200 dark:border-surface-700" />
                ))}
              </div>
            </div>
          )}

          <div className="border-2 border-dashed border-surface-300 dark:border-surface-700 rounded-2xl p-8 text-center hover:bg-surface-50 dark:hover:bg-surface-800/50 transition-colors">
            <div className="w-16 h-16 mx-auto bg-primary-50 dark:bg-primary-900/30 text-primary-500 rounded-full flex items-center justify-center mb-4">
              <Upload size={24} />
            </div>
            <p className="text-surface-900 dark:text-white font-medium mb-1">Click to upload new images</p>
            <p className="text-surface-500 text-sm mb-4">SVG, PNG, JPG or GIF (max. 5 files)</p>
            <input 
              type="file" 
              multiple 
              accept="image/*"
              onChange={handleImageChange}
              className="block w-full text-sm text-surface-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100 cursor-pointer mx-auto max-w-xs"
            />
            {imageFiles.length > 0 && (
              <p className="mt-4 text-sm font-medium text-emerald-600 dark:text-emerald-400">
                {imageFiles.length} file(s) selected
              </p>
            )}
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end gap-4 border-t border-surface-200 dark:border-surface-800 pt-6 mt-8">
          <Link to="/admin/products" className="btn-secondary">Cancel</Link>
          <button type="submit" disabled={saving} className="btn-primary shadow-glow flex items-center gap-2">
            {saving ? 'Saving...' : <><Save size={18} /> Save Product</>}
          </button>
        </div>

      </form>
    </div>
  );
};

export default AdminProductForm;

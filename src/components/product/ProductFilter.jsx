import { useState, useEffect } from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { categoriesAPI } from '../../services/api';

const ProductFilter = ({ filters, setFilters }) => {
  const [categories, setCategories] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await categoriesAPI.getAll();
        setCategories(data.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value, page: 1 }));
  };

  const handleClear = () => {
    setFilters({
      keyword: '',
      category: '',
      minPrice: '',
      maxPrice: '',
      rating: '',
      sort: '-createdAt',
      page: 1,
    });
    setIsOpen(false);
  };

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Search Input */}
      <div>
        <h3 className="text-sm font-semibold text-surface-900 dark:text-white mb-3">Search Products</h3>
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-surface-400 group-focus-within:text-primary-500 transition-colors">
            <Search size={18} />
          </div>
          <input
            type="text"
            name="keyword"
            placeholder="Type your search..."
            value={filters.keyword || ''}
            onChange={handleChange}
            className="w-full pl-10 pr-3 py-2 text-sm rounded-lg border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-900 text-surface-900 dark:text-white focus:ring-primary-500 focus:border-primary-500 focus:bg-white dark:focus:bg-surface-950 transition-all duration-300"
          />
        </div>
      </div>

      {/* Category Filter */}
      <div>
        <h3 className="text-sm font-semibold text-surface-900 dark:text-white mb-3">Categories</h3>
        <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="category"
              value=""
              checked={filters.category === ''}
              onChange={handleChange}
              className="text-primary-600 focus:ring-primary-500 rounded border-surface-300 bg-white dark:bg-surface-800"
            />
            <span className="text-sm text-surface-600 dark:text-surface-400">All Categories</span>
          </label>
          {categories.map((category) => (
            <label key={category._id} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="category"
                value={category._id}
                checked={filters.category === category._id}
                onChange={handleChange}
                className="text-primary-600 focus:ring-primary-500 rounded border-surface-300 bg-white dark:bg-surface-800"
              />
              <span className="text-sm text-surface-600 dark:text-surface-400">{category.name}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Filter */}
      <div>
        <h3 className="text-sm font-semibold text-surface-900 dark:text-white mb-3">Price Range</h3>
        <div className="flex items-center gap-2">
          <input
            type="number"
            name="minPrice"
            placeholder="Min"
            value={filters.minPrice}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm rounded-lg border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-900 text-surface-900 dark:text-white"
          />
          <span className="text-surface-500">-</span>
          <input
            type="number"
            name="maxPrice"
            placeholder="Max"
            value={filters.maxPrice}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm rounded-lg border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-900 text-surface-900 dark:text-white"
          />
        </div>
      </div>

      {/* Rating Filter */}
      <div>
        <h3 className="text-sm font-semibold text-surface-900 dark:text-white mb-3">Minimum Rating</h3>
        <div className="space-y-2">
          {[4, 3, 2, 1].map((rating) => (
            <label key={rating} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="rating"
                value={rating}
                checked={filters.rating === String(rating)}
                onChange={handleChange}
                className="text-primary-600 focus:ring-primary-500 rounded border-surface-300 bg-white dark:bg-surface-800"
              />
              <div className="flex text-amber-400 text-sm">
                {'★'.repeat(rating)}{'☆'.repeat(5 - rating)}
                <span className="text-surface-600 dark:text-surface-400 ml-1">& Up</span>
              </div>
            </label>
          ))}
        </div>
      </div>

      <button
        onClick={handleClear}
        className="w-full py-2 px-4 border border-surface-200 dark:border-surface-700 text-surface-600 dark:text-surface-300 rounded-lg hover:bg-surface-50 dark:hover:bg-surface-800 transition-colors text-sm font-medium"
      >
        Clear Filters
      </button>
    </div>
  );

  return (
    <>
      {/* Mobile Filter Button */}
      <button
        className="lg:hidden flex items-center justify-center gap-2 w-full py-3 mb-6 bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800 rounded-xl shadow-sm text-surface-700 dark:text-surface-300 font-medium"
        onClick={() => setIsOpen(true)}
      >
        <SlidersHorizontal size={20} />
        Filter & Sort
      </button>

      {/* Mobile Drawer Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Filter Container */}
      <div className={`
        fixed inset-y-0 right-0 z-50 w-full max-w-xs bg-white dark:bg-surface-900 shadow-premium p-6 transform transition-transform duration-300 ease-in-out lg:relative lg:transform-none lg:w-64 lg:p-0 lg:bg-transparent lg:shadow-none lg:block
        ${isOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex items-center justify-between mb-6 lg:mb-4">
          <h2 className="text-lg font-bold text-surface-900 dark:text-white flex items-center gap-2">
            <SlidersHorizontal size={20} className="text-primary-500" />
            Filters
          </h2>
          <button 
            className="lg:hidden text-surface-500 hover:text-surface-900 dark:hover:text-white"
            onClick={() => setIsOpen(false)}
          >
            <X size={24} />
          </button>
        </div>

        <div className="glass-card p-6 lg:bg-white lg:dark:bg-surface-900">
          <FilterContent />
        </div>
      </div>
    </>
  );
};

export default ProductFilter;

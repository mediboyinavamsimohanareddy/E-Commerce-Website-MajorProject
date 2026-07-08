import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search } from 'lucide-react';
import ProductFilter from '../components/product/ProductFilter';
import ProductCard from '../components/product/ProductCard';
import Loader from '../components/common/Loader';
import { productsAPI } from '../services/api';

const Products = () => {
  const [searchParams] = useSearchParams();
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalProducts: 0,
  });

  const [filters, setFilters] = useState({
    keyword: searchParams.get('keyword') || '',
    category: searchParams.get('category') || '',
    minPrice: '',
    maxPrice: '',
    rating: '',
    sort: '-createdAt',
    page: 1,
    limit: 12,
  });

  // Sync keyword from URL if it changes
  useEffect(() => {
    const keyword = searchParams.get('keyword');
    const category = searchParams.get('category');
    
    if (keyword !== null) setFilters(prev => ({ ...prev, keyword, page: 1 }));
    if (category !== null) setFilters(prev => ({ ...prev, category, page: 1 }));
  }, [searchParams]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        // Clean up empty filters before sending
        const activeFilters = Object.fromEntries(
          Object.entries(filters).filter(([_, v]) => v !== '')
        );

        const { data } = await productsAPI.getAll(activeFilters);
        setProducts(data.data);
        setPagination(data.pagination);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [filters]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setFilters(prev => ({ ...prev, page: newPage }));
    }
  };

  return (
    <div className="pt-24 pb-16 min-h-screen bg-surface-50 dark:bg-surface-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-surface-900 dark:text-white">
            {filters.keyword ? `Search Results for "${filters.keyword}"` : 'All Products'}
          </h1>
          <p className="mt-2 text-surface-500 dark:text-surface-400">
            Showing {products.length} of {pagination.totalProducts} products
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filter */}
          <div className="w-full lg:w-64 flex-shrink-0">
            <ProductFilter filters={filters} setFilters={setFilters} />
          </div>

          {/* Product Grid Area */}
          <div className="flex-1">
            {/* Top Bar (Sort) */}
            <div className="flex justify-end mb-6">
              <div className="flex items-center gap-2">
                <label className="text-sm text-surface-600 dark:text-surface-400">Sort by:</label>
                <select
                  value={filters.sort}
                  onChange={(e) => setFilters(prev => ({ ...prev, sort: e.target.value, page: 1 }))}
                  className="bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800 text-surface-900 dark:text-white text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 p-2"
                >
                  <option value="-createdAt">Newest Arrivals</option>
                  <option value="price">Price: Low to High</option>
                  <option value="-price">Price: High to Low</option>
                  <option value="-rating">Top Rated</option>
                </select>
              </div>
            </div>

            {/* Products Grid */}
            {loading ? (
              <div className="min-h-[400px] flex items-center justify-center">
                <Loader />
              </div>
            ) : products.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-fade-in-up">
                  {products.map(product => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <div className="mt-12 flex justify-center items-center gap-2">
                    <button
                      onClick={() => handlePageChange(filters.page - 1)}
                      disabled={filters.page === 1}
                      className="px-4 py-2 rounded-lg border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-900 text-surface-700 dark:text-surface-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-surface-50 dark:hover:bg-surface-800 transition-colors"
                    >
                      Previous
                    </button>
                    
                    <div className="flex items-center gap-1">
                      {[...Array(pagination.totalPages)].map((_, i) => (
                        <button
                          key={i}
                          onClick={() => handlePageChange(i + 1)}
                          className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
                            filters.page === i + 1
                              ? 'bg-primary-600 text-white'
                              : 'bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-700 text-surface-700 dark:text-surface-300 hover:bg-surface-50 dark:hover:bg-surface-800'
                          }`}
                        >
                          {i + 1}
                        </button>
                      ))}
                    </div>

                    <button
                      onClick={() => handlePageChange(filters.page + 1)}
                      disabled={filters.page === pagination.totalPages}
                      className="px-4 py-2 rounded-lg border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-900 text-surface-700 dark:text-surface-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-surface-50 dark:hover:bg-surface-800 transition-colors"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="bg-white dark:bg-surface-900 rounded-2xl p-12 text-center border border-surface-200 dark:border-surface-800">
                <div className="w-16 h-16 mx-auto bg-surface-100 dark:bg-surface-800 rounded-full flex items-center justify-center text-surface-400 mb-4">
                  <Search size={24} />
                </div>
                <h3 className="text-xl font-semibold text-surface-900 dark:text-white mb-2">No products found</h3>
                <p className="text-surface-500 dark:text-surface-400 mb-6">
                  Try adjusting your filters or search terms to find what you're looking for.
                </p>
                <button 
                  onClick={() => setFilters({ keyword: '', category: '', minPrice: '', maxPrice: '', rating: '', sort: '-createdAt', page: 1, limit: 12 })}
                  className="btn-primary"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;

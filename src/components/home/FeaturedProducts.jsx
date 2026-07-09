import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { productsAPI } from '../../services/api';
import ProductCard from '../product/ProductCard';

const FeaturedProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const { data } = await productsAPI.getFeatured(8);
        setProducts(data.data);
      } catch (error) {
        console.error('Error fetching featured products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  if (loading) {
    return (
      <section className="section bg-surface-50 dark:bg-surface-950">
        <div className="page-container">
          <div className="flex justify-between items-end mb-8">
            <div className="h-8 w-48 skeleton"></div>
            <div className="h-5 w-24 skeleton"></div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="aspect-[3/4] skeleton rounded-2xl"></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (products.length === 0) return null;

  return (
    <section className="section bg-surface-50 dark:bg-surface-950">
      <div className="page-container">
        <div className="flex flex-col sm:flex-row justify-between items-end gap-4 mb-10">
          <div>
            <h2 className="text-3xl font-bold text-surface-900 dark:text-white">Featured Products</h2>
            <p className="mt-2 text-surface-500 dark:text-surface-400">Hand-picked premium selections</p>
          </div>
          <Link 
            to="/products" 
            className="flex items-center text-primary-600 font-semibold hover:text-primary-700 transition-colors"
          >
            View all products <ArrowRight size={18} className="ml-1" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;

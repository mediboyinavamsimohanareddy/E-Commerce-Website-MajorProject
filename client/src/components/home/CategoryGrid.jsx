import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { categoriesAPI } from '../../services/api';

const CategoryGrid = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await categoriesAPI.getAll();
        setCategories(data.data.slice(0, 6)); // Only show top 6
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  if (loading) {
    return (
      <section className="section bg-white dark:bg-surface-950">
        <div className="page-container">
          <div className="h-8 w-48 skeleton mb-10 mx-auto"></div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="aspect-square skeleton rounded-2xl"></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section bg-white dark:bg-surface-950">
      <div className="page-container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-surface-900 dark:text-white">Shop by Category</h2>
          <p className="mt-4 text-surface-500 dark:text-surface-400">Find exactly what you're looking for</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {categories.map((category) => (
            <Link
              key={category._id}
              to={`/products?category=${category._id}`}
              className="group relative rounded-2xl overflow-hidden aspect-square md:aspect-[4/3] shadow-md hover:shadow-xl transition-shadow duration-300"
            >
              <img
                src={category.image || 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=600'}
                alt={category.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-4 md:p-6">
                <h3 className="text-lg md:text-xl font-bold text-white mb-1 group-hover:text-primary-300 transition-colors">
                  {category.name}
                </h3>
                <div className="flex items-center text-white/80 text-sm font-medium opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                  Shop Now <ArrowRight size={16} className="ml-1" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryGrid;

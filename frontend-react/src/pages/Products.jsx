import React, { useState, useEffect } from 'react';
import { Search, SlidersHorizontal, ArrowUpDown, X } from 'lucide-react';
import { ProductCard } from '../components/ProductCard';
import { productService } from '../services/productService';

export function Products({ onSelectProduct, initialCategory = 'All', initialSearch = '' }) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(['All']);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [sortBy, setSortBy] = useState('featured');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [prodData, catData] = await Promise.all([
          productService.getAllProducts(),
          productService.getCategories()
        ]);
        setProducts(prodData || []);
        if (catData && catData.length > 0) {
          setCategories(['All', ...catData]);
        }
      } catch (err) {
        console.warn('Error loading products:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  useEffect(() => {
    setSelectedCategory(initialCategory);
  }, [initialCategory]);

  useEffect(() => {
    setSearchQuery(initialSearch);
  }, [initialSearch]);

  // Filter & Sort Logic
  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'All' || product.category?.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch = !searchQuery ||
      product.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-low') return (a.price || 0) - (b.price || 0);
    if (sortBy === 'price-high') return (b.price || 0) - (a.price || 0);
    if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
    return (b.id || 0) - (a.id || 0);
  });

  return (
    <div className="container animate-fade-in" style={{ paddingTop: '2.5rem' }}>
      {/* Page Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.25rem', marginBottom: '0.35rem' }}>Explore Catalog</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
          Browse our extensive collection of {products.length} high-performance electronics
        </p>
      </div>

      {/* Filter and Search Controls Toolbar */}
      <div className="card" style={{ padding: '1.25rem 1.5rem', marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Category Pills */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {categories.map((cat, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedCategory(cat)}
                className={`btn btn-sm ${selectedCategory.toLowerCase() === cat.toLowerCase() ? 'btn-primary' : 'btn-secondary'}`}
                style={{ borderRadius: 'var(--radius-full)' }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Sort Dropdown & Quick Search */}
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <div style={{ position: 'relative', width: '220px' }}>
              <Search size={15} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="text"
                placeholder="Filter by name..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="form-control"
                style={{ padding: '0.45rem 0.75rem 0.45rem 2.2rem', fontSize: '0.85rem', height: '36px' }}
              />
              {searchQuery && (
                <X
                  size={14}
                  style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', color: 'var(--text-muted)' }}
                  onClick={() => setSearchQuery('')}
                />
              )}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <ArrowUpDown size={15} color="var(--text-secondary)" />
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                className="form-control"
                style={{ padding: '0.45rem 0.75rem', fontSize: '0.85rem', height: '36px', width: 'auto' }}
              >
                <option value="featured">Featured First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '5rem', color: 'var(--text-muted)' }}>
          Loading products from inventory...
        </div>
      ) : sortedProducts.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '4rem 2rem', maxWidth: '500px', margin: '2rem auto' }}>
          <SlidersHorizontal size={42} color="var(--text-muted)" style={{ margin: '0 auto 1rem' }} />
          <h3 style={{ fontSize: '1.3rem', marginBottom: '0.5rem' }}>No Products Found</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
            No products match your active filters. Try clearing your search query or selecting a different category.
          </p>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => {
              setSelectedCategory('All');
              setSearchQuery('');
            }}
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.25rem', fontWeight: 600 }}>
            Showing {sortedProducts.length} product{sortedProducts.length !== 1 ? 's' : ''}
          </div>
          <div className="products-grid">
            {sortedProducts.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                onSelectProduct={onSelectProduct}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

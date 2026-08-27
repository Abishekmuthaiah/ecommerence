import React, { useState, useEffect } from 'react';
import { ArrowRight, ShoppingBag, Truck, ShieldCheck, Zap, Headphones, Laptop, Smartphone, Watch, Sparkles, Star } from 'lucide-react';
import { ProductCard } from '../components/ProductCard';
import { productService } from '../services/productService';

export function Home({ onNavigate, onSelectProduct, onSelectCategory }) {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const products = await productService.getAllProducts();
        setFeaturedProducts(products ? products.slice(0, 8) : []);
      } catch (err) {
        console.warn('Failed to load featured products', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const categories = [
    { name: 'Electronics', icon: Smartphone, count: '12+ Items', desc: 'Flagships & Mobiles' },
    { name: 'Computing', icon: Laptop, count: '8+ Items', desc: 'Laptops & Workstations' },
    { name: 'Audio', icon: Headphones, count: '15+ Items', desc: 'ANC & Hi-Res Sound' },
    { name: 'Wearables', icon: Watch, count: '6+ Items', desc: 'Smartwatches & Trackers' },
    { name: 'Accessories', icon: Zap, count: '20+ Items', desc: 'Cables, Hubs & Chargers' }
  ];

  return (
    <div className="animate-fade-in">
      {/* Premium Hero Section */}
      <section className="hero-section">
        <div className="container hero-inner">
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.35rem 0.85rem', backgroundColor: 'var(--primary-light)', border: '1px solid var(--primary-border)', borderRadius: 'var(--radius-full)', color: 'var(--primary)', fontSize: '0.825rem', fontWeight: 700, marginBottom: '1.5rem' }}>
              <Sparkles size={15} /> Spring Electronics Gala &bull; Up to 40% Off
            </div>

            <h1 className="hero-title">
              Experience the Future of <span>Smart Living.</span>
            </h1>

            <p className="hero-subtitle">
              Discover curated premium tech, noise-cancelling acoustics, ultra-fast laptops, and smart everyday gadgets crafted for creators and professionals.
            </p>

            <div className="hero-actions">
              <button
                className="btn btn-primary btn-lg"
                onClick={() => onNavigate('products')}
              >
                <ShoppingBag size={19} /> Explore Catalog
              </button>

              <button
                className="btn btn-secondary btn-lg"
                onClick={() => {
                  const el = document.getElementById('featured-products');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                View Top Deals <ArrowRight size={18} />
              </button>
            </div>
          </div>

          {/* Value Highlights Card */}
          <div className="hero-highlight-card">
            <h3 style={{ fontSize: '1.15rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Zap size={18} color="var(--primary)" /> Why Shoppers Love Us
            </h3>

            <div className="highlight-item">
              <div className="highlight-icon-wrap" style={{ background: 'var(--primary-light)', color: 'var(--primary)' }}>
                <Truck size={20} />
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>Fast Dispatch</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Same-day packing & express courier delivery</div>
              </div>
            </div>

            <div className="highlight-item">
              <div className="highlight-icon-wrap" style={{ background: '#ecfdf5', color: '#059669' }}>
                <ShieldCheck size={20} />
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>100% Genuine Tech</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Direct brand warranty and hassle-free returns</div>
              </div>
            </div>

            <div className="highlight-item">
              <div className="highlight-icon-wrap" style={{ background: '#fffbeb', color: '#d97706' }}>
                <Star size={20} />
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>4.9/5 Rated Experience</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Over 50,000+ satisfied tech enthusiasts</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="container" style={{ marginBottom: '4rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1.75rem' }}>
          <div>
            <h2 style={{ fontSize: '1.75rem' }}>Shop by Category</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.925rem' }}>Browse top-tier hardware tailored to your workflow</p>
          </div>
          <button
            className="btn btn-outline btn-sm"
            onClick={() => onNavigate('products')}
          >
            All Categories <ArrowRight size={15} />
          </button>
        </div>

        <div className="category-grid">
          {categories.map((cat, idx) => {
            const Icon = cat.icon;
            return (
              <div
                key={idx}
                className="category-card"
                onClick={() => onSelectCategory(cat.name)}
              >
                <div className="category-icon">
                  <Icon size={24} />
                </div>
                <span className="category-title">{cat.name}</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{cat.desc}</span>
              </div>
            );
          })}
        </div>
      </section>

      {/* Featured Products Grid */}
      <section id="featured-products" className="container" style={{ marginBottom: '4rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
          <div>
            <h2 style={{ fontSize: '1.75rem' }}>Featured Hardware</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.925rem' }}>Handpicked selections available with exclusive prices</p>
          </div>

          <button
            className="btn btn-secondary"
            onClick={() => onNavigate('products')}
          >
            View All ({featuredProducts.length}) <ArrowRight size={16} />
          </button>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
            Loading catalog...
          </div>
        ) : (
          <div className="products-grid">
            {featuredProducts.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                onSelectProduct={onSelectProduct}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

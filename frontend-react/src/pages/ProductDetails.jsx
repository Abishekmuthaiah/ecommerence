import React, { useState, useEffect } from 'react';
import { ArrowLeft, Star, ShoppingCart, ShieldCheck, Truck, RotateCcw, Check, Zap, Heart, Share2, CheckCircle2 } from 'lucide-react';
import { productService } from '../services/productService';
import { useCart } from '../context/CartContext';

export function ProductDetails({ productId, onBack, onNavigate }) {
  const { addToCart, showToast } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    async function loadProduct() {
      if (!productId) return;
      try {
        setLoading(true);
        const data = await productService.getProductById(productId);
        setProduct(data);
        setQuantity(1);
      } catch (err) {
        showToast('Error loading product details', 'error');
      } finally {
        setLoading(false);
      }
    }
    loadProduct();
  }, [productId]);

  const handleAddToCart = async () => {
    if (!product || product.stock <= 0) return;
    setAdding(true);
    const success = await addToCart(product.id, quantity, product.name);
    setAdding(false);
    if (success) {
      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 2000);
    }
  };

  const handleBuyNow = async () => {
    if (!product || product.stock <= 0) return;
    const success = await addToCart(product.id, quantity, product.name);
    if (success) {
      onNavigate('cart');
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price || 0);
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '5rem 0', textAlign: 'center', color: 'var(--text-muted)' }}>
        Loading product specifications...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>
        <h2>Product not found</h2>
        <button className="btn btn-secondary" onClick={onBack} style={{ marginTop: '1rem' }}>
          <ArrowLeft size={16} /> Back to Catalog
        </button>
      </div>
    );
  }

  const isOutOfStock = product.stock <= 0;
  const originalPrice = Math.round(product.price * 1.18);

  return (
    <div className="container animate-fade-in" style={{ paddingTop: '2rem' }}>
      {/* Breadcrumb Navigation */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
        <button
          onClick={onBack}
          style={{ background: 'none', border: 'none', display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer', color: 'var(--primary)', fontWeight: 600 }}
        >
          <ArrowLeft size={16} /> Products
        </button>
        <span>/</span>
        <span>{product.category}</span>
        <span>/</span>
        <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>{product.name}</span>
      </div>

      {/* Main 2-Column Product Showcase */}
      <div className="card" style={{ padding: '2.5rem', display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: '3rem', alignItems: 'start' }}>
        {/* Left Column: Product Image */}
        <div style={{ position: 'relative' }}>
          <div style={{ width: '100%', height: '420px', borderRadius: 'var(--radius-lg)', overflow: 'hidden', backgroundColor: 'var(--bg-subtle)', border: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <img
              src={product.imageUrl || 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=800&q=80'}
              alt={product.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              onError={(e) => {
                e.target.src = 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=800&q=80';
              }}
            />
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '1.25rem' }}>
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => {
                setIsWishlisted(!isWishlisted);
                showToast(!isWishlisted ? 'Saved to wishlist' : 'Removed from wishlist', 'info');
              }}
              style={{ flex: 1 }}
            >
              <Heart size={16} fill={isWishlisted ? '#ef4444' : 'none'} color={isWishlisted ? '#ef4444' : 'inherit'} />
              {isWishlisted ? 'Wishlisted' : 'Add to Wishlist'}
            </button>
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => {
                navigator.clipboard?.writeText(window.location.href);
                showToast('Product link copied to clipboard!', 'success');
              }}
              style={{ flex: 1 }}
            >
              <Share2 size={16} /> Share Product
            </button>
          </div>
        </div>

        {/* Right Column: Product Info & Actions */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
            <span className="badge badge-primary">{product.category}</span>
            {isOutOfStock ? (
              <span className="badge badge-danger">Out of Stock</span>
            ) : product.stock <= 5 ? (
              <span className="badge badge-warning">Only {product.stock} left in stock</span>
            ) : (
              <span className="badge badge-success"><CheckCircle2 size={13} /> In Stock ({product.stock} units)</span>
            )}
          </div>

          <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.75rem', lineHeight: 1.25 }}>
            {product.name}
          </h1>

          {/* Rating */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--border-light)' }}>
            <div style={{ display: 'flex', gap: '3px' }}>
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={17}
                  fill={i < Math.floor(product.rating || 4.5) ? '#f59e0b' : '#e2e8f0'}
                  color={i < Math.floor(product.rating || 4.5) ? '#f59e0b' : '#cbd5e1'}
                />
              ))}
            </div>
            <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>{product.rating || 4.5}</span>
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>({product.numReviews || 24} customer reviews)</span>
          </div>

          {/* Pricing Box */}
          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '1rem' }}>
              <span style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-main)' }}>
                {formatPrice(product.price)}
              </span>
              <span style={{ fontSize: '1.15rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>
                {formatPrice(originalPrice)}
              </span>
              <span className="badge badge-success" style={{ fontSize: '0.8rem' }}>Save 18%</span>
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>Inclusive of all taxes & standard warranty</div>
          </div>

          {/* Description */}
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.975rem', lineHeight: 1.6, marginBottom: '2rem' }}>
            {product.description}
          </p>

          {/* Quantity and Actions */}
          {!isOutOfStock && (
            <div style={{ marginBottom: '2rem' }}>
              <div style={{ fontWeight: 700, fontSize: '0.875rem', marginBottom: '0.6rem' }}>Select Quantity</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                <div className="cart-qty-control">
                  <button
                    className="cart-qty-btn"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    -
                  </button>
                  <span className="cart-qty-val">{quantity}</span>
                  <button
                    className="cart-qty-btn"
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    disabled={quantity >= product.stock}
                  >
                    +
                  </button>
                </div>

                <button
                  className="btn btn-primary btn-lg"
                  onClick={handleAddToCart}
                  disabled={adding}
                  style={{ flex: 1, minWidth: '180px' }}
                >
                  {justAdded ? (
                    <>
                      <Check size={18} /> Added to Cart!
                    </>
                  ) : (
                    <>
                      <ShoppingCart size={18} /> Add to Cart
                    </>
                  )}
                </button>

                <button
                  className="btn btn-secondary btn-lg"
                  onClick={handleBuyNow}
                  style={{ flex: 1, minWidth: '140px', backgroundColor: '#0f172a', color: '#ffffff', borderColor: '#0f172a' }}
                >
                  <Zap size={18} /> Buy Now
                </button>
              </div>
            </div>
          )}

          {/* Trust Guarantees */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-light)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <Truck size={18} color="var(--primary)" />
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Free Express Delivery</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <ShieldCheck size={18} color="#059669" />
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>1-Year Brand Warranty</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <RotateCcw size={18} color="#d97706" />
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>7-Day Easy Returns</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <CheckCircle2 size={18} color="var(--primary)" />
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>100% Authentic Product</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

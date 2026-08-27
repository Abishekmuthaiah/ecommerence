import React, { useState } from 'react';
import { Star, ShoppingCart, Check, Heart } from 'lucide-react';
import { useCart } from '../context/CartContext';

export function ProductCard({ product, onSelectProduct }) {
  const { addToCart, showToast } = useCart();
  const [adding, setAdding] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    if (product.stock <= 0) return;

    setAdding(true);
    const success = await addToCart(product.id, 1, product.name);
    setAdding(false);

    if (success) {
      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 1500);
    }
  };

  const handleToggleWishlist = (e) => {
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
    showToast(!isWishlisted ? `Added ${product.name} to wishlist` : `Removed from wishlist`, 'info');
  };

  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price || 0);
  };

  // Mock original price with ~15% discount for visual appeal
  const originalPrice = Math.round(product.price * 1.18);

  return (
    <div
      className="product-card card-hover"
      onClick={() => onSelectProduct && onSelectProduct(product.id)}
      style={{ cursor: 'pointer' }}
    >
      {/* Product Image Wrap */}
      <div className="product-image-wrap">
        <img
          src={product.imageUrl || 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=800&q=80'}
          alt={product.name}
          loading="lazy"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=800&q=80';
          }}
        />

        {/* Category Pill */}
        <span className="product-category-tag">{product.category || 'General'}</span>

        {/* Wishlist Heart Button */}
        <button
          onClick={handleToggleWishlist}
          style={{
            position: 'absolute',
            bottom: '0.75rem',
            right: '0.75rem',
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
            transition: 'transform 0.15s ease'
          }}
          title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart size={16} fill={isWishlisted ? '#ef4444' : 'none'} color={isWishlisted ? '#ef4444' : '#64748b'} />
        </button>

        {/* Stock Badge */}
        <div className="product-stock-tag">
          {isOutOfStock ? (
            <span className="badge badge-danger">Out of Stock</span>
          ) : isLowStock ? (
            <span className="badge badge-warning">Only {product.stock} left</span>
          ) : (
            <span className="badge badge-success">In Stock</span>
          )}
        </div>
      </div>

      {/* Product Details Body */}
      <div className="product-card-body">
        <h3 className="product-title" title={product.name}>
          {product.name}
        </h3>

        <p className="product-desc">{product.description}</p>

        {/* Rating */}
        <div className="product-rating">
          <div style={{ display: 'flex', gap: '2px' }}>
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={14}
                fill={i < Math.floor(product.rating || 4.5) ? '#f59e0b' : '#e2e8f0'}
                color={i < Math.floor(product.rating || 4.5) ? '#f59e0b' : '#cbd5e1'}
              />
            ))}
          </div>
          <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>{product.rating || 4.5}</span>
          <span style={{ color: 'var(--text-muted)' }}>({product.numReviews || 24})</span>
        </div>

        {/* Price & Action */}
        <div className="product-card-footer">
          <div>
            <div className="product-price">{formatPrice(product.price)}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>
              {formatPrice(originalPrice)}
            </div>
          </div>

          <button
            className={`btn btn-sm ${justAdded ? 'btn-secondary' : isOutOfStock ? 'btn-secondary' : 'btn-primary'}`}
            disabled={isOutOfStock || adding}
            onClick={handleAddToCart}
            style={{
              minWidth: '105px',
              backgroundColor: justAdded ? '#ecfdf5' : isOutOfStock ? '#f1f5f9' : undefined,
              color: justAdded ? '#059669' : isOutOfStock ? '#94a3b8' : undefined,
              borderColor: justAdded ? '#a7f3d0' : undefined
            }}
          >
            {justAdded ? (
              <>
                <Check size={15} /> Added
              </>
            ) : adding ? (
              'Adding...'
            ) : isOutOfStock ? (
              'Sold Out'
            ) : (
              <>
                <ShoppingCart size={15} /> Add
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

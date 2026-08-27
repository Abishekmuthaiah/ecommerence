import React, { useState } from 'react';
import { Trash2, ShoppingBag, ArrowRight, ShieldCheck, Tag, Check, CreditCard, MapPin, Phone, User, Mail, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useCart } from '../context/CartContext';
import { useUser } from '../context/UserContext';
import { orderService } from '../services/orderService';

export function Cart({ onNavigate, onSelectProduct }) {
  const { cart, updateQuantity, removeFromCart, clearCart, showToast, fetchCart } = useCart();
  const { currentUser } = useUser();

  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [promoApplied, setPromoApplied] = useState(false);

  const [formData, setFormData] = useState({
    customerName: currentUser?.name || 'Alex Johnson',
    customerEmail: currentUser?.email || 'alex@example.com',
    customerPhone: currentUser?.phone || '9876543210',
    shippingAddress: currentUser?.address || '42 Silicon Avenue, Tech Park, Bangalore 560001',
    paymentMethod: 'Credit Card'
  });

  React.useEffect(() => {
    if (currentUser) {
      setFormData(prev => ({
        ...prev,
        customerName: currentUser.name || '',
        customerEmail: currentUser.email || '',
        customerPhone: currentUser.phone || '9876543210',
        shippingAddress: currentUser.address || '42 Silicon Avenue, Tech Park, Bangalore 560001'
      }));
    }
  }, [currentUser]);

  const handleApplyPromo = (e) => {
    e.preventDefault();
    if (promoCode.trim().toUpperCase() === 'SAVE500' || promoCode.trim().toUpperCase() === 'WELCOME') {
      setDiscount(500);
      setPromoApplied(true);
      showToast('Promo code applied! ₹500 discount added', 'success');
    } else {
      showToast('Invalid promo code. Try SAVE500', 'error');
    }
  };

  const handleCheckoutSubmit = async (e) => {
    e.preventDefault();
    if (!formData.customerName || !formData.shippingAddress || !formData.customerEmail) {
      showToast('Please fill in all required shipping fields', 'warning');
      return;
    }

    try {
      setPlacingOrder(true);
      const orderPayload = {
        userId: currentUser?.id || 1,
        customerName: formData.customerName,
        customerEmail: formData.customerEmail,
        customerPhone: formData.customerPhone,
        shippingAddress: formData.shippingAddress,
        paymentMethod: formData.paymentMethod,
        items: cart.items.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
          productName: item.productName,
          imageUrl: item.imageUrl
        }))
      };

      const newOrder = await orderService.placeOrder(orderPayload);

      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });

      showToast(`Order #${newOrder.id} placed successfully!`, 'success');
      setIsCheckoutOpen(false);
      await fetchCart();
      onNavigate('orders');
    } catch (err) {
      showToast(err.message || 'Failed to place order. Please try again.', 'error');
    } finally {
      setPlacingOrder(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price || 0);
  };

  const subtotal = (cart.items && cart.items.length > 0)
    ? cart.items.reduce((acc, item) => acc + ((item.price || 0) * (item.quantity || 1)), 0)
    : (cart.subtotal || 0);
  const shippingFee = subtotal > 1000 || subtotal === 0 ? 0 : 99;
  const tax = Math.round(subtotal * 0.05); // 5% GST
  const finalTotal = Math.max(0, subtotal + shippingFee + tax - discount);

  return (
    <div className="container animate-fade-in" style={{ paddingTop: '2.5rem' }}>
      <h1 style={{ fontSize: '2.25rem', marginBottom: '0.5rem' }}>Shopping Cart</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '2.5rem', fontSize: '0.95rem' }}>
        Review your items and proceed to secure checkout
      </p>

      {cart.items.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '5rem 2rem', maxWidth: '600px', margin: '0 auto' }}>
          <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
            <ShoppingBag size={38} />
          </div>
          <h2 style={{ fontSize: '1.6rem', marginBottom: '0.5rem' }}>Your Cart is Empty</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', fontSize: '0.95rem' }}>
            Looks like you haven't added anything to your cart yet. Explore our top tech deals!
          </p>
          <button
            className="btn btn-primary btn-lg"
            onClick={() => onNavigate('products')}
          >
            Start Shopping <ArrowRight size={18} />
          </button>
        </div>
      ) : (
        <div className="cart-layout">
          {/* Cart Items List */}
          <div>
            {/* Free shipping banner */}
            <div style={{ backgroundColor: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: 'var(--radius-md)', padding: '0.85rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', color: '#047857', fontSize: '0.9rem', fontWeight: 600 }}>
              <Sparkles size={18} /> You qualify for Free Express Shipping!
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {cart.items.map((item) => (
                <div key={item.id} className="cart-item-card">
                  <img
                    src={item.imageUrl || 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=800&q=80'}
                    alt={item.productName}
                    className="cart-item-img"
                  />

                  <div>
                    <h4
                      style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.35rem', cursor: 'pointer' }}
                      onClick={() => onSelectProduct(item.productId)}
                    >
                      {item.productName}
                    </h4>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
                      Price: <strong>{formatPrice(item.price)}</strong>
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#059669', fontWeight: 600 }}>
                      In Stock &bull; Ready to ship
                    </div>
                  </div>

                  <div className="cart-qty-control">
                    <button
                      className="cart-qty-btn"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    >
                      -
                    </button>
                    <span className="cart-qty-val">{item.quantity}</span>
                    <button
                      className="cart-qty-btn"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      +
                    </button>
                  </div>

                  <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
                    <div style={{ fontWeight: 800, fontSize: '1.15rem', color: 'var(--text-main)' }}>
                      {formatPrice(item.price * item.quantity)}
                    </div>
                    <button
                      className="btn btn-secondary btn-sm"
                      style={{ padding: '4px 8px', color: 'var(--danger-text)' }}
                      onClick={() => removeFromCart(item.id)}
                      title="Remove item"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem' }}>
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => onNavigate('products')}
              >
                &larr; Continue Shopping
              </button>

              <button
                className="btn btn-secondary btn-sm"
                onClick={clearCart}
                style={{ color: 'var(--danger-text)' }}
              >
                Clear Cart
              </button>
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="order-summary-card">
            <h3 style={{ fontSize: '1.3rem', marginBottom: '1.5rem', fontWeight: 800 }}>Order Summary</h3>

            <div className="summary-row">
              <span>Subtotal ({cart.totalItems} items)</span>
              <span>{formatPrice(subtotal)}</span>
            </div>

            <div className="summary-row">
              <span>Estimated GST (5%)</span>
              <span>{formatPrice(tax)}</span>
            </div>

            <div className="summary-row">
              <span>Shipping & Handling</span>
              <span>{shippingFee === 0 ? <strong style={{ color: '#059669' }}>FREE</strong> : formatPrice(shippingFee)}</span>
            </div>

            {discount > 0 && (
              <div className="summary-row" style={{ color: '#059669', fontWeight: 600 }}>
                <span>Coupon Discount</span>
                <span>-{formatPrice(discount)}</span>
              </div>
            )}

            <div className="summary-row total">
              <span>Total Due</span>
              <span style={{ color: 'var(--primary)' }}>{formatPrice(finalTotal)}</span>
            </div>

            {/* Promo Code Input */}
            <form onSubmit={handleApplyPromo} style={{ marginTop: '1.5rem', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                  type="text"
                  placeholder="Enter SAVE500"
                  value={promoCode}
                  onChange={e => setPromoCode(e.target.value)}
                  className="form-control"
                  style={{ textTransform: 'uppercase', fontSize: '0.85rem' }}
                />
                <button type="submit" className="btn btn-secondary btn-sm" style={{ fontWeight: 700 }}>
                  Apply
                </button>
              </div>
            </form>

            <button
              className="btn btn-primary btn-lg"
              style={{ width: '100%', marginBottom: '1rem' }}
              onClick={() => setIsCheckoutOpen(true)}
            >
              Proceed to Checkout <ArrowRight size={18} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              <ShieldCheck size={16} color="#059669" /> 256-bit Encrypted Checkout
            </div>
          </div>
        </div>
      )}

      {/* Checkout Modal */}
      {isCheckoutOpen && (
        <div className="modal-overlay" onClick={() => setIsCheckoutOpen(false)}>
          <div className="modal-content animate-fade-in" onClick={e => e.stopPropagation()}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '0.35rem' }}>Complete Your Purchase</h2>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1.75rem' }}>
              Please review delivery details and select your preferred payment method.
            </p>

            <form onSubmit={handleCheckoutSubmit}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    required
                    className="form-control"
                    value={formData.customerName}
                    onChange={e => setFormData({ ...formData, customerName: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input
                    type="email"
                    required
                    className="form-control"
                    value={formData.customerEmail}
                    onChange={e => setFormData({ ...formData, customerEmail: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  <input
                    type="tel"
                    required
                    className="form-control"
                    value={formData.customerPhone}
                    onChange={e => setFormData({ ...formData, customerPhone: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Shipping Address</label>
                <textarea
                  rows="2"
                  required
                  className="form-control"
                  value={formData.shippingAddress}
                  onChange={e => setFormData({ ...formData, shippingAddress: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Payment Method</label>
                <select
                  className="form-control"
                  value={formData.paymentMethod}
                  onChange={e => setFormData({ ...formData, paymentMethod: e.target.value })}
                >
                  <option value="Credit Card">Credit / Debit Card (Visa, Mastercard)</option>
                  <option value="UPI / QR">UPI (Google Pay, PhonePe, Paytm)</option>
                  <option value="Net Banking">Net Banking</option>
                  <option value="Cash on Delivery">Cash on Delivery (COD)</option>
                </select>
              </div>

              {/* Order Amount preview */}
              <div style={{ backgroundColor: 'var(--bg-subtle)', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Total Payable Amount</div>
                  <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--primary)' }}>
                    {formatPrice(finalTotal)}
                  </div>
                </div>
                <span className="badge badge-success"><Check size={13} /> Free Delivery</span>
              </div>

              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setIsCheckoutOpen(false)}
                  disabled={placingOrder}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="btn btn-primary btn-lg"
                  disabled={placingOrder}
                  style={{ minWidth: '180px' }}
                >
                  {placingOrder ? 'Processing...' : 'Confirm & Place Order'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

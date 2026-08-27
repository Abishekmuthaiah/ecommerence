import React, { useState, useEffect } from 'react';
import { Package, Calendar, MapPin, CreditCard, Clock, CheckCircle2, Truck, RefreshCw, ShoppingBag, ArrowRight, Check } from 'lucide-react';
import { orderService } from '../services/orderService';
import { useUser } from '../context/UserContext';

export function Orders({ onNavigate, onSelectProduct }) {
  const { currentUser } = useUser();
  const currentUserId = currentUser?.id || 1;
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await orderService.getUserOrders(currentUserId);
      setOrders(data || []);
    } catch (err) {
      console.warn('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [currentUserId]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price || 0);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Just now';
    try {
      return new Date(dateStr).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return dateStr;
    }
  };

  const getStatusStep = (status) => {
    switch (status) {
      case 'CONFIRMED': return 1;
      case 'PROCESSING': return 2;
      case 'SHIPPED': return 3;
      case 'DELIVERED': return 4;
      default: return 1;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'DELIVERED':
        return <span className="badge badge-success"><CheckCircle2 size={13} /> Delivered</span>;
      case 'SHIPPED':
        return <span className="badge badge-primary"><Truck size={13} /> Shipped</span>;
      case 'PROCESSING':
        return <span className="badge badge-warning"><Clock size={13} /> Processing</span>;
      case 'CONFIRMED':
        return <span className="badge badge-primary"><CheckCircle2 size={13} /> Confirmed</span>;
      case 'CANCELLED':
        return <span className="badge badge-danger">Cancelled</span>;
      default:
        return <span className="badge badge-secondary">{status || 'Pending'}</span>;
    }
  };

  return (
    <div className="container animate-fade-in" style={{ paddingTop: '2.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2.25rem', marginBottom: '0.35rem' }}>My Orders</h1>
          <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
            Real-time delivery updates for <strong>{currentUser.name}</strong>
          </p>
        </div>

        <button
          className="btn btn-secondary btn-sm"
          onClick={fetchOrders}
        >
          <RefreshCw size={14} /> Refresh Status
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '5rem', color: 'var(--text-muted)' }}>
          Loading your order history...
        </div>
      ) : orders.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '5rem 2rem', maxWidth: '600px', margin: '0 auto' }}>
          <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
            <Package size={38} />
          </div>
          <h2 style={{ fontSize: '1.6rem', marginBottom: '0.5rem' }}>No Orders Found</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', fontSize: '0.95rem' }}>
            You haven't placed any orders yet. Start exploring our high-performance hardware!
          </p>
          <button
            className="btn btn-primary btn-lg"
            onClick={() => onNavigate('products')}
          >
            Browse Catalog <ArrowRight size={18} />
          </button>
        </div>
      ) : (
        <div>
          {orders.map(order => {
            const currentStep = getStatusStep(order.status);
            return (
              <div key={order.id} className="order-card card-hover">
                {/* Order Header */}
                <div className="order-card-header">
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '0.5rem' }}>
                      <h3 style={{ fontSize: '1.3rem', fontWeight: 800 }}>Order #{order.id}</h3>
                      {getStatusBadge(order.status)}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)', flexWrap: 'wrap' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <Calendar size={14} /> {formatDate(order.orderDate)}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <CreditCard size={14} /> {order.paymentMethod || 'Credit Card'}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <MapPin size={14} /> {order.shippingAddress}
                      </span>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Total Paid</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary)' }}>
                      {formatPrice(order.totalAmount)}
                    </div>
                  </div>
                </div>

                {/* Progress Step Bar */}
                {order.status !== 'CANCELLED' && (
                  <div style={{ backgroundColor: 'var(--bg-subtle)', padding: '1.25rem 1.5rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', position: 'relative', textAlign: 'center' }}>
                      {/* Step 1: Confirmed */}
                      <div>
                        <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: currentStep >= 1 ? 'var(--primary)' : '#e2e8f0', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.4rem', fontSize: '0.75rem', fontWeight: 700 }}>
                          <Check size={14} />
                        </div>
                        <div style={{ fontSize: '0.8rem', fontWeight: currentStep >= 1 ? 700 : 500, color: currentStep >= 1 ? 'var(--text-main)' : 'var(--text-muted)' }}>Confirmed</div>
                      </div>

                      {/* Step 2: Processing */}
                      <div>
                        <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: currentStep >= 2 ? 'var(--primary)' : '#e2e8f0', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.4rem', fontSize: '0.75rem', fontWeight: 700 }}>
                          {currentStep >= 2 ? <Check size={14} /> : '2'}
                        </div>
                        <div style={{ fontSize: '0.8rem', fontWeight: currentStep >= 2 ? 700 : 500, color: currentStep >= 2 ? 'var(--text-main)' : 'var(--text-muted)' }}>Processing</div>
                      </div>

                      {/* Step 3: Shipped */}
                      <div>
                        <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: currentStep >= 3 ? 'var(--primary)' : '#e2e8f0', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.4rem', fontSize: '0.75rem', fontWeight: 700 }}>
                          {currentStep >= 3 ? <Check size={14} /> : '3'}
                        </div>
                        <div style={{ fontSize: '0.8rem', fontWeight: currentStep >= 3 ? 700 : 500, color: currentStep >= 3 ? 'var(--text-main)' : 'var(--text-muted)' }}>Shipped</div>
                      </div>

                      {/* Step 4: Delivered */}
                      <div>
                        <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: currentStep >= 4 ? '#059669' : '#e2e8f0', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.4rem', fontSize: '0.75rem', fontWeight: 700 }}>
                          {currentStep >= 4 ? <Check size={14} /> : '4'}
                        </div>
                        <div style={{ fontSize: '0.8rem', fontWeight: currentStep >= 4 ? 700 : 500, color: currentStep >= 4 ? '#059669' : 'var(--text-muted)' }}>Delivered</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Ordered Items Table */}
                <table className="order-items-table">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Unit Price</th>
                      <th style={{ textAlign: 'center' }}>Quantity</th>
                      <th style={{ textAlign: 'right' }}>Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.items && order.items.map((item, idx) => (
                      <tr key={idx}>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                            <img
                              src={item.imageUrl || 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=800&q=80'}
                              alt={item.productName}
                              style={{ width: '44px', height: '44px', borderRadius: '6px', objectFit: 'cover' }}
                            />
                            <div>
                              <div
                                style={{ fontWeight: 700, fontSize: '0.925rem', cursor: 'pointer', color: 'var(--text-main)' }}
                                onClick={() => onSelectProduct(item.productId)}
                              >
                                {item.productName}
                              </div>
                              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Item ID #{item.productId}</div>
                            </div>
                          </div>
                        </td>
                        <td>{formatPrice(item.price)}</td>
                        <td style={{ textAlign: 'center', fontWeight: 700 }}>{item.quantity}</td>
                        <td style={{ textAlign: 'right', fontWeight: 800 }}>
                          {formatPrice((item.price || 0) * (item.quantity || 1))}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

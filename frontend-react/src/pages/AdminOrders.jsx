import React, { useState, useEffect } from 'react';
import { Package, Calendar, MapPin, CreditCard, Clock, CheckCircle2, Truck, RefreshCw, Search, ArrowUpDown, IndianRupee, AlertCircle } from 'lucide-react';
import { orderService } from '../services/orderService';
import { useCart } from '../context/CartContext';

export function AdminOrders() {
  const { showToast } = useCart();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingOrderId, setUpdatingOrderId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await orderService.getAllOrders();
      setOrders(data || []);
    } catch (err) {
      showToast('Error loading platform orders', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      setUpdatingOrderId(orderId);
      await orderService.updateOrderStatus(orderId, newStatus);
      if (newStatus === 'CANCELLED') {
        showToast(`Order #${orderId} CANCELLED — Product stock restored to inventory.`, 'info');
      } else {
        showToast(`Order #${orderId} status updated to ${newStatus}`, 'success');
      }
      setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    } catch (err) {
      showToast(err.message || 'Failed to update order status', 'error');
    } finally {
      setUpdatingOrderId(null);
    }
  };

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

  // Filter orders
  const filteredOrders = orders.filter(order => {
    const matchesStatus = statusFilter === 'ALL' || order.status === statusFilter;
    const query = searchQuery.toLowerCase().trim();
    const matchesQuery = !query ||
      order.id.toString().includes(query) ||
      order.customerName?.toLowerCase().includes(query) ||
      order.customerEmail?.toLowerCase().includes(query) ||
      order.shippingAddress?.toLowerCase().includes(query);
    return matchesStatus && matchesQuery;
  });

  // KPI Calculations
  const totalRevenue = orders.reduce((acc, o) => acc + (o.totalAmount || 0), 0);
  const confirmedCount = orders.filter(o => o.status === 'CONFIRMED' || o.status === 'PROCESSING').length;
  const shippedCount = orders.filter(o => o.status === 'SHIPPED').length;
  const deliveredCount = orders.filter(o => o.status === 'DELIVERED').length;

  return (
    <div className="container animate-fade-in" style={{ paddingTop: '2.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2.25rem', marginBottom: '0.35rem' }}>Order Management</h1>
          <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
            Admin Dashboard &bull; Track customer deliveries, process fulfillment, and update order statuses
          </p>
        </div>

        <button
          className="btn btn-secondary btn-sm"
          onClick={fetchOrders}
        >
          <RefreshCw size={14} /> Refresh Orders
        </button>
      </div>

      {/* KPI Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
        <div className="card" style={{ padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '46px', height: '46px', borderRadius: '12px', background: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Package size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Total Orders</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800 }}>{orders.length}</div>
          </div>
        </div>

        <div className="card" style={{ padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '46px', height: '46px', borderRadius: '12px', background: '#ecfdf5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <IndianRupee size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Total Revenue</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800 }}>{formatPrice(totalRevenue)}</div>
          </div>
        </div>

        <div className="card" style={{ padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '46px', height: '46px', borderRadius: '12px', background: '#fffbeb', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Clock size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Active / Processing</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#d97706' }}>{confirmedCount}</div>
          </div>
        </div>

        <div className="card" style={{ padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '46px', height: '46px', borderRadius: '12px', background: '#eef2ff', color: '#4f46e5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Truck size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>In Transit / Shipped</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#4f46e5' }}>{shippedCount}</div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="card" style={{ padding: '1.25rem 1.5rem', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Status Tabs */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {['ALL', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`btn btn-sm ${statusFilter === st ? 'btn-primary' : 'btn-secondary'}`}
                style={{ borderRadius: 'var(--radius-full)' }}
              >
                {st}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div style={{ position: 'relative', width: '280px' }}>
            <Search size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Search by Order ID or Customer..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="form-control"
              style={{ padding: '0.45rem 0.75rem 0.45rem 2.2rem', fontSize: '0.85rem', height: '36px' }}
            />
          </div>
        </div>
      </div>

      {/* Orders List */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
          Loading customer orders...
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>No Orders Found</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            No orders match the selected filters or search criteria.
          </p>
        </div>
      ) : (
        <div>
          {filteredOrders.map(order => (
            <div key={order.id} className="order-card card-hover">
              {/* Order Header */}
              <div className="order-card-header">
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Order #{order.id}</h3>
                    {getStatusBadge(order.status)}
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      Customer: <strong>{order.customerName}</strong> ({order.customerEmail})
                    </span>
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

                {/* Right: Total and Status Changer */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.65rem' }}>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Order Total</div>
                    <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--primary)' }}>
                      {formatPrice(order.totalAmount)}
                    </div>
                  </div>

                  {/* Status Dropdown */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Update Status:</span>
                    <select
                      value={order.status}
                      disabled={updatingOrderId === order.id}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      className="form-control"
                      style={{
                        padding: '0.35rem 0.65rem',
                        fontSize: '0.825rem',
                        fontWeight: 700,
                        height: '32px',
                        width: 'auto',
                        backgroundColor: '#f8fafc',
                        cursor: 'pointer'
                      }}
                    >
                      <option value="CONFIRMED">CONFIRMED</option>
                      <option value="PROCESSING">PROCESSING</option>
                      <option value="SHIPPED">SHIPPED</option>
                      <option value="DELIVERED">DELIVERED</option>
                      <option value="CANCELLED">CANCELLED</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Order Items Table */}
              <table className="order-items-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Price</th>
                    <th style={{ textAlign: 'center' }}>Quantity</th>
                    <th style={{ textAlign: 'right' }}>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items && order.items.map((item, idx) => (
                    <tr key={idx}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <img
                            src={item.imageUrl || 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=800&q=80'}
                            alt={item.productName}
                            style={{ width: '40px', height: '40px', borderRadius: '6px', objectFit: 'cover' }}
                          />
                          <div>
                            <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{item.productName}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Product #{item.productId}</div>
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
          ))}
        </div>
      )}
    </div>
  );
}

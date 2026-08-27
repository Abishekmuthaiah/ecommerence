import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, RefreshCw, Layers, AlertTriangle, CheckCircle, Package, ArrowUpRight } from 'lucide-react';
import { productService } from '../services/productService';
import { useCart } from '../context/CartContext';

export function AdminProducts() {
  const { showToast } = useCart();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Electronics',
    stock: '',
    imageUrl: ''
  });

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await productService.getAllProducts();
      setProducts(data || []);
    } catch (err) {
      showToast('Error loading products', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleOpenCreateModal = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      description: '',
      price: '',
      category: 'Electronics',
      stock: '20',
      imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80'
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description || '',
      price: product.price.toString(),
      category: product.category,
      stock: product.stock.toString(),
      imageUrl: product.imageUrl || ''
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) return;

    try {
      await productService.deleteProduct(id);
      showToast(`Product "${name}" deleted successfully`, 'info');
      fetchProducts();
    } catch (err) {
      showToast(err.message || 'Failed to delete product', 'error');
    }
  };

  const handleStockAdjust = async (id, currentStock, delta) => {
    const newStock = Math.max(0, currentStock + delta);
    try {
      await productService.updateStock(id, 0, newStock);
      showToast(`Stock updated to ${newStock}`, 'success');
      fetchProducts();
    } catch (err) {
      showToast(err.message || 'Failed to update stock', 'error');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      name: formData.name.trim(),
      description: formData.description.trim(),
      price: parseFloat(formData.price),
      category: formData.category.trim(),
      stock: parseInt(formData.stock, 10),
      imageUrl: formData.imageUrl.trim()
    };

    try {
      if (editingProduct) {
        await productService.updateProduct(editingProduct.id, payload);
        showToast(`Product updated successfully!`, 'success');
      } else {
        await productService.createProduct(payload);
        showToast(`Product "${payload.name}" created!`, 'success');
      }
      setIsModalOpen(false);
      fetchProducts();
    } catch (err) {
      showToast(err.message || 'Failed to save product', 'error');
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price || 0);
  };

  // KPI Calculations
  const totalProducts = products.length;
  const lowStockCount = products.filter(p => p.stock > 0 && p.stock <= 5).length;
  const outOfStockCount = products.filter(p => p.stock <= 0).length;
  const totalStockUnits = products.reduce((acc, p) => acc + (p.stock || 0), 0);

  return (
    <div className="container animate-fade-in" style={{ paddingTop: '2.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2.25rem', marginBottom: '0.35rem' }}>Product Catalog</h1>
          <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
            Admin Dashboard &bull; Manage inventory levels, prices, and catalog items
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="btn btn-secondary btn-sm" onClick={fetchProducts}>
            <RefreshCw size={14} /> Refresh
          </button>
          <button className="btn btn-primary btn-sm" onClick={handleOpenCreateModal}>
            <Plus size={16} /> Add Product
          </button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
        <div className="card" style={{ padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '46px', height: '46px', borderRadius: '12px', background: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Package size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Total Products</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800 }}>{totalProducts}</div>
          </div>
        </div>

        <div className="card" style={{ padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '46px', height: '46px', borderRadius: '12px', background: '#ecfdf5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Layers size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Total Units in Stock</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800 }}>{totalStockUnits}</div>
          </div>
        </div>

        <div className="card" style={{ padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '46px', height: '46px', borderRadius: '12px', background: '#fffbeb', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <AlertTriangle size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Low Stock Alert</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: lowStockCount > 0 ? '#d97706' : 'inherit' }}>{lowStockCount}</div>
          </div>
        </div>

        <div className="card" style={{ padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '46px', height: '46px', borderRadius: '12px', background: '#fef2f2', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <AlertTriangle size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Out of Stock</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: outOfStockCount > 0 ? '#ef4444' : 'inherit' }}>{outOfStockCount}</div>
          </div>
        </div>
      </div>

      {/* Product Table */}
      <div className="card" style={{ overflow: 'hidden' }}>
        <table className="order-items-table" style={{ width: '100%' }}>
          <thead>
            <tr>
              <th style={{ width: '60px' }}>ID</th>
              <th>Product Details</th>
              <th>Category</th>
              <th>Price</th>
              <th style={{ textAlign: 'center' }}>Stock Adjustment</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
                  Loading catalog inventory...
                </td>
              </tr>
            ) : products.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '4rem' }}>
                  No products in catalog. Click "Add Product" to create one.
                </td>
              </tr>
            ) : (
              products.map(product => (
                <tr key={product.id}>
                  <td style={{ fontWeight: 700, color: 'var(--text-muted)' }}>#{product.id}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                      <img
                        src={product.imageUrl || 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=800&q=80'}
                        alt={product.name}
                        style={{ width: '48px', height: '48px', borderRadius: '8px', objectFit: 'cover', background: 'var(--bg-subtle)' }}
                      />
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{product.name}</div>
                        <div style={{ fontSize: '0.775rem', color: 'var(--text-secondary)', maxWidth: '380px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {product.description}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="badge badge-primary">{product.category}</span>
                  </td>
                  <td style={{ fontWeight: 800 }}>
                    {formatPrice(product.price)}
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                      <button
                        className="btn btn-secondary btn-sm"
                        style={{ padding: '2px 8px', fontSize: '0.8rem', fontWeight: 700 }}
                        onClick={() => handleStockAdjust(product.id, product.stock, -5)}
                        title="Reduce stock by 5"
                      >
                        -5
                      </button>
                      <span className={`badge ${product.stock <= 0 ? 'badge-danger' : product.stock <= 5 ? 'badge-warning' : 'badge-success'}`} style={{ minWidth: '46px', justifyContent: 'center', fontWeight: 800 }}>
                        {product.stock}
                      </span>
                      <button
                        className="btn btn-secondary btn-sm"
                        style={{ padding: '2px 8px', fontSize: '0.8rem', fontWeight: 700 }}
                        onClick={() => handleStockAdjust(product.id, product.stock, 5)}
                        title="Add 5 units to stock"
                      >
                        +5
                      </button>
                    </div>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => handleOpenEditModal(product)}
                        title="Edit product"
                      >
                        <Edit2 size={14} /> Edit
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(product.id, product.name)}
                        title="Delete product"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add / Edit Product Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content animate-fade-in" onClick={e => e.stopPropagation()}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '0.35rem' }}>
              {editingProduct ? `Edit Product #${editingProduct.id}` : 'Create New Product'}
            </h2>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
              Fill in product specifications and initial inventory.
            </p>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Product Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Apple MacBook Air M3"
                  className="form-control"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select
                    className="form-control"
                    value={formData.category}
                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                  >
                    <option value="Electronics">Electronics</option>
                    <option value="Accessories">Accessories</option>
                    <option value="Audio">Audio</option>
                    <option value="Wearables">Wearables</option>
                    <option value="Computing">Computing</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Price (₹)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    placeholder="e.g. 75000"
                    className="form-control"
                    value={formData.price}
                    onChange={e => setFormData({ ...formData, price: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Initial Stock</label>
                  <input
                    type="number"
                    min="0"
                    required
                    placeholder="e.g. 25"
                    className="form-control"
                    value={formData.stock}
                    onChange={e => setFormData({ ...formData, stock: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Image URL</label>
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/..."
                    className="form-control"
                    value={formData.imageUrl}
                    onChange={e => setFormData({ ...formData, imageUrl: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  rows="3"
                  placeholder="Enter specifications and features..."
                  className="form-control"
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1.75rem' }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>

                <button type="submit" className="btn btn-primary">
                  {editingProduct ? 'Save Changes' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

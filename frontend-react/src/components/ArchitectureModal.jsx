import React from 'react';
import { X, Server, Database, ArrowRight, Layers, Cpu, ShieldCheck } from 'lucide-react';

export function ArchitectureModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content animate-fade-in" style={{ maxWidth: '780px' }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
              <Layers size={20} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.25rem' }}>Microservices System Architecture</h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>2 Independent Spring Boot Microservices + MySQL / SQL + React</p>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
            <X size={22} />
          </button>
        </div>

        {/* Architecture Diagram Visualization */}
        <div style={{ background: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)', padding: '1.25rem', marginBottom: '1.5rem', border: '1px solid var(--border-light)' }}>
          <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: '#eff6ff', padding: '0.4rem 1rem', borderRadius: '20px', border: '1px solid #bfdbfe', fontWeight: 600, color: '#1d4ed8', fontSize: '0.85rem' }}>
              <Cpu size={16} /> React.js Frontend UI (Port 3000)
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', position: 'relative' }}>
            {/* Product Service Box */}
            <div style={{ background: 'white', padding: '1rem', borderRadius: '8px', border: '1px solid #bfdbfe', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <Server size={18} color="#2563eb" />
                <span style={{ fontWeight: 700, fontSize: '0.95rem', color: '#1e40af' }}>Product Service</span>
                <span className="badge badge-primary" style={{ marginLeft: 'auto' }}>Port 8081</span>
              </div>
              <ul style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', paddingLeft: '1.2rem', marginBottom: '0.75rem', lineHeight: '1.6' }}>
                <li>Product Catalog CRUD</li>
                <li>Search & Category Filter</li>
                <li>Stock Management & Inventory</li>
              </ul>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: '#0369a1', background: '#f0f9ff', padding: '0.35rem 0.6rem', borderRadius: '4px' }}>
                <Database size={14} /> Database: <code>product_db</code>
              </div>
            </div>

            {/* Order & Cart Service Box */}
            <div style={{ background: 'white', padding: '1rem', borderRadius: '8px', border: '1px solid #a7f3d0', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <Server size={18} color="#059669" />
                <span style={{ fontWeight: 700, fontSize: '0.95rem', color: '#065f46' }}>Order & Cart Service</span>
                <span className="badge badge-success" style={{ marginLeft: 'auto' }}>Port 8082</span>
              </div>
              <ul style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', paddingLeft: '1.2rem', marginBottom: '0.75rem', lineHeight: '1.6' }}>
                <li>Shopping Cart Management</li>
                <li>Order Creation & Checkout</li>
                <li>Order History & Tracking</li>
              </ul>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: '#047857', background: '#ecfdf5', padding: '0.35rem 0.6rem', borderRadius: '4px' }}>
                <Database size={14} /> Database: <code>order_db</code>
              </div>
            </div>
          </div>

          {/* Inter-service Communication Note */}
          <div style={{ marginTop: '1rem', background: '#fefce8', border: '1px solid #fef08a', padding: '0.6rem 0.9rem', borderRadius: '6px', fontSize: '0.8rem', color: '#854d0e', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ArrowRight size={16} />
            <span><strong>Inter-Service REST Communication:</strong> Order Service verifies stock and deducts inventory on Product Service via <code>RestTemplate</code> during checkout.</span>
          </div>
        </div>

        {/* REST API Quick Reference */}
        <div style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1rem', marginBottom: '0.75rem' }}>REST API Endpoints</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div style={{ background: '#f8fafc', padding: '0.85rem', borderRadius: '6px', border: '1px solid var(--border-light)' }}>
              <div style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--primary)', marginBottom: '0.4rem' }}>Product Service (:8081)</div>
              <div style={{ fontSize: '0.775rem', fontFamily: 'monospace', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                <div>GET /api/products</div>
                <div>GET /api/products/&#123;id&#125;</div>
                <div>GET /api/products/search?name=...</div>
                <div>POST /api/products</div>
                <div>PUT /api/products/&#123;id&#125;/stock</div>
              </div>
            </div>

            <div style={{ background: '#f8fafc', padding: '0.85rem', borderRadius: '6px', border: '1px solid var(--border-light)' }}>
              <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#059669', marginBottom: '0.4rem' }}>Order & Cart Service (:8082)</div>
              <div style={{ fontSize: '0.775rem', fontFamily: 'monospace', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                <div>GET /api/cart/&#123;userId&#125;</div>
                <div>POST /api/cart/&#123;userId&#125;/items</div>
                <div>DELETE /api/cart/&#123;userId&#125;/items/&#123;pId&#125;</div>
                <div>POST /api/orders</div>
                <div>GET /api/orders/&#123;userId&#125;</div>
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button className="btn btn-primary btn-sm" onClick={onClose}>
            Got it, Close
          </button>
        </div>
      </div>
    </div>
  );
}

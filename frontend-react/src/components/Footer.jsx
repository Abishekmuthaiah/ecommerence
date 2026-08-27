import React from 'react';
import { ShoppingBag, ShieldCheck, Truck, Headphones, RotateCcw, Shield } from 'lucide-react';
import { useUser } from '../context/UserContext';

export function Footer({ onNavigate }) {
  const { currentUser, toggleRole } = useUser();
  const isAdmin = currentUser && currentUser.role === 'admin';

  return (
    <footer style={{ backgroundColor: 'white', borderTop: '1px solid var(--border-light)', marginTop: 'auto', paddingTop: '3rem', paddingBottom: '2rem' }}>
      <div className="container">
        {/* Value Assurances */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', paddingBottom: '2.5rem', borderBottom: '1px solid var(--border-light)', marginBottom: '2.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Truck size={22} />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>Fast Delivery</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Free shipping on orders over ₹1,000</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: '#ecfdf5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ShieldCheck size={22} />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>Secure Payments</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>256-bit encrypted checkout</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: '#fffbeb', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <RotateCcw size={22} />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>Easy Returns</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>7-day hassle-free replacement</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: '#eef2ff', color: '#4f46e5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Headphones size={22} />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>24/7 Support</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Dedicated customer care</div>
            </div>
          </div>
        </div>

        {/* Footer Bottom info */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
              <ShoppingBag size={16} />
            </div>
            <span style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--text-main)' }}>ShopZone</span>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>&bull; Modern Online Shopping Platform</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Customer Help</span>
            <button
              onClick={() => {
                if (!isAdmin) {
                  toggleRole();
                }
                if (onNavigate) onNavigate('admin-orders');
              }}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                fontSize: '0.85rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.2rem 0.4rem',
                borderRadius: '4px'
              }}
            >
              <Shield size={13} /> {isAdmin ? 'Admin Dashboard' : 'Admin Portal'}
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}


import React, { useState } from 'react';
import { User, Mail, Lock, Phone, MapPin, Shield, UserPlus, ArrowRight } from 'lucide-react';
import { useUser } from '../context/UserContext';
import { useCart } from '../context/CartContext';

export function Register({ onNavigate }) {
  const { register } = useUser();
  const { showToast } = useCart();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: '',
    role: 'customer'
  });

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.name.trim() || !formData.email.trim() || !formData.password) {
      setErrorMsg('Please fill in all required fields.');
      return;
    }

    if (formData.password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setErrorMsg('Passwords do not match. Please retype password.');
      return;
    }

    try {
      setSubmitting(true);
      const newUser = await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone || '+91 9876543210',
        address: formData.address || 'Tech City, India',
        role: formData.role
      });

      // Role-Based Navigation Routing after Registration
      if (newUser.role === 'admin') {
        showToast(`Admin account created! Welcome ${newUser.name}, redirecting to Admin Orders...`, 'success');
        onNavigate('admin-orders');
      } else {
        showToast(`Registration successful! Welcome to ShopZone, ${newUser.name}!`, 'success');
        onNavigate('home');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Registration failed. Please try again.');
      showToast(err.message || 'Registration failed', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container animate-fade-in" style={{ paddingTop: '3rem', paddingBottom: '3.5rem', display: 'flex', justifyContent: 'center' }}>
      <div style={{ width: '100%', maxWidth: '560px' }}>
        <div className="card" style={{ padding: '2.5rem', boxShadow: 'var(--shadow-xl)' }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'var(--gradient-primary)', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem', boxShadow: '0 4px 12px rgba(79, 70, 229, 0.3)' }}>
              <UserPlus size={28} />
            </div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.4rem' }}>Create an Account</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.925rem' }}>
              Join ShopZone to start shopping or managing orders
            </p>
          </div>

          {errorMsg && (
            <div style={{ backgroundColor: 'var(--danger-light)', border: '1px solid var(--danger-border)', color: 'var(--danger-text)', padding: '0.85rem 1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', fontSize: '0.875rem' }}>
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleRegisterSubmit}>
            {/* Account Role Selector */}
            <div className="form-group">
              <label className="form-label">Select Account Type</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div
                  onClick={() => setFormData({ ...formData, role: 'customer' })}
                  style={{
                    border: formData.role === 'customer' ? '2px solid var(--primary)' : '1.5px solid var(--border-light)',
                    backgroundColor: formData.role === 'customer' ? 'var(--primary-light)' : '#ffffff',
                    padding: '0.85rem',
                    borderRadius: 'var(--radius-md)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.65rem',
                    transition: 'all var(--transition-fast)'
                  }}
                >
                  <User size={18} color={formData.role === 'customer' ? 'var(--primary)' : 'var(--text-secondary)'} />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem', color: formData.role === 'customer' ? 'var(--primary)' : 'var(--text-main)' }}>Customer</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Shop & order tech</div>
                  </div>
                </div>

                <div
                  onClick={() => setFormData({ ...formData, role: 'admin' })}
                  style={{
                    border: formData.role === 'admin' ? '2px solid var(--primary)' : '1.5px solid var(--border-light)',
                    backgroundColor: formData.role === 'admin' ? 'var(--primary-light)' : '#ffffff',
                    padding: '0.85rem',
                    borderRadius: 'var(--radius-md)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.65rem',
                    transition: 'all var(--transition-fast)'
                  }}
                >
                  <Shield size={18} color={formData.role === 'admin' ? 'var(--primary)' : 'var(--text-secondary)'} />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem', color: formData.role === 'admin' ? 'var(--primary)' : 'var(--text-main)' }}>Admin</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Catalog & orders</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Name */}
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <div style={{ position: 'relative' }}>
                <User size={17} style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  required
                  placeholder="e.g. John Doe"
                  className="form-control"
                  style={{ paddingLeft: '2.5rem' }}
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
            </div>

            {/* Email */}
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={17} style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  className="form-control"
                  style={{ paddingLeft: '2.5rem' }}
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            {/* Password and Confirm */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Password</label>
                <div style={{ position: 'relative' }}>
                  <Lock size={17} style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input
                    type="password"
                    required
                    placeholder="Min 6 chars"
                    className="form-control"
                    style={{ paddingLeft: '2.5rem' }}
                    value={formData.password}
                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Confirm Password</label>
                <div style={{ position: 'relative' }}>
                  <Lock size={17} style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input
                    type="password"
                    required
                    placeholder="Repeat password"
                    className="form-control"
                    style={{ paddingLeft: '2.5rem' }}
                    value={formData.confirmPassword}
                    onChange={e => setFormData({ ...formData, confirmPassword: e.target.value })}
                  />
                </div>
              </div>
            </div>

            {/* Phone & Address */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <div style={{ position: 'relative' }}>
                  <Phone size={17} style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input
                    type="tel"
                    placeholder="9876543210"
                    className="form-control"
                    style={{ paddingLeft: '2.5rem' }}
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Delivery Address / City</label>
                <div style={{ position: 'relative' }}>
                  <MapPin size={17} style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input
                    type="text"
                    placeholder="Bangalore, Karnataka"
                    className="form-control"
                    style={{ paddingLeft: '2.5rem' }}
                    value={formData.address}
                    onChange={e => setFormData({ ...formData, address: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-lg"
              style={{ width: '100%', marginTop: '0.5rem', marginBottom: '1.5rem' }}
              disabled={submitting}
            >
              {submitting ? 'Creating Account...' : 'Complete Registration'} <ArrowRight size={18} />
            </button>
          </form>

          {/* Footer switch to login */}
          <div style={{ textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            Already have an account?{' '}
            <button
              onClick={() => onNavigate('login')}
              style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 700, cursor: 'pointer', textDecoration: 'underline' }}
            >
              Sign In here
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

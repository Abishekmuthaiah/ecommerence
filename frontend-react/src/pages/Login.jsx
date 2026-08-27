import React, { useState } from 'react';
import { Mail, Lock, LogIn, Shield, User, ArrowRight, CheckCircle2, Sparkles } from 'lucide-react';
import { useUser } from '../context/UserContext';
import { useCart } from '../context/CartContext';

export function Login({ onNavigate }) {
  const { login } = useUser();
  const { showToast } = useCart();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLoginSubmit = async (e) => {
    if (e) e.preventDefault();
    setErrorMsg('');

    if (!email || !password) {
      setErrorMsg('Please enter both email and password.');
      return;
    }

    try {
      setSubmitting(true);
      const user = await login(email, password);

      // Role-Based Navigation Routing
      if (user.role === 'admin') {
        showToast(`Welcome Admin ${user.name}! Redirecting to Admin Dashboard...`, 'success');
        onNavigate('admin-orders');
      } else {
        showToast(`Welcome back, ${user.name}!`, 'success');
        onNavigate('home');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Login failed. Please check credentials.');
      showToast(err.message || 'Login failed', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleQuickLogin = async (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    try {
      setSubmitting(true);
      const user = await login(demoEmail, demoPassword);
      if (user.role === 'admin') {
        showToast(`Logged in as Admin! Redirecting to Admin Orders...`, 'success');
        onNavigate('admin-orders');
      } else {
        showToast(`Welcome, ${user.name}!`, 'success');
        onNavigate('home');
      }
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container animate-fade-in" style={{ paddingTop: '3.5rem', paddingBottom: '3.5rem', display: 'flex', justifyContent: 'center' }}>
      <div style={{ width: '100%', maxWidth: '480px' }}>
        {/* Card */}
        <div className="card" style={{ padding: '2.5rem', boxShadow: 'var(--shadow-xl)' }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'var(--gradient-primary)', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem', boxShadow: '0 4px 12px rgba(79, 70, 229, 0.3)' }}>
              <LogIn size={28} />
            </div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.4rem' }}>Welcome Back</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.925rem' }}>
              Sign in to your ShopZone account
            </p>
          </div>

          {errorMsg && (
            <div style={{ backgroundColor: 'var(--danger-light)', border: '1px solid var(--danger-border)', color: 'var(--danger-text)', padding: '0.85rem 1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', fontSize: '0.875rem' }}>
              {errorMsg}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLoginSubmit}>
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
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={17} style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  className="form-control"
                  style={{ paddingLeft: '2.5rem' }}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-lg"
              style={{ width: '100%', marginTop: '0.5rem', marginBottom: '1.5rem' }}
              disabled={submitting}
            >
              {submitting ? 'Signing In...' : 'Sign In'} <ArrowRight size={18} />
            </button>
          </form>

          {/* 1-Click Demo Logins */}
          <div style={{ paddingTop: '1.5rem', borderTop: '1px solid var(--border-light)', marginBottom: '1.5rem' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'center', marginBottom: '1rem' }}>
              ⚡ 1-Click Quick Demo Sign In
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                style={{ justifyContent: 'space-between', padding: '0.65rem 1rem' }}
                onClick={() => handleQuickLogin('admin@shopzone.com', 'admin123')}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Shield size={16} color="var(--primary)" />
                  <span style={{ fontWeight: 700 }}>Admin Portal</span>
                </div>
                <span className="badge badge-primary">Admin Access &rarr;</span>
              </button>

              <button
                type="button"
                className="btn btn-secondary btn-sm"
                style={{ justifyContent: 'space-between', padding: '0.65rem 1rem' }}
                onClick={() => handleQuickLogin('alex@example.com', 'password123')}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <User size={16} color="#059669" />
                  <span style={{ fontWeight: 700 }}>Alex Johnson</span>
                </div>
                <span className="badge badge-success">Customer &rarr;</span>
              </button>

              <button
                type="button"
                className="btn btn-secondary btn-sm"
                style={{ justifyContent: 'space-between', padding: '0.65rem 1rem' }}
                onClick={() => handleQuickLogin('sophia@example.com', 'password123')}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <User size={16} color="#d97706" />
                  <span style={{ fontWeight: 700 }}>Sophia Patel</span>
                </div>
                <span className="badge badge-warning">Customer &rarr;</span>
              </button>
            </div>
          </div>

          {/* Footer switch to register */}
          <div style={{ textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            Don't have an account?{' '}
            <button
              onClick={() => onNavigate('register')}
              style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 700, cursor: 'pointer', textDecoration: 'underline' }}
            >
              Create an account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

import React, { useState, useRef, useEffect } from 'react';
import { ShoppingBag, ShoppingCart, Search, Package, User, Cpu, ClipboardList, Shield, ChevronDown, Check, Sparkles, ArrowLeftRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useUser, USERS_LIST } from '../context/UserContext';

export function Navbar({ activePage, setActivePage, searchQuery, setSearchQuery }) {
  const { cart } = useCart();
  const { currentUser, selectUser } = useUser();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (activePage !== 'products') {
      setActivePage('products');
    }
  };

  const handleUserSelect = (u) => {
    selectUser(u.id);
    setUserMenuOpen(false);
    if (u.role === 'admin') {
      setActivePage('admin-orders');
    } else {
      // If currently on an admin page, go back to home
      if (activePage === 'admin-products' || activePage === 'admin-orders') {
        setActivePage('home');
      }
    }
  };

  const isAdmin = currentUser && currentUser.role === 'admin';

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        {/* Brand Logo */}
        <div
          className="brand-logo"
          style={{ cursor: 'pointer' }}
          onClick={() => setActivePage(isAdmin ? 'admin-orders' : 'home')}
        >
          <div className="brand-icon-box">
            <ShoppingBag size={22} />
          </div>
          <span className="brand-text">Shop<span>Zone</span></span>
        </div>

        {/* Global Search Bar (Only shown for customer shopping views) */}
        {!isAdmin && (
          <form className="nav-search" onSubmit={handleSearchSubmit}>
            <Search size={18} className="search-icon" />
            <input
              type="text"
              placeholder="Search laptops, smartphones, accessories..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (activePage !== 'products' && e.target.value.trim().length > 0) {
                  setActivePage('products');
                }
              }}
            />
          </form>
        )}

        {/* Navigation Links */}
        <nav className="nav-links">
          {/* Customer Navigation Links */}
          {!isAdmin ? (
            <>
              <button
                className={`nav-link ${activePage === 'home' ? 'active' : ''}`}
                onClick={() => setActivePage('home')}
              >
                Home
              </button>

              <button
                className={`nav-link ${activePage === 'products' ? 'active' : ''}`}
                onClick={() => setActivePage('products')}
              >
                Products
              </button>

              <button
                className={`nav-link ${activePage === 'orders' ? 'active' : ''}`}
                onClick={() => setActivePage('orders')}
              >
                <Package size={16} />
                <span>My Orders</span>
              </button>

              {/* Cart Button */}
              <button
                className={`nav-cart-btn ${activePage === 'cart' ? 'active' : ''}`}
                onClick={() => setActivePage('cart')}
              >
                <ShoppingCart size={17} />
                <span>Cart</span>
                {cart && cart.totalItems > 0 && (
                  <span className="cart-count-badge">{cart.totalItems}</span>
                )}
              </button>
            </>
          ) : (
            /* Admin Only Navigation Links */
            <>
              <button
                className={`nav-link ${activePage === 'admin-products' ? 'active' : ''}`}
                onClick={() => setActivePage('admin-products')}
                style={{ color: 'var(--primary)', fontWeight: 700 }}
              >
                <Cpu size={16} />
                <span>Manage Products</span>
              </button>

              <button
                className={`nav-link ${activePage === 'admin-orders' ? 'active' : ''}`}
                onClick={() => setActivePage('admin-orders')}
                style={{ color: '#059669', fontWeight: 700 }}
              >
                <ClipboardList size={16} />
                <span>Manage Orders</span>
              </button>
            </>
          )}

          {/* User & Role Switcher Dropdown */}
          <div style={{ position: 'relative' }} ref={menuRef}>
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.4rem 0.85rem',
                backgroundColor: isAdmin ? '#eef2ff' : 'var(--bg-subtle)',
                border: isAdmin ? '1.5px solid #c7d2fe' : '1px solid var(--border-light)',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.85rem',
                fontWeight: 700,
                color: isAdmin ? 'var(--primary)' : 'var(--text-main)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: userMenuOpen ? '0 0 0 2px rgba(79, 70, 229, 0.2)' : 'none'
              }}
            >
              {isAdmin ? (
                <Shield size={15} color="var(--primary)" />
              ) : (
                <User size={15} color="var(--primary)" />
              )}
              <span>{currentUser?.name || 'Alex Johnson'}</span>
              <span style={{ fontSize: '0.72rem', padding: '0.1rem 0.4rem', borderRadius: '4px', backgroundColor: isAdmin ? 'var(--primary)' : '#e2e8f0', color: isAdmin ? '#ffffff' : '#475569', fontWeight: 600 }}>
                {isAdmin ? 'Admin' : currentUser?.id === 1 ? 'User 1' : 'User 2'}
              </span>
              <ChevronDown size={14} color="var(--text-muted)" style={{ transform: userMenuOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
            </button>

            {/* Floating Switcher Menu */}
            {userMenuOpen && (
              <div
                style={{
                  position: 'absolute',
                  top: 'calc(100% + 8px)',
                  right: 0,
                  width: '280px',
                  backgroundColor: '#ffffff',
                  borderRadius: 'var(--radius-lg)',
                  boxShadow: 'var(--shadow-xl)',
                  border: '1px solid var(--border-light)',
                  padding: '0.6rem',
                  zIndex: 1000,
                  animation: 'fadeIn 0.15s ease'
                }}
              >
                <div style={{ padding: '0.4rem 0.6rem 0.6rem', borderBottom: '1px solid var(--border-light)', marginBottom: '0.4rem' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Switch Active Persona
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                    Select customer account or admin portal
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                  {USERS_LIST.map((u) => {
                    const isSelected = currentUser?.id === u.id;
                    const isAccountAdmin = u.role === 'admin';
                    return (
                      <div
                        key={u.id}
                        onClick={() => handleUserSelect(u)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '0.6rem 0.75rem',
                          borderRadius: 'var(--radius-md)',
                          cursor: 'pointer',
                          backgroundColor: isSelected ? (isAccountAdmin ? '#eef2ff' : 'var(--bg-subtle)') : 'transparent',
                          border: isSelected ? (isAccountAdmin ? '1px solid #c7d2fe' : '1px solid var(--border-light)') : '1px solid transparent',
                          transition: 'all 0.15s ease'
                        }}
                        onMouseEnter={(e) => {
                          if (!isSelected) e.currentTarget.style.backgroundColor = 'var(--bg-subtle)';
                        }}
                        onMouseLeave={(e) => {
                          if (!isSelected) e.currentTarget.style.backgroundColor = 'transparent';
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                          <div
                            style={{
                              width: '32px',
                              height: '32px',
                              borderRadius: '8px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              backgroundColor: isAccountAdmin ? '#eef2ff' : (u.id === 1 ? '#ecfdf5' : '#fffbeb'),
                              color: isAccountAdmin ? 'var(--primary)' : (u.id === 1 ? '#059669' : '#d97706')
                            }}
                          >
                            {isAccountAdmin ? <Shield size={16} /> : <User size={16} />}
                          </div>
                          <div>
                            <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-main)' }}>
                              {u.name}
                            </div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                              {isAccountAdmin ? 'Platform Administrator' : (u.id === 1 ? 'Customer • User 1' : 'Customer • User 2')}
                            </div>
                          </div>
                        </div>

                        {isSelected && (
                          <div style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Check size={12} strokeWidth={3} />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}




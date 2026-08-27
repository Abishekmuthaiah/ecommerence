import React, { useState } from 'react';
import { UserProvider, useUser } from './context/UserContext';
import { CartProvider } from './context/CartContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ToastContainer } from './components/Toast';
import { Home } from './pages/Home';
import { Products } from './pages/Products';
import { ProductDetails } from './pages/ProductDetails';
import { Cart } from './pages/Cart';
import { Orders } from './pages/Orders';
import { AdminProducts } from './pages/AdminProducts';
import { AdminOrders } from './pages/AdminOrders';
import './App.css';

function MainApp() {
  const { currentUser } = useUser();
  const [activePage, setActivePage] = useState('home');
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const handleSelectProduct = (productId) => {
    setSelectedProductId(productId);
    setActivePage('product-details');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectCategory = (category) => {
    setSelectedCategory(category);
    setActivePage('products');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigate = (page) => {
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="app-container">
      {/* Top Sticky Navigation */}
      <Navbar
        activePage={activePage}
        setActivePage={handleNavigate}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* Main Page Content Router */}
      <main className="main-content">
        {activePage === 'home' && (
          <Home
            onNavigate={handleNavigate}
            onSelectProduct={handleSelectProduct}
            onSelectCategory={handleSelectCategory}
          />
        )}

        {activePage === 'products' && (
          <Products
            onSelectProduct={handleSelectProduct}
            initialCategory={selectedCategory}
            initialSearch={searchQuery}
          />
        )}

        {activePage === 'product-details' && (
          <ProductDetails
            productId={selectedProductId}
            onBack={() => handleNavigate('products')}
            onNavigate={handleNavigate}
          />
        )}

        {activePage === 'cart' && (
          <Cart
            onNavigate={handleNavigate}
            onSelectProduct={handleSelectProduct}
          />
        )}

        {activePage === 'orders' && (
          <Orders
            onNavigate={handleNavigate}
            onSelectProduct={handleSelectProduct}
          />
        )}

        {activePage === 'admin-products' && (
          <AdminProducts />
        )}

        {activePage === 'admin-orders' && (
          <AdminOrders />
        )}
      </main>

      {/* Clean Light Footer */}
      <Footer onNavigate={handleNavigate} />

      {/* Toast Notifications */}
      <ToastContainer />
    </div>
  );
}

export function App() {
  return (
    <UserProvider>
      <CartProvider>
        <MainApp />
      </CartProvider>
    </UserProvider>
  );
}

export default App;


import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = ({ user, setUser, cartItems = [] }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear user tokens/session data
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Clear React user state if present
    if (setUser) {
      setUser(null);
    }
    
    // Redirect to login or home
    navigate('/login');
  };

  const totalCartCount = cartItems.reduce((acc, item) => acc + (item.quantity || 1), 0);

  return (
    <nav className="navbar">
      <div className="nav-brand">
        <Link to="/" style={{ textDecoration: 'none', color: 'inherit', fontWeight: 'bold', fontSize: '1.5rem' }}>
          🌱 GreenCart
        </Link>
      </div>

      <div className="nav-links" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <Link to="/">Shop</Link>
        <Link to="/cart">
          🛒 Cart {totalCartCount > 0 && <span className="cart-badge">({totalCartCount})</span>}
        </Link>

        {/* Show Admin Dashboard only for admin users */}
        {user && user.role === 'admin' && (
          <Link to="/admin" style={{ color: '#d97706', fontWeight: '600' }}>
            Admin Dashboard
          </Link>
        )}

        {user ? (
          <>
            <span className="user-welcome">Hello, {user.name || user.username || 'User'}</span>
            <button 
              onClick={handleLogout} 
              style={{
                backgroundColor: '#fca5a5',
                color: '#991b1b',
                border: 'none',
                padding: '6px 16px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: '600'
              }}
            >
              Logout
            </button>
          </>
        ) : (
          <Link to="/login" className="btn-login">Login</Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
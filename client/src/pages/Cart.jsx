import React from 'react';
import { useNavigate } from 'react-router-dom';

const Cart = ({ cartItems = [], setCartItems }) => {
  const navigate = useNavigate();

  const handleQuantityChange = (id, amount) => {
    setCartItems(prev =>
      prev.map(item => {
        if (item._id === id) {
          const newQty = item.quantity + amount;
          return newQty > 0 ? { ...item, quantity: newQty } : item;
        }
        return item;
      })
    );
  };

  const handleRemoveItem = (id) => {
    setCartItems(prev => prev.filter(item => item._id !== id));
  };

  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * (item.quantity || 1)), 0);

  const handleProceedToCheckout = () => {
    if (cartItems.length === 0) {
      alert("Your cart is empty!");
      return;
    }
    // Navigate to checkout or order summary page
    navigate('/checkout');
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h2>Shopping Cart</h2>
      
      {cartItems.length === 0 ? (
        <p>Your cart is currently empty. <button onClick={() => navigate('/')}>Continue Shopping</button></p>
      ) : (
        <div>
          <div className="cart-list">
            {cartItems.map((item) => (
              <div 
                key={item._id || item.id} 
                style={{
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  borderBottom: '1px solid #ddd', 
                  padding: '12px 0'
                }}
              >
                <div>
                  <h4 style={{ margin: 0 }}>{item.name}</h4>
                  <p style={{ margin: '4px 0', color: '#059669' }}>${item.price}</p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <button onClick={() => handleQuantityChange(item._id, -1)}>-</button>
                  <span>{item.quantity || 1}</span>
                  <button onClick={() => handleQuantityChange(item._id, 1)}>+</button>
                  <button 
                    onClick={() => handleRemoveItem(item._id)} 
                    style={{ color: '#dc2626', background: 'none', border: 'none', cursor: 'pointer', marginLeft: '10px' }}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '20px', textAlign: 'right' }}>
            <h3>Total: ${subtotal.toFixed(2)}</h3>
            <button 
              onClick={handleProceedToCheckout}
              style={{
                backgroundColor: '#059669',
                color: '#ffffff',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '6px',
                fontSize: '1rem',
                cursor: 'pointer',
                marginTop: '10px'
              }}
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
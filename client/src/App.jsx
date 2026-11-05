import React, { useState, useEffect } from 'react';

// Initial products categorized into sections
const initialProductsData = [
  {
    category: 'Personal Care',
    items: [
      {
        id: 1,
        name: 'Bamboo Toothbrush (4-Pack)',
        description: '100% biodegradable organic bamboo handle with BPA-free bristles.',
        price: 299,
        ecoScore: 'A',
        image: 'https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?auto=format&fit=crop&w=500&q=80',
      },
    ],
  },
  {
    category: 'Hydration & Drinkware',
    items: [
      {
        id: 2,
        name: 'Reusable Stainless Steel Water Bottle',
        description: 'Double-wall vacuum insulated water bottle, keeps drinks cold for 24 hours.',
        price: 799,
        ecoScore: 'A',
        image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=500&q=80',
      },
      {
        id: 4,
        name: 'Bamboo Fiber Coffee Cup',
        description: 'Reusable coffee cup made from eco-friendly bamboo fiber.',
        price: 399,
        ecoScore: 'A',
        image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=500&q=80',
      },
    ],
  },
  {
    category: 'Bags & Accessories',
    items: [
      {
        id: 3,
        name: 'Organic Cotton Shopping Bag',
        description: 'Heavy duty washable canvas tote bag for grocery shopping.',
        price: 199,
        ecoScore: 'B',
        image: 'https://images.unsplash.com/photo-1597484661643-2f5fef640dd1?auto=format&fit=crop&w=500&q=80',
      },
    ],
  },
];

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  
  // Registration States
  const [isRegistering, setIsRegistering] = useState(false);
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerName, setRegisterName] = useState('');
  
  // Navigation pages: 'shop', 'cart', 'checkout', 'orders', 'profile', 'admin', 'order-success'
  const [currentPage, setCurrentPage] = useState('shop'); 

  // Load products from localStorage with persistence fallback
  const [productsData, setProductsData] = useState(() => {
    const savedProducts = localStorage.getItem('greencart_products');
    return savedProducts ? JSON.parse(savedProducts) : initialProductsData;
  });

  // Load cart from localStorage
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('greencart_cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // Load orders history from localStorage
  const [orders, setOrders] = useState(() => {
    const savedOrders = localStorage.getItem('greencart_orders');
    return savedOrders ? JSON.parse(savedOrders) : [];
  });

  const [user, setUser] = useState({ name: '' });
  
  // Shipping details state for checkout form
  const [shippingDetails, setShippingDetails] = useState({
    fullName: '',
    address: '',
    city: '',
    phone: '',
    paymentMethod: 'Credit Card',
  });

  const [finalOrderSummary, setFinalOrderSummary] = useState({ items: [], total: 0 });

  // New Product Form State for Admin
  const [newProductName, setNewProductName] = useState('');
  const [newProductCategory, setNewProductCategory] = useState('Personal Care');
  const [newProductDesc, setNewProductDesc] = useState('');
  const [newProductPrice, setNewProductPrice] = useState('');
  const [newProductEco, setNewProductEco] = useState('A');
  const [newProductImage, setNewProductImage] = useState('');

  // Synchronize state changes to localStorage
  useEffect(() => {
    localStorage.setItem('greencart_products', JSON.stringify(productsData));
  }, [productsData]);

  useEffect(() => {
    localStorage.setItem('greencart_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('greencart_orders', JSON.stringify(orders));
  }, [orders]);

  // Handle Login action
  
const handleLogin = async (e) => {
  e.preventDefault();

  if (!usernameInput.trim() || !passwordInput.trim()) {
    return;
  }

  try {
    const response = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
  email: usernameInput.trim().toLowerCase(),
  password: passwordInput
})
    });

    const data = await response.json();

    if (!response.ok) {
      alert(data.message || 'Login failed.');
      return;
    }

    // Save the backend token
    localStorage.setItem('token', data.token);

    // Only the authorized admin gets admin access
    const adminStatus =
      data.user.email.toLowerCase() === 'boss@gmail.com' &&
      data.user.role === 'admin';

    setUser({
      name: data.user.email,
      email: data.user.email
    });

    setShippingDetails((prev) => ({
      ...prev,
      fullName: data.user.email
    }));

    setIsAdmin(adminStatus);
    setIsLoggedIn(true);
    setCurrentPage('shop');

  } catch (error) {
    console.error('Login error:', error);
    alert('Cannot connect to server. Please try again.');
  }
};


  // Handle Register action
  
const handleRegister = async (e) => {
  e.preventDefault();

  if (!registerEmail.trim() || !registerPassword.trim() || !registerName.trim()) {
    return;
  }

  try {
    const response = await fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
  name: registerName.trim(),
  email: registerEmail.trim().toLowerCase(),
  password: registerPassword
})
    });

    const data = await response.json();

    if (!response.ok) {
      alert(data.message || 'Registration failed.');
      return;
    }

    alert('Registration successful! Please log in.');

    setUsernameInput(registerEmail.trim().toLowerCase());
    setPasswordInput('');
    setRegisterEmail('');
    setRegisterPassword('');
    setRegisterName('');
    setIsRegistering(false);

  } catch (error) {
    console.error('Registration error:', error);
    alert('Cannot connect to server.');
  }
};


  // Handle Logout action
  const handleLogout = () => {
    setIsLoggedIn(false);
    setIsAdmin(false);
    setUsernameInput('');
    setPasswordInput('');
    setCurrentPage('shop');
  };

  // Add item to cart
  const addToCart = (product) => {
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.id === product.id);
      if (existing) {
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
    alert('Product added to cart successfully!');
  };

  // Update quantity (- or +)
  const updateQuantity = (id, delta) => {
    setCart((prevCart) =>
      prevCart
        .map((item) => {
          if (item.id === id) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  // Remove item completely from cart
  const removeFromCart = (id) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  // Add Product (Admin function)
  const handleAddProduct = (e) => {
    e.preventDefault();
    if (!newProductName || !newProductPrice) return;

    const newProduct = {
      id: Date.now(),
      name: newProductName,
      description: newProductDesc || 'Eco-friendly sustainable product.',
      price: parseFloat(newProductPrice),
      ecoScore: newProductEco,
      image: newProductImage || 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=500&q=80',
    };

    setProductsData((prevData) => {
      const categoryExists = prevData.find((sec) => sec.category === newProductCategory);
      if (categoryExists) {
        return prevData.map((sec) =>
          sec.category === newProductCategory
            ? { ...sec, items: [...sec.items, newProduct] }
            : sec
        );
      } else {
        return [...prevData, { category: newProductCategory, items: [newProduct] }];
      }
    });

    setNewProductName('');
    setNewProductDesc('');
    setNewProductPrice('');
    setNewProductImage('');
    alert('Product added successfully to database and localStorage!');
  };
  // Edit Product (Admin function)
const handleEditProduct = (category, product) => {
  const updatedName = prompt('Enter product name:', product.name);
  if (updatedName === null || !updatedName.trim()) return;

  const updatedPrice = prompt('Enter product price:', product.price);
  if (updatedPrice === null || isNaN(Number(updatedPrice))) return;

  const updatedDescription = prompt(
    'Enter product description:',
    product.description
  );
  if (updatedDescription === null) return;

  setProductsData((prevData) =>
    prevData.map((section) =>
      section.category === category
        ? {
            ...section,
            items: section.items.map((item) =>
              item.id === product.id
                ? {
                    ...item,
                    name: updatedName.trim(),
                    price: Number(updatedPrice),
                    description: updatedDescription,
                  }
                : item
            ),
          }
        : section
    )
  );

  alert('Product updated successfully!');
};

// Delete Product (Admin function)
const handleDeleteProduct = (category, productId) => {
  if (!window.confirm('Are you sure you want to delete this product?')) {
    return;
  }

  setProductsData((prevData) =>
    prevData
      .map((section) =>
        section.category === category
          ? {
              ...section,
              items: section.items.filter((item) => item.id !== productId),
            }
          : section
      )
      .filter((section) => section.items.length > 0)
  );

  alert('Product deleted successfully!');
};

  // Total count of items in cart
  const totalItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Total cart price
  const totalPrice = cart
    .reduce((sum, item) => sum + item.price * item.quantity, 0)
    .toFixed(2);

  // Handle final order confirmation from Checkout page
  const handlePlaceOrder = (e) => {
    e.preventDefault();
    if (cart.length === 0) return;

    const newOrder = {
      id: 'ORD-' + Math.floor(100000 + Math.random() * 900000),
      date: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      createdAt: new Date().toISOString(),
      customerName: shippingDetails.fullName,
      address: shippingDetails.address + ', ' + shippingDetails.city,
      phone: shippingDetails.phone,
      paymentMethod: shippingDetails.paymentMethod,
      items: [...cart],
      total: totalPrice,
      status: 'Processing',
    };

    setOrders((prev) => [newOrder, ...prev]);
    setFinalOrderSummary({ items: [...cart], total: totalPrice });
    setCart([]);
    setCurrentPage('order-success');
  };

  // If user is logged out, show Login or Register Screen
  
  // Front page for logged-out users
  if (!isLoggedIn) {
    return (
      <div style={{
        fontFamily: 'Arial, sans-serif',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#f0fdf4'
      }}>

        {/* NAVBAR */}
        <header style={{
          backgroundColor: '#ffffff',
          padding: '18px 6%',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '15px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.06)'
        }}>
          <h1 style={{
            color: '#064e3b',
            margin: 0,
            fontSize: '27px'
          }}>
            🌱 GreenCart
          </h1>

          <nav style={{
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
            flexWrap: 'wrap'
          }}>
            <a href="#home" style={{ color: '#064e3b', textDecoration: 'none' }}>Home</a>
            <a href="#about" style={{ color: '#064e3b', textDecoration: 'none' }}>About</a>
            <button
              onClick={() => {
                setIsRegistering(false);
                document.getElementById('login-section')?.scrollIntoView({ behavior: 'smooth' });
              }}
              style={{
                background: 'none',
                border: 'none',
                color: '#064e3b',
                cursor: 'pointer',
                fontSize: '15px'
              }}
            >
              Login
            </button>
            <button
              onClick={() => {
                setIsRegistering(true);
                document.getElementById('login-section')?.scrollIntoView({ behavior: 'smooth' });
              }}
              style={{
                backgroundColor: '#059669',
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '7px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              Register
            </button>
          </nav>
        </header>

        {/* HERO AND LOGIN FORM */}
        <main id="home" style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexWrap: 'wrap',
          gap: '45px',
          padding: '55px 6%'
        }}>

          {/* LEFT SIDE - WELCOME CONTENT */}
          <section id="about" style={{
            flex: '1 1 350px',
            maxWidth: '550px'
          }}>
            <p style={{
              color: '#059669',
              fontWeight: 'bold',
              letterSpacing: '2px'
            }}>
              SHOP GREEN. LIVE BETTER.
            </p>

            <h2 style={{
              fontSize: 'clamp(32px, 5vw, 48px)',
              color: '#064e3b',
              lineHeight: '1.2',
              margin: '15px 0'
            }}>
              Sustainable Shopping for a Greener Planet
            </h2>

            <p style={{
              color: '#4b5563',
              fontSize: '17px',
              lineHeight: '1.8'
            }}>
              Discover eco-friendly products and make a positive difference
              with every purchase. Choose reusable, sustainable and
              environmentally friendly alternatives.
            </p>

            <div style={{
              display: 'flex',
              gap: '20px',
              flexWrap: 'wrap',
              marginTop: '25px'
            }}>
              <div>
                <h3 style={{ color: '#059669', marginBottom: '5px' }}>🌿 Eco-Friendly</h3>
                <p style={{ color: '#6b7280', margin: 0 }}>Better choices for nature</p>
              </div>
              <div>
                <h3 style={{ color: '#059669', marginBottom: '5px' }}>♻️ Reusable</h3>
                <p style={{ color: '#6b7280', margin: 0 }}>Reduce plastic waste</p>
              </div>
            </div>
          </section>

          {/* RIGHT SIDE - LOGIN / REGISTER FORM */}
          <section id="login-section" style={{
            flex: '1 1 320px',
            maxWidth: '420px',
            width: '100%',
            backgroundColor: '#ffffff',
            padding: '35px',
            borderRadius: '16px',
            boxShadow: '0 12px 35px rgba(0,0,0,0.10)',
            boxSizing: 'border-box'
          }}>
            <h2 style={{
              color: '#064e3b',
              textAlign: 'center',
              marginTop: 0
            }}>
              {isRegistering ? 'Create Your Account' : 'Welcome Back!'}
            </h2>

            <p style={{
              textAlign: 'center',
              color: '#6b7280',
              marginBottom: '25px'
            }}>
              {isRegistering
                ? 'Join GreenCart and shop sustainably.'
                : 'Login to continue your green shopping journey.'}
            </p>

            {!isRegistering ? (
              <form onSubmit={handleLogin} style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '15px'
              }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '7px', color: '#374151' }}>
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={usernameInput}
                    onChange={(e) => setUsernameInput(e.target.value)}
                    autoComplete="username"
                    required
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '7px',
                      boxSizing: 'border-box',
                      fontSize: '15px'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '7px', color: '#374151' }}>
                    Password
                  </label>
                  <input
                    type="password"
                    placeholder="Enter your password"
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    autoComplete="current-password"
                    required
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '7px',
                      boxSizing: 'border-box',
                      fontSize: '15px'
                    }}
                  />
                </div>

                <button type="submit" style={{
                  backgroundColor: '#059669',
                  color: 'white',
                  border: 'none',
                  padding: '13px',
                  borderRadius: '7px',
                  fontWeight: 'bold',
                  fontSize: '16px',
                  cursor: 'pointer'
                }}>
                  Login
                </button>
              </form>
            ) : (
              <form onSubmit={handleRegister} style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '15px'
              }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '7px', color: '#374151' }}>
                    Full Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your full name"
                    value={registerName}
                    onChange={(e) => setRegisterName(e.target.value)}
                    required
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '7px',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '7px', color: '#374151' }}>
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={registerEmail}
                    onChange={(e) => setRegisterEmail(e.target.value)}
                    required
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '7px',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '7px', color: '#374151' }}>
                    Password
                  </label>
                  <input
                    type="password"
                    placeholder="Create a password"
                    value={registerPassword}
                    onChange={(e) => setRegisterPassword(e.target.value)}
                    autoComplete="new-password"
                    required
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '7px',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <button type="submit" style={{
                  backgroundColor: '#059669',
                  color: 'white',
                  border: 'none',
                  padding: '13px',
                  borderRadius: '7px',
                  fontWeight: 'bold',
                  fontSize: '16px',
                  cursor: 'pointer'
                }}>
                  Register
                </button>
              </form>
            )}

            <p style={{
              textAlign: 'center',
              marginTop: '22px',
              color: '#6b7280',
              fontSize: '14px'
            }}>
              {isRegistering ? 'Already have an account?' : "Don't have an account?"}
              <button
                type="button"
                onClick={() => setIsRegistering(!isRegistering)}
                style={{
                  border: 'none',
                  background: 'none',
                  color: '#059669',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  marginLeft: '5px'
                }}
              >
                {isRegistering ? 'Login here' : 'Register here'}
              </button>
            </p>
          </section>
        </main>

        {/* FOOTER */}
        <footer style={{
          backgroundColor: '#064e3b',
          color: '#d1fae5',
          padding: '18px 6%',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '10px'
        }}>
          <p style={{ margin: 0 }}>
            © {new Date().getFullYear()} 🌱 GreenCart. All rights reserved.
          </p>
          <p style={{ margin: 0 }}>
            Developed and designed by <strong>Liji T.S</strong>
          </p>
        </footer>
      </div>
    );
  }


  return (
    <div style={{ fontFamily: 'sans-serif', backgroundColor: '#f9fafb', minHeight: '100vh', paddingBottom: '40px' }}>
      {/* Header Navigation */}
      <header style={{ backgroundColor: '#ffffff', borderBottom: '1px solid #e5e7eb', padding: '15px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '24px' }}>🌱</span>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#064e3b', margin: 0 }}>GreenCart</h1>
        </div>

        <nav style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
          <button
            onClick={() => setCurrentPage('shop')}
            style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#4b5563', fontWeight: currentPage === 'shop' ? 'bold' : 'normal', textDecoration: currentPage === 'shop' ? 'underline' : 'none' }}
          >
            Shop
          </button>
          
          <button
            onClick={() => setCurrentPage('cart')}
            style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#4b5563', fontWeight: currentPage === 'cart' ? 'bold' : 'normal', textDecoration: currentPage === 'cart' ? 'underline' : 'none' }}
          >
            🛒 Cart ({totalItemsCount})
          </button>

          <button
            onClick={() => setCurrentPage('orders')}
            style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#4b5563', fontWeight: currentPage === 'orders' ? 'bold' : 'normal', textDecoration: currentPage === 'orders' ? 'underline' : 'none' }}
          >
            📦 My Orders
          </button>

          <button
            onClick={() => setCurrentPage('profile')}
            style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#4b5563', fontWeight: currentPage === 'profile' ? 'bold' : 'normal', textDecoration: currentPage === 'profile' ? 'underline' : 'none' }}
          >
            👤 Profile
          </button>

          {isAdmin && (
            <button
              onClick={() => setCurrentPage('admin')}
              style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#059669', fontWeight: currentPage === 'admin' ? 'bold' : 'normal', textDecoration: currentPage === 'admin' ? 'underline' : 'none' }}
            >
              ⚙️ Admin Dashboard
            </button>
          )}

          <span style={{ color: '#374151', fontSize: '14px' }}>Hello, {user.name}</span>
          <button
            onClick={handleLogout}
            style={{ backgroundColor: '#fca5a5', border: 'none', padding: '6px 14px', borderRadius: '4px', cursor: 'pointer', color: '#991b1b', fontWeight: 'bold' }}
          >
            Logout
          </button>
        </nav>
      </header>

      {/* Main Container */}
      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>

        {/* SHOP PAGE */}
        {currentPage === 'shop' && (
          <div>
            <div style={{ marginBottom: '35px' }}>
              <h2 style={{ fontSize: '30px', fontWeight: 'bold', color: '#111827' }}>Sustainable Shopping for a Greener Planet</h2>
              <p style={{ color: '#6b7280', marginTop: '6px' }}>Discover eco-friendly alternatives, track your plastic savings, and earn Green Points!</p>
            </div>

            {productsData.map((section, idx) => (
              <div key={idx} style={{ marginBottom: '40px' }}>
                <div style={{ borderBottom: '2px solid #059669', paddingBottom: '8px', marginBottom: '20px' }}>
                  <h3 style={{ fontSize: '22px', fontWeight: 'bold', color: '#064e3b', margin: 0 }}>
                    {section.category}
                  </h3>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '24px' }}>
                  {section.items.map((product) => (
                    <div
                      key={product.id}
                      style={{
                        backgroundColor: '#ffffff',
                        borderRadius: '8px',
                        overflow: 'hidden',
                        border: '1px solid #e5e7eb',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                      }}
                    >
                      <div>
                        <div style={{ position: 'relative' }}>
                          <span style={{ position: 'absolute', top: '10px', left: '10px', backgroundColor: '#059669', color: '#ffffff', fontSize: '12px', fontWeight: 'bold', padding: '4px 8px', borderRadius: '4px', zIndex: 1 }}>
                            ECO SCORE: {product.ecoScore}
                          </span>
                          <img
                            src={product.image}
                            alt={product.name}
                            style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                          />
                        </div>
                        <div style={{ padding: '16px' }}>
                          <h4 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '8px', color: '#111827', marginTop: 0 }}>{product.name}</h4>
                          <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '12px', lineHeight: '1.4' }}>{product.description}</p>
                          <p style={{ fontSize: '20px', fontWeight: 'bold', color: '#059669', margin: 0 }}>₹{product.price}</p>
                        </div>
                      </div>
                      <div style={{ padding: '16px', paddingTop: '0' }}>
                        <button
                          onClick={() => addToCart(product)}
                          style={{ width: '100%', backgroundColor: '#059669', color: '#ffffff', border: 'none', padding: '10px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}
                        >
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* CART PAGE */}
        {currentPage === 'cart' && (
          <div style={{ maxWidth: '800px', margin: '0 auto', backgroundColor: '#ffffff', padding: '30px', borderRadius: '8px', border: '1px solid #e5e7eb', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <h2 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '24px', color: '#111827' }}>Shopping Cart</h2>

            {cart.length === 0 ? (
              <p style={{ color: '#6b7280' }}>
                Your cart is empty.{' '}
                <button onClick={() => setCurrentPage('shop')} style={{ color: '#059669', textDecoration: 'underline', border: 'none', background: 'none', cursor: 'pointer', fontWeight: 'bold' }}>
                  Go shopping
                </button>
              </p>
            ) : (
              <div>
                {cart.map((item) => (
                  <div key={item.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #e5e7eb', padding: '16px 0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <img src={item.image} alt={item.name} style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '6px' }} />
                      <div>
                        <h4 style={{ fontWeight: 'bold', fontSize: '16px', margin: 0, color: '#111827' }}>{item.name}</h4>
                        <p style={{ color: '#059669', fontWeight: 'bold', margin: '4px 0 0 0' }}>₹{item.price}</p>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid #d1d5db', borderRadius: '4px', padding: '2px 8px' }}>
                        <button onClick={() => updateQuantity(item.id, -1)} style={{ border: 'none', background: 'none', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px' }}>-</button>
                        <span style={{ fontWeight: 'bold' }}>{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, 1)} style={{ border: 'none', background: 'none', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px' }}>+</button>
                      </div>

                      <button onClick={() => removeFromCart(item.id)} style={{ color: '#ef4444', border: 'none', background: 'none', cursor: 'pointer', fontSize: '14px' }}>
                        Remove
                      </button>
                    </div>
                  </div>
                ))}

                <div style={{ marginTop: '30px', textAlign: 'right' }}>
                  <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '20px', color: '#111827' }}>
                    Total: ₹{totalPrice}
                  </h3>
                  <button
                    onClick={() => setCurrentPage('checkout')}
                    style={{ backgroundColor: '#059669', color: '#ffffff', border: 'none', padding: '12px 24px', fontSize: '16px', fontWeight: 'bold', borderRadius: '6px', cursor: 'pointer' }}
                  >
                    Proceed to Checkout
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* CHECKOUT PAGE */}
        {currentPage === 'checkout' && (
          <div style={{ maxWidth: '800px', margin: '0 auto', backgroundColor: '#ffffff', padding: '30px', borderRadius: '8px', border: '1px solid #e5e7eb', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <h2 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '20px', color: '#064e3b' }}>📦 Checkout & Shipping Details</h2>
            
            <form onSubmit={handlePlaceOrder} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', marginBottom: '5px' }}>Full Name</label>
                  <input
                    type="text"
                    value={shippingDetails.fullName}
                    onChange={(e) => setShippingDetails({ ...shippingDetails, fullName: e.target.value })}
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db', boxSizing: 'border-box' }}
                    required
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', marginBottom: '5px' }}>Phone Number</label>
                  <input
                    type="tel"
                    placeholder="e.g. +91 9876543210"
                    value={shippingDetails.phone}
                    onChange={(e) => setShippingDetails({ ...shippingDetails, phone: e.target.value })}
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db', boxSizing: 'border-box' }}
                    required
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', marginBottom: '5px' }}>Delivery Address</label>
                <input
                  type="text"
                  placeholder="Street address, apartment, suite"
                  value={shippingDetails.address}
                  onChange={(e) => setShippingDetails({ ...shippingDetails, address: e.target.value })}
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db', boxSizing: 'border-box' }}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', marginBottom: '5px' }}>City</label>
                  <input
                    type="text"
                    placeholder="e.g. Trivandrum"
                    value={shippingDetails.city}
                    onChange={(e) => setShippingDetails({ ...shippingDetails, city: e.target.value })}
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db', boxSizing: 'border-box' }}
                    required
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', marginBottom: '5px' }}>Payment Method</label>
                  <select
                    value={shippingDetails.paymentMethod}
                    onChange={(e) => setShippingDetails({ ...shippingDetails, paymentMethod: e.target.value })}
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db', boxSizing: 'border-box', backgroundColor: '#fff' }}
                  >
                    <option value="Credit Card">Credit Card</option>
                    <option value="UPI / Google Pay">UPI / Google Pay</option>
                    <option value="Cash on Delivery">Cash on Delivery (COD)</option>
                  </select>
                </div>
              </div>

              <div style={{ backgroundColor: '#f3f4f6', padding: '15px', borderRadius: '6px', marginTop: '10px' }}>
                <h4 style={{ margin: '0 0 10px 0', fontSize: '16px' }}>Order Summary</h4>
                <p style={{ margin: '0 0 5px 0', color: '#4b5563' }}>Total Items: {totalItemsCount}</p>
                <p style={{ margin: 0, fontWeight: 'bold', fontSize: '18px', color: '#059669' }}>Total Amount: ₹{totalPrice}</p>
              </div>

              <button
                type="submit"
                style={{ backgroundColor: '#059669', color: '#ffffff', border: 'none', padding: '14px', fontSize: '16px', fontWeight: 'bold', borderRadius: '6px', cursor: 'pointer' }}
              >
                Place Order Now
              </button>
            </form>
          </div>
        )}

        {/* ORDER SUCCESS PAGE */}
        {currentPage === 'order-success' && (
          <div style={{ maxWidth: '600px', margin: '0 auto', backgroundColor: '#ffffff', padding: '40px', borderRadius: '8px', border: '1px solid #e5e7eb', textAlign: 'center' }}>
            <span style={{ fontSize: '48px' }}>🎉</span>
            <h2 style={{ fontSize: '28px', fontWeight: 'bold', color: '#064e3b', margin: '15px 0 10px 0' }}>Order Placed Successfully!</h2>
            <p style={{ color: '#6b7280', marginBottom: '25px' }}>Thank you for shopping sustainably with GreenCart. Your order has been registered.</p>
            
            <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
              <button
                onClick={() => setCurrentPage('orders')}
                style={{ backgroundColor: '#059669', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}
              >
                View My Orders
              </button>
              <button
                onClick={() => setCurrentPage('shop')}
                style={{ backgroundColor: '#e5e7eb', color: '#374151', border: 'none', padding: '10px 20px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}
              >
                Continue Shopping
              </button>
            </div>
          </div>
        )}

        {/* PROFILE PAGE */}
        {currentPage === 'profile' && (
          <div style={{ maxWidth: '700px', margin: '0 auto', backgroundColor: '#ffffff', padding: '35px', borderRadius: '8px', border: '1px solid #e5e7eb', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', borderBottom: '1px solid #e5e7eb', paddingBottom: '20px', marginBottom: '25px' }}>
              <div style={{ width: '70px', height: '70px', borderRadius: '50%', backgroundColor: '#059669', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', fontWeight: 'bold' }}>
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h2 style={{ fontSize: '26px', fontWeight: 'bold', color: '#111827', margin: 0 }}>{user.name}</h2>
                <p style={{ color: '#059669', fontWeight: 'bold', margin: '4px 0 0 0', fontSize: '15px' }}>
                  {isAdmin ? '🛡️ Administrator Account' : '🌱 Customer Account'}
                </p>
              </div>
            </div>

            <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#374151', marginBottom: '15px' }}>Account Information</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', color: '#4b5563' }}>
              <p style={{ margin: 0 }}><strong>Username / Profile:</strong> {user.name}</p>
              <p style={{ margin: 0 }}><strong>Role:</strong> {isAdmin ? 'Administrator' : 'Standard Shopper'}</p>
              <p style={{ margin: 0 }}><strong>Total Orders Placed:</strong> {orders.length}</p>
            </div>
          </div>
        )}
        {/* MY ORDERS PAGE */}
{currentPage === 'orders' && (
  <div style={{
    backgroundColor: '#ffffff',
    padding: '30px',
    borderRadius: '8px',
    border: '1px solid #e5e7eb'
  }}>
    <h2>📦 My Orders</h2>

    {orders.filter(
      (order) => !order.customerEmail || order.customerEmail === user.email
    ).length === 0 ? (
      <p>You have not placed any orders yet.</p>
    ) : (
      orders
        .filter(
          (order) => !order.customerEmail || order.customerEmail === user.email
        )
        .map((order) => (
          <div key={order.id} style={{
            border: '1px solid #d1d5db',
            padding: '20px',
            marginBottom: '15px',
            borderRadius: '8px'
          }}>
            <h3>Order ID: {order.id}</h3>
            <p>Date: {order.date}</p>
            <p>Status: {order.status}</p>
            <p>Total: ₹{order.total}</p>

            <h4>Products:</h4>
            {order.items.map((item) => (
              <p key={item.id}>
                {item.name} — Quantity: {item.quantity}
              </p>
            ))}
          </div>
        ))
    )}
  </div>
)}

{/* ADMIN DASHBOARD */}
{currentPage === 'admin' && isAdmin && (
  <div style={{
    backgroundColor: '#ffffff',
    padding: '30px',
    borderRadius: '8px',
    border: '1px solid #e5e7eb'
  }}>
    <h2>⚙️ Admin Dashboard</h2>

    <h3>Add New Product</h3>

    <form onSubmit={handleAddProduct} style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
      maxWidth: '500px'
    }}>
      <input
        placeholder="Product Name"
        value={newProductName}
        onChange={(e) => setNewProductName(e.target.value)}
        required
      />

      <select
        value={newProductCategory}
        onChange={(e) => setNewProductCategory(e.target.value)}
      >
        <option>Personal Care</option>
        <option>Hydration & Drinkware</option>
        <option>Bags & Accessories</option>
        <option>Home & Kitchen</option>
      </select>

      <textarea
        placeholder="Product Description"
        value={newProductDesc}
        onChange={(e) => setNewProductDesc(e.target.value)}
      />

      <input
        type="number"
        placeholder="Price"
        value={newProductPrice}
        onChange={(e) => setNewProductPrice(e.target.value)}
        required
      />

      <select
        value={newProductEco}
        onChange={(e) => setNewProductEco(e.target.value)}
      >
        <option value="A">A</option>
        <option value="B">B</option>
        <option value="C">C</option>
      </select>

      <input
        placeholder="Product Image URL"
        value={newProductImage}
        onChange={(e) => setNewProductImage(e.target.value)}
      />

      <button type="submit">
        Add Product
      </button>
    </form>

    <hr />

    <h3>Manage Products</h3>

    {productsData.map((section) => (
      <div key={section.category}>
        <h4>{section.category}</h4>

        {section.items.map((product) => (
          <div key={product.id} style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '10px',
            padding: '12px',
            borderBottom: '1px solid #e5e7eb'
          }}>
            <span>
              {product.name} — ₹{product.price}
            </span>

            <div>
              <button
                type="button"
                onClick={() => handleEditProduct(section.category, product)}
              >
                Edit
              </button>

              <button
                type="button"
                onClick={() => handleDeleteProduct(section.category, product.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    ))}
  </div>
)}

      </main>
    </div>
  );
}
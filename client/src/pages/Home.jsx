import React, { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';

const Home = ({ cartItems, setCartItems }) => {
  const [products, setProducts] = useState([
    {
      _id: '1',
      name: 'Bamboo Toothbrush (4-Pack)',
      price: 299,
      ecoScore: '8/10',
      rating: 4.5,
      reviewsCount: 8,
      description: '100% biodegradable organic bamboo handle with BPA-free bristles.',
      image: '/images/toothbrush.jpg' // update or use placeholder if needed
    },
    {
      _id: '2',
      name: 'Reusable Stainless Steel Water Bottle',
      price: 799,
      ecoScore: '8/10',
      rating: 4.8,
      reviewsCount: 8,
      description: 'Double-wall vacuum insulated water bottle, keeps drinks cold for 24 hours.',
      image: '/images/bottle.jpg'
    },
    {
      _id: '3',
      name: 'Organic Cotton Shopping Bag',
      price: 199,
      ecoScore: '8/10',
      rating: 4.6,
      reviewsCount: 8,
      description: 'Heavy duty washable canvas tote bag for grocery shopping.',
      image: '/images/bag.jpg'
    },
    {
      _id: '4',
      name: 'Bamboo Fiber Coffee Cup',
      price: 9.99,
      ecoScore: '8/10',
      rating: 4.7,
      reviewsCount: 8,
      description: 'Eco-friendly reusable travel mug for your daily coffee.',
      image: '/images/cup.jpg'
    }
  ]);

  // Optional: Fetch products from your backend API if available
  useEffect(() => {
    fetch('http://localhost:5000/api/products')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setProducts(data);
        }
      })
      .catch(err => console.log('Using static products or API offline:', err));
  }, []);

  const handleAddToCart = (product) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => (item._id || item.id) === (product._id || product.id));
      if (existingItem) {
        // Increase quantity if item already exists in cart
        return prevItems.map(item =>
          (item._id || item.id) === (product._id || product.id)
            ? { ...item, quantity: (item.quantity || 1) + 1 }
            : item
        );
      }
      // Add new item with quantity 1
      return [...prevItems, { ...product, quantity: 1 }];
    });
    
    alert(`Added "${product.name}" to your cart! 🛒`);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ marginBottom: '30px' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '8px' }}>Sustainable Shopping for a Greener Planet</h1>
        <p style={{ color: '#4b5563' }}>Discover eco-friendly alternatives, track your plastic savings, and earn Green Points!</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '20px' }}>
        {products.map(product => (
          <ProductCard 
            key={product._id || product.id} 
            product={product} 
            onAddToCart={handleAddToCart} 
          />
        ))}
      </div>
    </div>
  );
};

Home.defaultProps = {
  cartItems: [],
  setCartItems: () => {}
};

export default Home;
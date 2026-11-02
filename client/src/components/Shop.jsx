import React, { useState, useEffect } from 'react';

const initialProducts = [
  {
    id: 1,
    title: 'Bamboo Toothbrush (4-Pack)',
    description: '100% biodegradable organic bamboo handle with BPA-free bristles.',
    price: 12.99,
    ecoScore: 'A',
    imageUrl: 'https://via.placeholder.com/250'
  }
];

export default function Shop() {
  // 1. Load products from localStorage or fallback to initialProducts
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem('greencart_products');
    return saved ? JSON.parse(saved) : initialProducts;
  });

  // 2. Form state for adding new products
  const [newProduct, setNewProduct] = useState({
    title: '',
    description: '',
    price: '',
    ecoScore: 'A',
    imageUrl: ''
  });

  // 3. Automatically save to localStorage whenever products change
  useEffect(() => {
    localStorage.setItem('greencart_products', JSON.stringify(products));
  }, [products]);

  // Handle form inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct({ ...newProduct, [name]: value });
  };

  // 4. Add new product to state (which updates localStorage automatically)
  const handleAddProduct = (e) => {
    e.preventDefault();
    const productToAdd = {
      id: Date.now(), // unique ID using timestamp
      ...newProduct,
      price: parseFloat(newProduct.price)
    };

    setProducts((prev) => [productToAdd, ...prev]);

    // Clear form
    setNewProduct({
      title: '',
      description: '',
      price: '',
      ecoScore: 'A',
      imageUrl: ''
    });
    alert('Product added successfully!');
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      {/* Product Input Form */}
      <div style={{ marginBottom: '40px', background: '#f9f9f9', padding: '20px', borderRadius: '8px' }}>
        <h3>Add New Eco Product</h3>
        <form onSubmit={handleAddProduct} style={{ display: 'grid', gap: '10px', maxWidth: '400px' }}>
          <input
            type="text"
            name="title"
            placeholder="Product Title"
            value={newProduct.title}
            onChange={handleInputChange}
            required
          />
          <textarea
            name="description"
            placeholder="Description"
            value={newProduct.description}
            onChange={handleInputChange}
            required
          />
          <input
            type="number"
            step="0.01"
            name="price"
            placeholder="Price ($)"
            value={newProduct.price}
            onChange={handleInputChange}
            required
          />
          <input
            type="text"
            name="imageUrl"
            placeholder="Image URL"
            value={newProduct.imageUrl}
            onChange={handleInputChange}
            required
          />
          <select name="ecoScore" value={newProduct.ecoScore} onChange={handleInputChange}>
            <option value="A">Eco Score: A</option>
            <option value="B">Eco Score: B</option>
            <option value="C">Eco Score: C</option>
          </select>
          <button type="submit" style={{ backgroundColor: '#2e7d32', color: '#fff', padding: '10px', border: 'none', cursor: 'pointer' }}>
            Add Product
          </button>
        </form>
      </div>

      {/* Product Display Section */}
      <h2>Personal Care</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
        {products.map((product) => (
          <div
            key={product.id}
            style={{
              border: '1px solid #e0e0e0',
              borderRadius: '8px',
              width: '250px',
              overflow: 'hidden',
              position: 'relative',
              boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: '10px',
                left: '10px',
                backgroundColor: '#00875a',
                color: '#fff',
                fontSize: '12px',
                fontWeight: 'bold',
                padding: '4px 8px',
                borderRadius: '4px'
              }}
            >
              ECO SCORE: {product.ecoScore}
            </div>
            <img
              src={product.imageUrl || 'https://via.placeholder.com/250'}
              alt={product.title}
              style={{ width: '100%', height: '180px', objectFit: 'cover' }}
            />
            <div style={{ padding: '15px' }}>
              <h4 style={{ margin: '0 0 10px 0' }}>{product.title}</h4>
              <p style={{ color: '#666', fontSize: '13px' }}>{product.description}</p>
              <div style={{ fontWeight: 'bold', marginTop: '10px' }}>${product.price}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
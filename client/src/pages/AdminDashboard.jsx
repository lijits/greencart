import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: 'Personal Care',
    imageUrl: '',
    ecoRating: 8,
    description: ''
  });

  // Fetch products from backend on load
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/products');
      setProducts(res.data);
    } catch (err) {
      console.error('Error fetching products:', err);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Add product to MongoDB via API with Authorization token
  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price) return;

    try {
      // Retrieve stored token from login session
      const token = localStorage.getItem('token');

      const res = await axios.post(
        'http://localhost:5000/api/products',
        {
          ...formData,
          price: parseFloat(formData.price)
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      setProducts([...products, res.data]);
      setFormData({
        name: '',
        price: '',
        category: 'Personal Care',
        imageUrl: '',
        ecoRating: 8,
        description: ''
      });
      alert('Product added successfully!');
    } catch (err) {
      console.error('Error adding product:', err);
      alert('Failed to add product: ' + (err.response?.data?.message || err.message));
    }
  };

  // Delete product from MongoDB via API
  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/products/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setProducts(products.filter((product) => product._id !== id));
    } catch (err) {
      console.error('Error deleting product:', err);
      alert('Failed to delete product');
    }
  };

  return (
    <div className="admin-container">
      <div className="admin-wrapper">
        
        <div className="admin-header">
          <h1>GreenCart Control Panel</h1>
          <p>Manage eco-friendly store inventory and add new products.</p>
        </div>

        {/* Add Product Form */}
        <div className="admin-card">
          <h2 className="card-title">Add Eco-Friendly Product</h2>
          <form onSubmit={handleAddProduct}>
            <div className="form-grid">
              <div className="form-group">
                <label>Product Name</label>
                <input
                  type="text"
                  name="name"
                  placeholder="e.g. Bamboo Fiber Coffee Cup"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Price ($)</label>
                <input
                  type="number"
                  step="0.01"
                  name="price"
                  placeholder="0.00"
                  value={formData.price}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Category</label>
                <select name="category" value={formData.category} onChange={handleChange}>
                  <option value="Personal Care">Personal Care</option>
                  <option value="Kitchen">Kitchen</option>
                  <option value="Lifestyle">Lifestyle</option>
                  <option value="Home & Living">Home & Living</option>
                </select>
              </div>

              <div className="form-group span-2">
                <label>Image URL</label>
                <input
                  type="text"
                  name="imageUrl"
                  placeholder="https://example.com/image.jpg"
                  value={formData.imageUrl}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Eco Rating (Score / 10)</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  name="ecoRating"
                  value={formData.ecoRating}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-submit">
                🌱 Add Product
              </button>
            </div>
          </form>
        </div>

        {/* Inventory Table */}
        <div className="admin-card">
          <div className="table-header">
            <h2 className="card-title">Inventory Management</h2>
            <span className="badge-count">{products.length} Products</span>
          </div>

          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Product Name</th>
                  <th>Price</th>
                  <th>Category</th>
                  <th>Eco Rating</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="empty-text">No products found in inventory.</td>
                  </tr>
                ) : (
                  products.map((prod) => (
                    <tr key={prod._id}>
                      <td className="font-semibold">{prod.name}</td>
                      <td className="price-text">${typeof prod.price === 'number' ? prod.price.toFixed(2) : prod.price}</td>
                      <td><span className="badge-category">{prod.category}</span></td>
                      <td><span className="badge-eco">🌱 {prod.ecoRating}/10</span></td>
                      <td className="text-right">
                        <button onClick={() => handleDelete(prod._id)} className="btn-delete">
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;
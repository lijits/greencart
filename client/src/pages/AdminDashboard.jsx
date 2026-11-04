import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

export const AdminDashboard = () => {
  const { token } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [editingId, setEditingId] = useState(null); // Tracks if we are editing an item

  // Form state matching your database keys
  const [formData, setFormData] = useState({
    title: '',
    category: 'Personal Care',
    price: '',
    ecoScore: 'A',
    description: '',
    imageUrl: ''
  });

  // Fetch products on load
  const fetchProducts = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/products');
      setProducts(res.data);
    } catch (err) {
      console.error('Error fetching inventory:', err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Submit Handler for both Adding and Updating
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        // Update existing product
        await axios.put(`http://localhost:5000/api/products/${editingId}`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        alert('Product updated successfully!');
      } else {
        // Add new product
        await axios.post('http://localhost:5000/api/products/add', formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        alert('Product added successfully!');
      }
      
      // Reset form state & refresh inventory list
      setEditingId(null);
      setFormData({ title: '', category: 'Personal Care', price: '', ecoScore: 'A', description: '', imageUrl: '' });
      fetchProducts();
    } catch (err) {
      alert('Error: ' + (err.response?.data?.message || err.message));
    }
  };

  // Load product data into the form when "Edit" is clicked
  const handleEditClick = (product) => {
    setEditingId(product._id);
    setFormData({
      title: product.title || product.name || '',
      category: product.category || 'Personal Care',
      price: product.price || '',
      ecoScore: product.ecoScore || 'A',
      description: product.description || '',
      imageUrl: product.imageUrl || product.image || ''
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Delete product
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await axios.delete(`http://localhost:5000/api/products/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchProducts();
      } catch (err) {
        alert('Error deleting product');
      }
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-12 text-slate-800">
      <h2 className="text-3xl font-bold mb-2">Admin Dashboard</h2>
      <p className="text-slate-500 mb-8">Manage inventory and list new sustainable products to GreenCart.</p>

      {/* Product Form (Create / Edit) */}
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-lg border border-slate-200 mb-12 space-y-6">
        <h3 className="text-xl font-bold text-emerald-700">
          {editingId ? 'Edit Eco Product' : 'Add New Eco Product'}
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold mb-1">Product Title</label>
            <input 
              type="text" 
              name="title" 
              value={formData.title} 
              onChange={handleChange}
              placeholder="e.g. Organic Cotton T-Shirt"
              className="w-full bg-slate-50 p-3 rounded-xl border border-slate-200"
              required 
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Category</label>
            <select 
              name="category" 
              value={formData.category} 
              onChange={handleChange}
              className="w-full bg-slate-50 p-3 rounded-xl border border-slate-200"
            >
              <option value="Personal Care">Personal Care</option>
              <option value="Home & Kitchen">Home & Kitchen</option>
              <option value="Clothing">Clothing</option>
              <option value="Accessories">Accessories</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold mb-1">Price (₹)</label>
            <input 
              type="number" 
              name="price" 
              value={formData.price} 
              onChange={handleChange}
              placeholder="e.g. 499"
              className="w-full bg-slate-50 p-3 rounded-xl border border-slate-200"
              required 
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Eco Score</label>
            <select 
              name="ecoScore" 
              value={formData.ecoScore} 
              onChange={handleChange}
              className="w-full bg-slate-50 p-3 rounded-xl border border-slate-200"
            >
              <option value="A">A (Highest Sustainability)</option>
              <option value="B">B (Good)</option>
              <option value="C">C (Moderate)</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">Description</label>
          <input 
            type="text" 
            name="description" 
            value={formData.description} 
            onChange={handleChange}
            placeholder="Short description of eco benefits"
            className="w-full bg-slate-50 p-3 rounded-xl border border-slate-200"
            required 
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">Image URL (Unsplash)</label>
          <input 
            type="text" 
            name="imageUrl" 
            value={formData.imageUrl} 
            onChange={handleChange}
            placeholder="https://images.unsplash.com/..."
            className="w-full bg-slate-50 p-3 rounded-xl border border-slate-200"
            required 
          />
        </div>

        <div className="flex gap-4">
          <button 
            type="submit" 
            className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-xl transition shadow-md"
          >
            {editingId ? 'Update Product' : 'Add Product'}
          </button>
          {editingId && (
            <button 
              type="button" 
              onClick={() => {
                setEditingId(null);
                setFormData({ title: '', category: 'Personal Care', price: '', ecoScore: 'A', description: '', imageUrl: '' });
              }}
              className="bg-slate-300 hover:bg-slate-400 font-bold px-6 py-3 rounded-xl transition"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Existing Inventory Table with Edit & Delete Options */}
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <h3 className="text-xl font-bold text-slate-800">Existing Inventory ({products.length})</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-sm border-b border-slate-200">
                <th className="p-4">Product Title</th>
                <th className="p-4">Category</th>
                <th className="p-4">Price</th>
                <th className="p-4">Eco Score</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {products.map((p) => (
                <tr key={p._id} className="hover:bg-slate-50 transition">
                  <td className="p-4 font-semibold text-slate-800">{p.title || p.name}</td>
                  <td className="p-4 text-slate-600">{p.category}</td>
                  <td className="p-4 text-slate-600">₹{p.price}</td>
                  <td className="p-4"><span className="bg-emerald-100 text-emerald-800 font-bold px-2.5 py-1 rounded-md">{p.ecoScore}</span></td>
                  <td className="p-4 text-right space-x-2">
                    <button 
                      onClick={() => handleEditClick(p)}
                      className="bg-amber-500 hover:bg-amber-400 text-white px-3 py-1.5 rounded-lg font-medium transition shadow-sm"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(p._id)}
                      className="bg-red-600 hover:bg-red-500 text-white px-3 py-1.5 rounded-lg font-medium transition shadow-sm"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
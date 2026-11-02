import React, { useState } from 'react';

const AdminDashboard = () => {
  // Sample initial state for inventory items
  const [products, setProducts] = useState([
    {
      id: 1,
      name: 'Organic Bamboo Toothbrush',
      category: 'Personal Care',
      price: 299,
      ecoScore: 'A (Highest Sustainability)',
      description: 'Biodegradable handle with soft bristles.',
      image: 'https://images.unsplash.com/photo-1607613009820-a29f7bb81c04'
    }
  ]);

  // State for form inputs
  const [formData, setFormData] = useState({
    name: '',
    category: 'Personal Care',
    price: '',
    ecoScore: 'A (Highest Sustainability)',
    description: '',
    image: ''
  });

  // Tracks if user is editing an item (null = creating new item)
  const [editingId, setEditingId] = useState(null);

  // Form input handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Submit handler for both Create and Update
  const handleSubmit = (e) => {
    e.preventDefault();

    if (editingId !== null) {
      // Update existing item
      setProducts(
        products.map((p) =>
          p.id === editingId ? { ...formData, id: editingId, price: Number(formData.price) } : p
        )
      );
      setEditingId(null);
    } else {
      // Add new item
      const newProduct = {
        ...formData,
        id: Date.now(),
        price: Number(formData.price)
      };
      setProducts([...products, newProduct]);
    }

    // Reset form fields
    resetForm();
  };

  // Populate form with existing product details for editing
  const handleEdit = (product) => {
    setEditingId(product.id);
    setFormData({
      name: product.name,
      category: product.category,
      price: product.price,
      ecoScore: product.ecoScore,
      description: product.description,
      image: product.image
    });
  };

  // Delete product handler
  const handleDelete = (productId) => {
    try {
      setProducts(products.filter(p => p.id !== productId));
    } catch (error) {
      console.error("Failed to delete product:", error);
    }
  };

  // Clear form
  const resetForm = () => {
    setFormData({
      name: '',
      category: 'Personal Care',
      price: '',
      ecoScore: 'A (Highest Sustainability)',
      description: '',
      image: ''
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6 font-sans">
      <h1 className="text-2xl font-bold text-teal-800 mb-1">⚙️ Admin Dashboard</h1>
      <p className="text-gray-500 mb-6">Manage inventory and list new sustainable products to GreenCart.</p>

      {/* FORM SECTION */}
      <div className="bg-slate-50 p-6 rounded-lg border border-slate-200">
        <h2 className="text-lg font-bold mb-4">
          {editingId !== null ? 'Edit Eco Product' : 'Add New Eco Product'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700">Product Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Organic Cotton T-Shirt"
                required
                className="w-full mt-1 p-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full mt-1 p-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="Personal Care">Personal Care</option>
                <option value="Lifestyle & Kitchen">Lifestyle & Kitchen</option>
                <option value="Everyday Essentials">Everyday Essentials</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700">Price (₹)</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="e.g. 499"
                required
                className="w-full mt-1 p-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700">Eco Score</label>
              <select
                name="ecoScore"
                value={formData.ecoScore}
                onChange={handleChange}
                className="w-full mt-1 p-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="A (Highest Sustainability)">A (Highest Sustainability)</option>
                <option value="B (Moderate Sustainability)">B (Moderate Sustainability)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700">Description</label>
            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Short description of eco benefits"
              required
              className="w-full mt-1 p-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700">Image URL (Unsplash)</label>
            <input
              type="url"
              name="image"
              value={formData.image}
              onChange={handleChange}
              placeholder="https://images.unsplash.com/..."
              required
              className="w-full mt-1 p-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2.5 px-4 rounded-md transition duration-200"
            >
              {editingId !== null ? 'Update Product' : 'Add Product to Catalog'}
            </button>
            {editingId !== null && (
              <button
                type="button"
                onClick={() => {
                  resetForm();
                  setEditingId(null);
                }}
                className="bg-slate-500 hover:bg-slate-600 text-white font-semibold py-2.5 px-4 rounded-md transition duration-200"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* TABLE SECTION (Displays Current Inventory with Edit & Delete buttons) */}
      <div className="mt-8">
        <h2 className="text-lg font-bold mb-3">Current Inventory ({products.length})</h2>
        {products.length === 0 ? (
          <p className="text-slate-400">No products available in inventory.</p>
        ) : (
          <div className="overflow-x-auto border border-slate-200 rounded-lg">
            <table className="w-full text-left border-collapse bg-white text-sm">
              <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                <tr>
                  <th className="p-3">Item</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Price</th>
                  <th className="p-3">Eco Score</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {products.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50">
                    <td className="p-3 flex items-center gap-3">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-10 h-10 rounded object-cover border border-slate-200"
                      />
                      <div>
                        <div className="font-semibold text-slate-800">{item.name}</div>
                        <div className="text-xs text-slate-500">{item.description}</div>
                      </div>
                    </td>
                    <td className="p-3 text-slate-600">{item.category}</td>
                    <td className="p-3 font-medium text-slate-800">₹{item.price}</td>
                    <td className="p-3 text-slate-600">{item.ecoScore}</td>
                    <td className="p-3">
                      <button
                        type="button"
                        onClick={() => handleEdit(item)}
                        className="mr-2 px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded text-xs transition duration-150"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(item.id)}
                        className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded text-xs transition duration-150"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
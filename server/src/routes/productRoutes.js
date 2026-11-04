const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// Get all products from database
router.get('/', async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products', error });
  }
});

// Add a new product to database (Permanent Persistence)
router.post('/add', async (req, res) => {
  try {
    const { name, title, description, price, category, ecoScore, image, imageUrl } = req.body;

    const newProduct = new Product({
      name: name || title, // supports both field naming conventions
      description,
      price,
      category,
      ecoScore,
      image: image || imageUrl // supports both field naming conventions
    });

    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(400).json({ message: 'Failed to create product', error: error.message });
  }
});

// PUT route to update an existing product by ID
router.put('/:id', async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedProduct) return res.status(404).json({ message: 'Product not found' });
    res.json(updatedProduct);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE route to remove a product from inventory
router.delete('/:id', async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
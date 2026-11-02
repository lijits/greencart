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
    const { title, description, price, category, ecoScore, imageUrl } = req.body;

    const newProduct = new Product({
      title,
      description,
      price,
      category,
      ecoScore,
      imageUrl
    });

    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(400).json({ message: 'Failed to create product', error });
  }
});

module.exports = router;
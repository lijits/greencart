const Product = require('../models/Product');

// @desc    Get all products (with optional category/ecoScore filters)
// @route   GET /api/products
const getProducts = async (req, res) => {
  try {
    const { category, ecoScore } = req.query;
    let query = {};

    if (category) query.category = category;
    if (ecoScore) query.ecoScore = ecoScore.toUpperCase();

    const products = await Product.find(query);
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single product by ID
// @route   GET /api/products/:id
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a product (Admin only)
// @route   POST /api/products
const createProduct = async (req, res) => {
  try {
    const { name, description, price, category, imageUrl, stock, ecoScore, plasticSavedGrams } = req.body;

    const product = new Product({
      name,
      description,
      price,
      category,
      imageUrl,
      stock,
      ecoScore: ecoScore || 'A',
      plasticSavedGrams: plasticSavedGrams || 0
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getProducts, getProductById, createProduct };
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const sampleProducts = [
  {
    name: 'Bamboo Toothbrush (4-Pack)',
    description: '100% biodegradable organic bamboo handle with BPA-free bristles.',
    price: 299,
    category: 'Personal Care',
    imageUrl: 'https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?auto=format&fit=crop&w=600&q=80',
    stock: 50,
    ecoScore: 'A',
    plasticSavedGrams: 120
  },
  {
    name: 'Reusable Stainless Steel Water Bottle',
    description: 'Double-wall vacuum insulated water bottle, keeps drinks cold for 24 hours.',
    price: 799,
    category: 'Kitchen',
    imageUrl: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=600&q=80',
    stock: 30,
    ecoScore: 'A',
    plasticSavedGrams: 500
  },
  {
    name: 'Organic Cotton Shopping Bag',
    description: 'Heavy duty washable canvas tote bag for grocery shopping.',
    price: 199,
    category: 'Lifestyle',
    imageUrl: 'https://images.unsplash.com/photo-1597484661643-2f5fef640dd1?auto=format&fit=crop&w=600&q=80',
    stock: 100,
    ecoScore: 'B',
    plasticSavedGrams: 250
  }
];

const seedDB = async () => {
  try {
    await Product.deleteMany();
    await Product.insertMany(sampleProducts);
    console.log('Sample eco-friendly products added successfully!');
    process.exit();
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDB();
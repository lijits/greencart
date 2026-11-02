const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');

// @desc    Create new order & calculate green rewards
// @route   POST /api/orders
// @access  Private (Customer)
const addOrderItems = async (req, res) => {
  try {
    const { orderItems, shippingAddress, totalAmount } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ message: 'No order items' });
    }

    let totalPlasticSaved = 0;
    let pointsEarned = 0;

    // Calculate plastic saved and green points based on products
    for (const item of orderItems) {
      const product = await Product.findById(item.product);
      if (product) {
        totalPlasticSaved += (product.plasticSavedGrams || 0) * item.quantity;
        // 10 green points per item purchased as a reward
        pointsEarned += 10 * item.quantity;
      }
    }

    const order = new Order({
      user: req.user._id,
      orderItems,
      shippingAddress,
      totalAmount,
      totalPlasticSaved,
      pointsEarned
    });

    const createdOrder = await order.save();

    // Update user's green points total
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { greenPoints: pointsEarned }
    });

    res.status(201).json(createdOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { addOrderItems, getMyOrders };
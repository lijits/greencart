
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// REGISTER
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        message: 'Please enter name, email and password.'
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Check whether user already exists
    let user = await User.findOne({ email: normalizedEmail });

    if (user) {
      return res.status(400).json({
        message: 'User already exists.'
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    user = new User({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      role: 'user'
    });

    await user.save();

    res.status(201).json({
      message: 'User registered successfully.'
    });

  } catch (err) {
    console.error('Registration error:', err);

    res.status(500).json({
      message: err.message || 'Registration failed.'
    });
  }
};


// LOGIN
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: 'Please enter email and password.'
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const user = await User.findOne({
      email: normalizedEmail
    });

    console.log('LOGIN EMAIL:', user?.email);
    console.log('LOGIN ROLE:', user?.role);

    if (!user) {
      return res.status(404).json({
        message: 'User not found.'
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: 'Invalid credentials.'
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
        email: user.email
      },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.status(200).json({
      message: 'Login successful.',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (err) {
    console.error('Login error:', err);

    res.status(500).json({
      message: err.message || 'Login failed.'
    });
  }
};

module.exports = { register, login };

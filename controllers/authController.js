const { User } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

const JWT_SECRET = process.env.JWT_SECRET || 'your_default_jwt_secret';

// Login user
const loginUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(401).json({ error: 'Invalid email or password' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: 'Invalid password' });

    const token = jwt.sign({ user_id: user.user_id }, JWT_SECRET, { expiresIn: '1h' });

    const userData = user.get({ plain: true });
    delete userData.password;

    res.json({ message: 'Login successful', user: userData, token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Logout (client-side: remove token)
const logoutUser = async (req, res) => {
  res.json({ message: 'Logged out successfully' });
};

// Get current logged-in user details
const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.user_id, {
      attributes: { exclude: ['password'] },
    });
    if (!user) return res.status(404).json({ error: 'User not found' });

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  loginUser,
  logoutUser,
  getCurrentUser,
};
const { User, Payment, Notice } = require('../models');
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

const JWT_SECRET = process.env.JWT_SECRET || 'your_default_jwt_secret';

// Admin login
const adminLogin = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(401).json({ error: 'Invalid email or password' });

    if (user.isAdmin !== 'true') {
      return res.status(403).json({ error: 'Forbidden: Only admins can log in here' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: 'Invalid email or password' });

    const token = jwt.sign({ user_id: user.user_id, isAdmin: user.isAdmin }, JWT_SECRET, { expiresIn: '1h' });

    const userData = user.get({ plain: true });
    delete userData.password;

    res.json({ message: 'Admin login successful', user: userData, token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get dashboard stats
const getDashboardSummary = async (req, res) => {
  try {
    const totalMembers = await User.count();
    const activeMembers = await User.count({ where: { status: 'Active' } });
    const inactiveMembers = await User.count({ where: { status: 'Inactive' } });
    const totalPayments = await Payment.sum('amount') || 0;
    const pendingPayments = await Payment.count({ where: { payment_status: 'Pending' } });
    const totalNotices = await Notice.count();

    res.json({
      totalMembers,
      activeMembers,
      inactiveMembers,
      totalPayments,
      pendingPayments,
      totalNotices,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all members
const getAllMembers = async (req, res) => {
  try {
    const members = await User.findAll({
      attributes: { exclude: ['password'] },
    });
    if (!members.length) return res.status(404).json({ error: 'No members found' });

    res.json(members);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all payments
const getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.findAll();
    if (!payments.length) return res.status(404).json({ error: 'No payments found' });

    res.json(payments);
  } catch (err) {
    res.status(500).json({ error: 'No payments found' });
  }
};

// Get all notices
const getAllNotices = async (req, res) => {
  try {
    const notices = await Notice.findAll();
    if (!notices.length) return res.status(404).json({ error: 'No notices found' });

    res.json(notices);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get members with pending dues
const getMembersWithPendingDues = async (req, res) => {
  try {
    const membersWithDues = await User.findAll({
      attributes: { exclude: ['password'] },
      include: [
        {
          model: Payment,
          where: { payment_status: 'Pending' },
          required: true,
        },
      ],
    });

    if (!membersWithDues.length) return res.status(404).json({ error: 'No members with pending dues found' });

    res.json(membersWithDues);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update member status (additional utility function)
const updateMemberStatus = async (req, res) => {
  const { user_id } = req.params;
  const { status } = req.body;

  if (!['Active', 'Inactive'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }

  try {
    const user = await User.findByPk(user_id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    await user.update({ status });
    res.json({ message: 'Member status updated', user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  adminLogin,
  getDashboardSummary,
  getAllMembers,
  getAllPayments,
  getAllNotices,
  getMembersWithPendingDues,
  updateMemberStatus,
};
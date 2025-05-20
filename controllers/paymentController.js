const { Payment } = require('../models');
const { validationResult } = require('express-validator');

// Initiate a payment
const initiatePayment = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const userId = req.user?.user_id;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const paymentData = {
      ...req.body,
      user_id: userId,
      payment_status: 'Pending',
      verified_by_admin: false, // Default to false on initiation
      payment_date: new Date(), // Today's date: May 20, 2025, 08:30 AM IST
    };

    const payment = await Payment.create(paymentData);
    res.status(201).json({ message: 'Payment initiated', payment });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all payments of a specific member
const getUserPayments = async (req, res) => {
  const { memberID } = req.params;

  try {
    const payments = await Payment.findAll({ where: { user_id: memberID } });
    if (!payments.length) return res.status(404).json({ error: 'No payments found for this member' });

    res.json(payments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all payment records
const getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.findAll();
    if (!payments.length) return res.status(404).json({ error: 'No payments found' });

    res.json(payments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Verify payment after gateway (admin only)
const verifyPayment = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { transaction_id, payment_status } = req.body;

  try {
    // Ensure only admins can verify payments
    const user = req.user;
    if (!user || user.isAdmin !== 'true') {
      return res.status(403).json({ error: 'Forbidden: Only admins can verify payments' });
    }

    const payment = await Payment.findOne({ where: { transaction_id } });
    if (!payment) return res.status(404).json({ error: 'Payment not found' });

    await payment.update({
      payment_status,
      verified_by_admin: true,
    });

    res.json({ message: 'Payment verified by admin', payment });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete a payment record
const deletePayment = async (req, res) => {
  const { paymentID } = req.params;

  try {
    const payment = await Payment.findByPk(paymentID);
    if (!payment) return res.status(404).json({ error: 'Payment not found' });

    // Ensure the user owns this payment or is an admin
    const user = req.user;
    if (payment.user_id !== user?.user_id && user?.isAdmin !== 'true') {
      return res.status(403).json({ error: 'Forbidden: You can only delete your own payments or must be an admin' });
    }

    await payment.destroy();
    res.json({ message: 'Payment deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  initiatePayment,
  getUserPayments,
  getAllPayments,
  verifyPayment,
  deletePayment,
};
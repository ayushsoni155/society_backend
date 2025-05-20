const express = require('express');
const router = express.Router();
const { initiatePayment, getUserPayments, getAllPayments, verifyPayment, deletePayment } = require('../controllers/paymentController');
const { check } = require('express-validator');
const authenticate = require('../middleware/auth');
const adminMiddleware = require('../middleware/admin');

router.post(
  '/initiate',
  authenticate,
  [
    check('amount').isFloat({ gt: 0 }).withMessage('Amount must be a positive number'),
    check('payment_type').isIn(['Membership', 'Donation']).withMessage('Payment type must be either Membership or Donation'),
  ],
  initiatePayment
);

router.get('/:memberID', authenticate, getUserPayments);

router.get('/', authenticate, getAllPayments);

router.post(
  '/verify',
  [authenticate, adminMiddleware],
  [
    check('transaction_id').notEmpty().withMessage('Transaction ID is required'),
    check('payment_status').isIn(['Completed', 'Failed']).withMessage('Payment status must be either Completed or Failed'),
  ],
  verifyPayment
);

router.delete('/:paymentID', authenticate, deletePayment);

module.exports = router;
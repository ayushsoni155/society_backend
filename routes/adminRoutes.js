const express = require('express');
const router = express.Router();
const { adminLogin, getDashboardSummary, getAllMembers, getAllPayments, getAllNotices, getMembersWithPendingDues, updateMemberStatus } = require('../controllers/adminController');
const { check } = require('express-validator');
const authMiddleware = require('../middleware/auth');
const adminMiddleware = require('../middleware/admin');

router.post(
  '/login',
  [
    check('email').isEmail().withMessage('Valid email is required'),
    check('password').notEmpty().withMessage('Password is required'),
  ],
  adminLogin
);

router.get('/stats', [authMiddleware, adminMiddleware], getDashboardSummary);

router.get('/members', [authMiddleware, adminMiddleware], getAllMembers);

router.get('/payments', [authMiddleware, adminMiddleware], getAllPayments);

router.get('/notices', [authMiddleware, adminMiddleware], getAllNotices);

router.get('/dues', [authMiddleware, adminMiddleware], getMembersWithPendingDues);

router.put(
  '/members/:user_id/status',
  [authMiddleware, adminMiddleware],
  updateMemberStatus
);

module.exports = router;
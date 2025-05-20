const express = require('express');
const router = express.Router();
const { registerMember, getAllMembers, getMemberById, updateMember, deleteMember, changePassword } = require('../controllers/memberController');
const { check } = require('express-validator');
const authMiddleware = require('../middleware/auth');

router.post(
  '/register',
  [
    check('name').notEmpty().withMessage('Name is required'),
    check('email').isEmail().withMessage('Valid email is required'),
    check('phone_number').isLength({ min: 10, max: 10 }).withMessage('Valid phone number is required'),
    check('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  ],
  registerMember
);

router.get('/', authMiddleware, getAllMembers);

router.get('/:memberID', authMiddleware, getMemberById);

router.put(
  '/:memberID',
  authMiddleware,
  [
    check('name').optional().notEmpty().withMessage('Name cannot be empty'),
    check('phone_number').optional().isLength({ min: 10, max: 10 }).withMessage('Valid phone number is required'),
  ],
  updateMember
);

router.delete('/:memberID', authMiddleware, deleteMember);

router.put(
  '/password',
  authMiddleware,
  [
    check('oldPassword').notEmpty().withMessage('Old password is required'),
    check('newPassword').isLength({ min: 8 }).withMessage('New password must be at least 6 characters'),
  ],
  changePassword
);

module.exports = router;
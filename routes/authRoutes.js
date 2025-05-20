const express = require('express');
const router = express.Router();
const { loginUser, logoutUser, getCurrentUser } = require('../controllers/authController');
const { check } = require('express-validator');
const authMiddleware = require('../middleware/auth');

router.post(
  '/login',
  [
    check('email').isEmail().withMessage('Valid email is required'),
    check('password').notEmpty().withMessage('Password is required'),
  ],
  loginUser
);

router.post('/logout', authMiddleware, logoutUser);

router.get('/me', authMiddleware, getCurrentUser);

module.exports = router;
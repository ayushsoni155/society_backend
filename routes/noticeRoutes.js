const express = require('express');
const router = express.Router();
const { createNotice, getNotices, getNoticeById, updateNotice, deleteNotice } = require('../controllers/noticeController');
const { check } = require('express-validator');
const authenticate = require('../middleware/auth');

router.post(
  '/create',
  authenticate,
  [
    check('title').notEmpty().withMessage('Title is required'),
    check('content').notEmpty().withMessage('Content is required'),
  ],
  createNotice
);

router.get('/', getNotices);

router.get('/:noticeID', getNoticeById);

router.put(
  '/:noticeID',
  authenticate,
  [
    check('title').optional().notEmpty().withMessage('Title cannot be empty'),
    check('content').optional().notEmpty().withMessage('Content cannot be empty'),
  ],
  updateNotice
);

router.delete('/:noticeID', authenticate, deleteNotice);

module.exports = router;
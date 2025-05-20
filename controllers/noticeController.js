const { Notice } = require('../models');
const { validationResult } = require('express-validator');

// Create a new notice (admin only)
const createNotice = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const user = req.user;
    if (!user || user.isAdmin !== 'true') {
      return res.status(403).json({ error: 'Forbidden: Only admins can create notices' });
    }

    const notice = await Notice.create({ ...req.body, created_by: user.user_id });
    res.status(201).json({ message: 'Notice created', notice });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all notices
const getNotices = async (req, res) => {
  try {
    const notices = await Notice.findAll();
    if (!notices.length) return res.status(404).json({ error: 'No notices found' });

    res.json(notices);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get a specific notice by ID
const getNoticeById = async (req, res) => {
  const { noticeID } = req.params;

  try {
    const notice = await Notice.findByPk(noticeID);
    if (!notice) return res.status(404).json({ error: 'Notice not found' });

    res.json(notice);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update a notice (admin only)
const updateNotice = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { noticeID } = req.params;

  try {
    const user = req.user;
    if (!user || user.isAdmin !== 'true') {
      return res.status(403).json({ error: 'Forbidden: Only admins can update notices' });
    }

    const notice = await Notice.findByPk(noticeID);
    if (!notice) return res.status(404).json({ error: 'Notice not found' });

    await notice.update(req.body);
    res.json({ message: 'Notice updated', notice });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete a notice (admin only)
const deleteNotice = async (req, res) => {
  const { noticeID } = req.params;

  try {
    const user = req.user;
    if (!user || user.isAdmin !== 'true') {
      return res.status(403).json({ error: 'Forbidden: Only admins can delete notices' });
    }

    const notice = await Notice.findByPk(noticeID);
    if (!notice) return res.status(404).json({ error: 'Notice not found' });

    await notice.destroy();
    res.json({ message: 'Notice deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  createNotice,
  getNotices,
  getNoticeById,
  updateNotice,
  deleteNotice,
};
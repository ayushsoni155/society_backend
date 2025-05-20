const { User } = require('../models');
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');

// Register a new member
const registerMember = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { name, email, phone_number, password, address, city, state } = req.body;

  try {
    const existingUser = await User.findOne({
      where: { [Op.or]: [{ email }, { phone_number }] },
    });

    if (existingUser) {
      return res.status(400).json({ error: 'Email or phone number already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      phone_number,
      password: hashedPassword,
      address,
      city,
      state,
      isAdmin: 'false', // Ensure boolean
    });

    res.status(201).json({
      message: 'Member created',
      user: { user_id: user.user_id, name, email },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all members
const getAllMembers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password'] },
    });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get specific member by ID
const getMemberById = async (req, res) => {
  const { memberID } = req.params;

  try {
    const user = await User.findByPk(memberID, {
      attributes: { exclude: ['password'] },
    });
    if (!user) return res.status(404).json({ error: 'Member not found' });

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update member profile
const updateMember = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { memberID } = req.params;
  const { name, phone_number, address, city, state } = req.body;

  try {
    const user = await User.findByPk(memberID);
    if (!user) return res.status(404).json({ error: 'Member not found' });

    if (phone_number && phone_number !== user.phone_number) {
      const existingUser = await User.findOne({ where: { phone_number } });
      if (existingUser) return res.status(400).json({ error: 'Phone number already in use' });
    }

    await user.update({
      name: name || user.name,
      phone_number: phone_number || user.phone_number,
      address: address || user.address,
      city: city || user.city,
      state: state || user.state,
    });

    const updatedUser = user.get({ plain: true });
    delete updatedUser.password;

    res.json({ message: 'Profile updated', user: updatedUser });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete a member
const deleteMember = async (req, res) => {
  const { memberID } = req.params;

  try {
    const user = await User.findByPk(memberID);
    if (!user) return res.status(404).json({ error: 'Member not found' });

    await user.destroy();
    res.json({ message: 'Member deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Change password
const changePassword = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { oldPassword, newPassword } = req.body;

  try {
    const user = await User.findByPk(req.user.user_id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) return res.status(401).json({ error: 'Incorrect old password' });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await user.update({ password: hashedPassword });

    res.json({ message: 'Password changed successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  registerMember,
  getAllMembers,
  getMemberById,
  updateMember,
  deleteMember,
  changePassword,
};
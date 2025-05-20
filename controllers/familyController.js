const { Family } = require('../models');
const { validationResult } = require('express-validator');

// Add a family member to a member's account
const addFamilyMember = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const userId = req.user?.user_id;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const family = await Family.create({ ...req.body, user_id: userId });
    res.status(201).json({ message: 'Family member added', family });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get family members linked to a specific member
const getFamilyByMember = async (req, res) => {
  const { memberID } = req.params;

  try {
    const family = await Family.findAll({ where: { user_id: memberID } });
    if (!family.length) return res.status(404).json({ error: 'No family members found' });

    res.json(family);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update family member info
const updateFamilyMember = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { familyID } = req.params;

  try {
    const familyMember = await Family.findByPk(familyID);
    if (!familyMember) return res.status(404).json({ error: 'Family member not found' });

    // Ensure the logged-in user owns this family member
    if (familyMember.user_id !== req.user?.user_id) {
      return res.status(403).json({ error: 'Forbidden: You can only update your own family members' });
    }

    await familyMember.update(req.body);
    res.json({ message: 'Family member updated', family: familyMember });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete a family member
const deleteFamilyMember = async (req, res) => {
  const { familyID } = req.params;

  try {
    const familyMember = await Family.findByPk(familyID);
    if (!familyMember) return res.status(404).json({ error: 'Family member not found' });

    // Ensure the logged-in user owns this family member
    if (familyMember.user_id !== req.user?.user_id) {
      return res.status(403).json({ error: 'Forbidden: You can only delete your own family members' });
    }

    await familyMember.destroy();
    res.json({ message: 'Family member deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  addFamilyMember,
  getFamilyByMember,
  updateFamilyMember,
  deleteFamilyMember,
};
const express = require('express');
const router = express.Router();
const { addFamilyMember, getFamilyByMember, updateFamilyMember, deleteFamilyMember } = require('../controllers/familyController');
const { check } = require('express-validator');
const authenticate = require('../middleware/auth');

router.post(
  '/add',
  authenticate,
  [
    check('name').notEmpty().withMessage('Name is required'),
    // Add more validations as needed based on Family model
  ],
  addFamilyMember
);

router.get('/:memberID', authenticate, getFamilyByMember);

router.put(
  '/:familyID',
  authenticate,
  [
    check('name').optional().notEmpty().withMessage('Name cannot be empty'),
    // Add more validations as needed based on Family model
  ],
  updateFamilyMember
);

router.delete('/:familyID', authenticate, deleteFamilyMember);

module.exports = router;
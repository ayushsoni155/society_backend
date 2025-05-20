const { User } = require('../models');

module.exports = async (req, res, next) => {
  try {
    // Check if req.user exists (set by authentication middleware)
    if (!req.user || !req.user.user_id) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    // Find the user by user_id and check if they are an admin
    const admin = await User.findOne({
      where: {
        user_id: req.user.user_id,
        isAdmin: "true",
      },
    });

    // If no admin user is found, deny access
    if (!admin) {
      return res.status(403).json({ error: 'Admin access required' });
    }

    // If the user is an admin, proceed to the next middleware/route handler
    next();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
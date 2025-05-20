const { Query } = require('../models');

const sendQuery = async (req, res) => {
  try {
    const query = await Query.create(req.body);
    res.status(201).json(query);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getUserQueries = async (req, res) => {
  try {
    const queries = await Query.findAll({ where: { user_id: req.params.user_id } });
    res.json(queries);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { sendQuery, getUserQueries };

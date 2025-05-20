const express = require('express');
const router = express.Router();

const { sendQuery, getUserQueries } = require('../controllers/queryController');

router.post('/send', sendQuery);           
router.get('/:user_id', getUserQueries);   

module.exports = router;

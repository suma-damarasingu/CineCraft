const express = require('express');
const { chatScript } = require('../controllers/chatController');

const router = express.Router();

router.post('/chat', chatScript);

module.exports = router;

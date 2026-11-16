const express = require('express');
const { createSceneImage } = require('../controllers/imageController');

const router = express.Router();

router.post('/generate-image', createSceneImage);

module.exports = router;

const express = require('express');
const { generateTraits, createCharacter, getAllCharacters, getCharacterCount } = require('../controllers/characterController');

const router = express.Router();

router.post('/generate-traits', generateTraits);
router.post('/', createCharacter);
router.get('/', getAllCharacters);
router.get('/count', getCharacterCount);

module.exports = router;

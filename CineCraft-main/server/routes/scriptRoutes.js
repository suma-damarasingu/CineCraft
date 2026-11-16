const express = require('express');
const { createScript, getScriptById, getAllScripts, updateScript, deleteScript, getScriptCount, getRecentScripts } = require('../controllers/scriptController');

const router = express.Router();

// Generate & Save
router.post('/generate-script', createScript);

// CRUD
router.get('/scripts', getAllScripts);
router.get('/scripts/count', getScriptCount);
router.get('/scripts/recent', getRecentScripts);
router.get('/scripts/:id', getScriptById);
router.put('/scripts/:id', updateScript);
router.delete('/scripts/:id', deleteScript);
router.post('/scripts/:id/storyboard', require('../controllers/scriptController').generateStoryboard);

module.exports = router;

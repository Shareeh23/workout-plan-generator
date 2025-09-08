const express = require('express');
const isAuth = require('../middleware/is-auth');
const analysisController = require('../controllers/analysis.js');

const router = express.Router();

router.get('/:exercise', isAuth, analysisController.getAnalysis);

module.exports = router;
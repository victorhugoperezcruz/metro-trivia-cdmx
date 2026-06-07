const express = require('express');
const router = express.Router();
const { seedDatabase, getAllLines } = require('../controllers/lineController');

router.get('/seed', seedDatabase);
router.get('/', getAllLines);

module.exports = router;

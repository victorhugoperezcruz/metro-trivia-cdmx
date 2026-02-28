const express = require('express');
const router = express.Router();
const {
    getLeaderboard,
    unlockAchievement,
    patchProgress,
    deleteProgress,
    getProfile,
    updateProfile,
} = require('../controllers/userController');
const { protect } = require('../middleware/auth');

router.get('/leaderboard', getLeaderboard);
router.post('/achievements', protect, unlockAchievement);
router.patch('/progress', protect, patchProgress);
router.delete('/progress', protect, deleteProgress);
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);

module.exports = router;

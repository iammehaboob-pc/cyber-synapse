const express = require('express');
const router = express.Router();

// Controllers
const { register, login } = require('../controllers/authController');
const {
  getLeaderboard,
  saveScore,
  getProfile,
  updateProfile,
  deleteAccount
} = require('../controllers/userController');

// Middleware
const { protect } = require('../middleware/auth');

// Auth Routes
router.post('/register', register);
router.post('/login', login);

// Leaderboard Route (Public)
router.get('/leaderboard', getLeaderboard);

// Game Scores & User Profile Routes (Protected)
router.post('/save-score', protect, saveScore);
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.delete('/account', protect, deleteAccount);

module.exports = router;

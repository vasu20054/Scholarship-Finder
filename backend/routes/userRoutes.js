const express = require('express');
const router = express.Router();

const {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
} = require('../controllers/userController');

const { protect } = require('../middleware/authMiddleware');

// Public route for user registration
router.post('/', registerUser);

// Public route for user login
router.post('/login', loginUser);

// Protected routes to get and update user profile
router
  .route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

module.exports = router;
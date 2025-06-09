const express = require('express');
const router = express.Router();

const {
  createScholarship,
  getScholarships,         // For general scholarships
  getScholarshipById,
  updateScholarship,
  deleteScholarship,
  getEligibleScholarships, // For personalized scholarships
} = require('../controllers/scholarshipController');

const { protect, admin } = require('../middleware/authMiddleware');

// --- ROUTE ORDER MATTERS ---
router.get('/', getScholarships); // GET /api/scholarships

// Protected route for logged-in users to get personalized scholarships
router.get('/eligible', protect, getEligibleScholarships); // GET /api/scholarships/eligible

router.get('/:id', getScholarshipById); // GET /api/scholarships/:id

// Private routes (requires authentication and admin role)
router.post('/', protect, admin, createScholarship);
router.put('/:id', protect, admin, updateScholarship);
router.delete('/:id', protect, admin, deleteScholarship);

module.exports = router;
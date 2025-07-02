const express = require('express');
const router = express.Router();
const {
  addProcurement,
  getProcurementByEnquiry,
  updateProcurementByEnquiry,
  getAllProcurements
} = require('../controllers/procurementController');

const { protect, roleCheck } = require('../middleware/auth');

// @route   POST /api/procurement
// @desc    Create procurement entry for an enquiry
// @access  Private (Procurement role only)
router.post('/', protect, roleCheck('procurement'), addProcurement);

// @route   GET /api/procurement/:enquiryId
// @desc    Get procurement info for a specific enquiry
// @access  Private (Procurement role only)
router.get('/:enquiryId', protect, roleCheck('procurement'), getProcurementByEnquiry);

// @route   PUT /api/procurement/:enquiryId
// @desc    Update procurement info for a specific enquiry
// @access  Private (Procurement role only)
router.put('/:enquiryId', protect, roleCheck('procurement'), updateProcurementByEnquiry);

// @route   GET /api/procurement
// @desc    Get all procurement records
// @access  Private (Procurement role only)
router.get('/', protect, roleCheck('procurement'), getAllProcurements);

module.exports = router;

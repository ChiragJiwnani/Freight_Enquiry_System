// File: server/routes/enquiryRoutes.js
const express = require('express');
const router = express.Router();
const { protect, roleCheck } = require('../middleware/auth');
const {
  createEnquiry,
  getEnquiries,
  getEnquiryById,
  updateEnquiryStatus,
  updateProcurementInfo
} = require('../controllers/enquiryController');

// ---------------------------
// PUBLIC / PROTECTED ROUTES
// ---------------------------

// Get all enquiries (public or protected based on use case)
router.get('/', getEnquiries);

// Create new enquiry (executive only)
// router.post('/', protect, roleCheck('executive'), createEnquiry);

// Get single enquiry (both roles)
router.get('/:id', protect, getEnquiryById);

// Update enquiry status (optional)
router.put('/:id/status', protect, updateEnquiryStatus);

// Add or update procurement info (procurement only)
router.put('/:id/procurement', protect, roleCheck('procurement'), updateProcurementInfo);


const multer = require('multer');
const path = require('path');
const Enquiry = require('../models/Enquiry');

// Setup storage config for multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Make sure this folder exists
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${file.fieldname}${ext}`);
  },
});

const upload = multer({ storage });

// Enquiry Create Route (multipart/form-data support)
router.post('/', protect, upload.array('photos'), async (req, res) => {
  try {
    const { body, files } = req;

    const enquiry = new Enquiry({
      ...body,
      dimensions: {
        height: body['dimensions.height'],
        width: body['dimensions.width'],
        length: body['dimensions.length'],
      },
      photos: files.map(file => file.filename),
    });

    await enquiry.save();
    res.status(201).json(enquiry);
  } catch (err) {
    console.error('Enquiry creation failed:', err.message);
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;

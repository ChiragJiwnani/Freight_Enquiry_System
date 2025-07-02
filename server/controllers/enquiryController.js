const Enquiry = require('../models/Enquiry');

// GET all enquiries
exports.getEnquiries = async (req, res) => {
  try {
    const enquiries = await Enquiry.find().sort({ createdAt: -1 });
    res.json(enquiries);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// CREATE enquiry
exports.createEnquiry = async (req, res) => {
  try {
    const enquiry = new Enquiry(req.body);
    await enquiry.save();
    res.status(201).json(enquiry);
    console.log('📩 Incoming Enquiry:', req.body);
    console.log('📎 Uploaded Files:', req.files);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// GET single enquiry
exports.getEnquiryById = async (req, res) => {
  try {
    const enquiry = await Enquiry.findById(req.params.id);
    if (!enquiry) return res.status(404).json({ error: 'Enquiry not found' });
    res.json(enquiry);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE procurement info
exports.updateProcurementInfo = async (req, res) => {
  try {
    const { carrier, rate, remarks } = req.body;

    const enquiry = await Enquiry.findByIdAndUpdate(
      req.params.id,
      {
        procurementInfo: { carrier, rate, remarks },
        status: 'reviewed',
      },
      { new: true }
    );

    if (!enquiry) return res.status(404).json({ error: 'Enquiry not found' });

    res.json(enquiry);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Optional: update status independently
exports.updateEnquiryStatus = async (req, res) => {
  try {
    const enquiry = await Enquiry.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    res.json(enquiry);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// const io = req.app.get('io');
// io.emit('new_enquiry', enquiry);
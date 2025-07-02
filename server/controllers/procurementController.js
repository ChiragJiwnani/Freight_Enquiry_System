const Enquiry = require('../models/Enquiry');

// @desc Add procurement info to an enquiry
// @route POST /api/procurement
// @access Private (via middleware)
const addProcurement = async (req, res) => {
  try {
    const { enquiryId, carrier, rate, remarks } = req.body;

    const enquiry = await Enquiry.findById(enquiryId);
    if (!enquiry) {
      return res.status(404).json({ error: 'Enquiry not found' });
    }

    enquiry.procurementInfo = { carrier, rate, remarks };
    enquiry.status = 'reviewed';
    await enquiry.save();

    // Emit updated enquiry to clients
    const io = req.app.get('io');
    io.emit('procurement_updated', enquiry);

    res.status(200).json(enquiry);
  } catch (err) {
    console.error('❌ Error adding procurement:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
};

// @desc Get procurement info for a specific enquiry
// @route GET /api/procurement/:enquiryId
const getProcurementByEnquiry = async (req, res) => {
  try {
    const enquiry = await Enquiry.findById(req.params.enquiryId);

    if (!enquiry) {
      return res.status(404).json({ error: 'Enquiry not found' });
    }

    res.status(200).json(enquiry.procurementInfo || {});
  } catch (err) {
    console.error('❌ Error fetching procurement:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
};

// @desc Update procurement info for a specific enquiry
// @route PUT /api/procurement/:enquiryId
const updateProcurementByEnquiry = async (req, res) => {
  try {
    const { carrier, rate, remarks } = req.body;

    const enquiry = await Enquiry.findById(req.params.enquiryId);
    if (!enquiry) {
      return res.status(404).json({ error: 'Enquiry not found' });
    }

    enquiry.procurementInfo = { carrier, rate, remarks };
    enquiry.status = 'reviewed';
    await enquiry.save();

    const io = req.app.get('io');
    io.emit('procurement_updated', enquiry);

    res.status(200).json(enquiry);
  } catch (err) {
    console.error('❌ Error updating procurement:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
};

// @desc Get all procurements
// @route GET /api/procurement
const getAllProcurements = async (req, res) => {
  try {
    const enquiries = await Enquiry.find({ procurementInfo: { $ne: null } });
    const procurements = enquiries.map((e) => ({
      enquiryId: e._id,
      shipper: e.shipper,
      route: `${e.por} → ${e.pol} → ${e.pod}`,
      type: e.type,
      procurementInfo: e.procurementInfo,
      status: e.status,
    }));

    res.status(200).json(procurements);
  } catch (err) {
    console.error('❌ Error fetching all procurements:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = {
  addProcurement,
  getProcurementByEnquiry,
  updateProcurementByEnquiry,
  getAllProcurements,
};

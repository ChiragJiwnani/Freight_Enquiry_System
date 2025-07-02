// File: server/models/Enquiry.js
const mongoose = require('mongoose');

const procurementSchema = new mongoose.Schema({
  carrier: { type: String, trim: true },
  rate: { type: String, trim: true },
  remarks: { type: String, trim: true },
}, { _id: false });

const enquirySchema = new mongoose.Schema({
  type: { type: String, required: true },
  shipper: { type: String, required: true },
  por: { type: String, required: true },
  pol: { type: String, required: true },
  pod: { type: String, required: true },
  shipmentTerms: String,
  commodity: String,
  weight: String,
  equipmentType: String,
  stuffingDate: String,
  targetVessel: String,
  msds: Boolean,
  class: String,
  unNumber: String,
  packingGroup: String,
  dimensions: {
    height: String,
    width: String,
    length: String,
  },
  executiveRemarks: String,
  photos: [String],
  procurementInfo: {
    carrier: String,
    rate: String,
    remarks: String,
  },
  status: {
    type: String,
    default: 'pending',
    enum: ['pending', 'reviewed'],
  },
}, { timestamps: true });

module.exports = mongoose.model('Enquiry', enquirySchema);

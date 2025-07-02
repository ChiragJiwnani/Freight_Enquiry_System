// File: client/src/pages/EnquiryForm.js
import React, { useState, useRef } from 'react';
import axios from '../api/axios';

const initialState = {
  shipper: '', por: '', pol: '', pod: '', shipmentTerms: '', commodity: '',
  weight: '', equipmentType: '', stuffingDate: '', targetVessel: '', msds: false,
  class: '', unNumber: '', packingGroup: '', dimensions: {
    height: '',
    width: '',
    length: '',
  }, photos: [],
  executiveRemarks: ''
};

const EnquiryForm = () => {
  const [formData, setFormData] = useState(initialState);
  const [enquiryType, setEnquiryType] = useState(null);
  const fileInputRef = useRef();

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    if (type === 'file') {
      setFormData((prev) => ({ ...prev, photos: files }));
    } else if (name.startsWith('dimensions.')) {
      const dimensionField = name.split('.')[1];
      setFormData((prev) => ({
        ...prev,
        dimensions: {
          ...prev.dimensions,
          [dimensionField]: value,
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    const requiredFields = ['shipper', 'por', 'pol', 'pod'];
    const missingFields = requiredFields.filter(field => !formData[field]);

    if (!enquiryType) {
      alert('❌ Please select a shipment type.');
      return;
    }

    if (missingFields.length > 0) {
      alert(`❌ Missing fields: ${missingFields.join(', ')}`);
      return;
    }

    try {
      const data = new FormData();

      Object.entries(formData).forEach(([key, value]) => {
        if (key === 'photos') {
          for (let file of value) data.append('photos', file);
        } else {
          data.append(key, value);
        }
      });

      data.append('type', enquiryType);

      console.log('🔍 Submitting enquiry with keys:');
      for (let key of data.keys()) console.log(key);

      await axios.post('/enquiries', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      alert('✅ Enquiry submitted successfully');
      setFormData(initialState);
      setEnquiryType(null);
      fileInputRef.current.value = '';
    } catch (err) {
      console.error('❌ Submission failed:', err);
      alert('❌ Submission failed: ' + (err.response?.data?.error || err.message));
    }
  };


  return (
    <div className="max-w-2xl mx-auto p-6 ">
      <h2 className="text-2xl font-bold mb-4">➕ New Enquiry</h2>

      <div className="flex justify-center gap-2 mb-6">
        {['Sea Export', 'Sea Import', 'Air Export', 'Air Import', 'Cross Country'].map((type) => (
          <button
            key={type}
            type="button"
            onClick={() => setEnquiryType(type)}
            className={`px-4 py-2 rounded-full shadow ${enquiryType === type ? 'bg-blue-600 text-white' : 'bg-gray-200 text-black'}`}
          >
            {type}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {[
          { name: 'shipper', label: 'Shipper' },
          { name: 'por', label: 'POR' },
          { name: 'pol', label: 'POL' },
          { name: 'pod', label: 'POD' },
          { name: 'shipmentTerms', label: 'Shipment Terms' },
          { name: 'commodity', label: 'Commodity' },
          { name: 'weight', label: 'Weight per Equipment' },
          { name: 'equipmentType', label: 'Equipment Type' },
          { name: 'stuffingDate', label: 'Stuffing Date', type: 'date' },
          { name: 'targetVessel', label: 'Target Vessel' },
          { name: 'class', label: 'Class' },
          { name: 'unNumber', label: 'UN Number' },
          { name: 'packingGroup', label: 'Packing Group' },
        ].map(({ name, label, type = 'text' }) => (
          <input
            key={name}
            type={type}
            name={name}
            value={formData[name]}
            onChange={handleChange}
            placeholder={label}
            className="w-full p-2 bg-white shadow-lg rounded"
            required={['shipper', 'por', 'pol', 'pod'].includes(name)}
          />

        ))}

        {/* Dimensions */}
        <div className="font-small mb-2 ">

          Dimensions:
          <div className=" gap-2 flex items-center my-2">
            <input
              type="text"
              name="dimensions.height"
              value={formData.dimensions?.height}
              onChange={handleChange}
              placeholder="Height"
              className="p-2 bg-white shadow-lg rounded w-full"
            />
            <input
              type="text"
              name="dimensions.width"
              value={formData.dimensions?.width}
              onChange={handleChange}
              placeholder="Width"
              className="p-2 bg-white shadow-lg rounded w-full"
            />
            <input
              type="text"
              name="dimensions.length"
              value={formData.dimensions?.length}
              onChange={handleChange}
              placeholder="Length"
              className="p-2 bg-white shadow-lg rounded w-full"
            />
          </div>
        </div>


        <div className="flex items-center gap-2">
          <input type="checkbox" name="msds" checked={formData.msds} onChange={handleChange} />
          <label>MSDS</label>
        </div>

        <textarea
          name="executiveRemarks"
          value={formData.executiveRemarks}
          onChange={handleChange}
          placeholder="Executive Remarks"
          className="w-full p-2 bg-white shadow-lg rounded"
          rows={3}
        />

        <div>
          <label className="block font-medium mb-1">Upload Photos/Diagrams</label>
          <input
            type="file"
            name="photos"
            multiple
            accept="image/*"
            ref={fileInputRef}
            onChange={handleChange}
            className="w-full p-2 bg-white shadow-lg rounded bg-blue-50"
          />
        </div>

        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Submit Enquiry
        </button>
      </form>
    </div>
  );
};

export default EnquiryForm;

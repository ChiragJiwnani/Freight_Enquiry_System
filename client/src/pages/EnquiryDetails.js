// File: client/src/pages/EnquiryDetails.js
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../api/axios';

const EnquiryDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [enquiry, setEnquiry] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEnquiry = async () => {
      try {
        const { data } = await axios.get(`/enquiries/${id}`);
        setEnquiry(data);
      } catch (err) {
        console.error('❌ Failed to fetch enquiry:', err);
        setError('Unable to load enquiry details.');
      }
    };

    fetchEnquiry();
  }, [id]);

  if (error) {
    return <p className="text-center mt-10 text-red-600">{error}</p>;
  }

  if (!enquiry) {
    return <p className="text-center mt-10 text-gray-500">Loading enquiry details...</p>;
  }

  const {
    shipper, por, pol, pod, shipmentTerms, commodity, weight, equipmentType,
    stuffingDate, targetVessel, msds, class: hazClass, unNumber, packingGroup,
    dimensions, executiveRemarks, procurementInfo
  } = enquiry;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">📄 Enquiry Details</h2>
        <button
          onClick={() => navigate(-1)}
          className="bg-gray-200 text-sm px-3 py-1 rounded hover:bg-gray-300"
        >
          ← Back
        </button>
      </div>

      <div className="mb-6 space-y-2">
        <p><strong>Shipper:</strong> {shipper}</p>
        <p><strong>Route:</strong> {por} → {pol} → {pod}</p>
        <p><strong>Shipment Terms:</strong> {shipmentTerms}</p>
        <p><strong>Commodity:</strong> {commodity}</p>
        <p><strong>Weight:</strong> {weight}</p>
        <p><strong>Equipment Type:</strong> {equipmentType}</p>
        <p><strong>Stuffing Date:</strong> {stuffingDate ? new Date(stuffingDate).toLocaleDateString() : 'N/A'}</p>
        <p><strong>Target Vessel:</strong> {targetVessel}</p>
        <p><strong>MSDS:</strong> {msds ? 'Yes' : 'No'}</p>
        <p><strong>Class / UN Number / Packing Group:</strong> {hazClass} / {unNumber} / {packingGroup}</p>
        <p><strong>Dimensions:</strong> <p><strong>Height:</strong> {enquiry.dimensions?.height || 'N/A'}</p>
          <p><strong>Width:</strong> {enquiry.dimensions?.width || 'N/A'}</p>
          <p><strong>Length:</strong> {enquiry.dimensions?.length || 'N/A'}</p>
        </p>
        <p><strong>Executive Remarks:</strong> {executiveRemarks}</p>
      </div>

      {/* Procurement Info Section */}
      {procurementInfo ? (
        <div className="mt-6 p-4 bg-green-100 rounded">
          <h3 className="text-lg font-semibold mb-2 text-green-800">✅ Procurement Info</h3>
          <p><strong>Carrier:</strong> {procurementInfo.carrier}</p>
          <p><strong>Rate:</strong> {procurementInfo.rate}</p>
          <p><strong>Remarks:</strong> {procurementInfo.remarks}</p>
        </div>
      ) : (
        <div className="mt-6 p-4 bg-yellow-100 rounded text-yellow-800">
          <p><strong>⚠️ Procurement not added yet.</strong></p>
        </div>
      )}
    </div>
  );
};

export default EnquiryDetails;

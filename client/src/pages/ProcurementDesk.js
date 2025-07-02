// File: client/src/pages/ProcurementDesk.js
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from '../api/axios';

const FILTER_TYPES = ['All', 'Sea Export', 'Sea Import', 'Air Export', 'Air Import', 'Cross Country'];

const ProcurementDesk = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [allEnquiries, setAllEnquiries] = useState([]);
  const [enquiry, setEnquiry] = useState(null);
  const [form, setForm] = useState({ carrier: '', rate: '', remarks: '' });
  const [filterType, setFilterType] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchAllEnquiries = async () => {
    try {
      const res = await axios.get('/enquiries');
      setAllEnquiries(res.data);
    } catch (err) {
      console.error('Failed to fetch enquiries:', err);
    }
  };

  const fetchEnquiryById = async () => {
    try {
      const res = await axios.get(`/enquiries/${id}`);
      setEnquiry(res.data);
      if (res.data.procurementInfo) {
        const { carrier, rate, remarks } = res.data.procurementInfo;
        setForm({ carrier, rate, remarks });
      }
    } catch (err) {
      console.error('❌ Error fetching enquiry:', err);
    }
  };

  useEffect(() => {
    id ? fetchEnquiryById() : fetchAllEnquiries();
  }, [id]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.put(`/enquiries/${id}/procurement`, form);
      alert('✅ Procurement info saved');
      navigate('/procurement');
    } catch (err) {
      alert('❌ Failed to save');
    } finally {
      setLoading(false);
    }
  };

  const filteredEnquiries = filterType
    ? allEnquiries.filter((e) => e.type === filterType)
    : allEnquiries;

  // Listing View
  if (!id) {
    return (
      <div className="max-w-6xl mx-auto p-6 rounded">
        <h2 className="text-2xl font-bold mb-6 text-center">🧾 Procurement Desk</h2>

        {/* Filter Tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-6">
          {FILTER_TYPES.map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type === 'All' ? '' : type)}
              className={`px-4 py-2 rounded-full text-sm font-medium shadow transition duration-600 ${filterType === type || (type === 'All' && !filterType)
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-black'
                }`}
            >
              {type}
            </button>
          ))}
        </div>

        {/* Enquiry List */}
        {filteredEnquiries.length === 0 ? (
          <p className="text-center text-gray-500">No enquiries found.</p>
        ) : (
          <ul className="grid gap-4">
            {filteredEnquiries.map((e) => (
              <li
                key={e._id}
                className={`p-4 rounded shadow flex justify-between items-center ${e.status === 'pending' ? 'bg-red-100' : 'bg-green-100'
                  }`}
              >
                <div>
                  <p><strong>Shipper:</strong> {e.shipper}</p>
                  <p><strong>Route:</strong> {e.por} → {e.pol} → {e.pod}</p>
                  <p><strong>Type:</strong> {e.type}</p>
                  <p><strong>Status:</strong>{' '}
                    <span className={`font-semibold ${e.status === 'pending' ? 'text-red-500' : 'text-green-600'}`}>
                      {e.status}
                    </span>
                  </p>
                </div>
                <Link
                  to={`/procurement/${e._id}`}
                  className="px-4 py-2 rounded text-white bg-blue-600 hover:bg-blue-700 transition hover:opacity-90"
                >
                  {e.status?.toLowerCase() === 'reviewed' ? 'Edit' : 'Open'}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }

  // Single Enquiry View
  if (!enquiry) return <p className="text-center p-6">Loading...</p>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4 text-blue-600 text-center">Procurement for Enquiry</h2>

      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold mb-2">Enquiry Details</h3>
          <button
            onClick={() => navigate(-1)}
            className="bg-gray-200 text-sm px-3 py-1 rounded hover:bg-gray-300"
          >
            ← Back
          </button>
        </div>

        <div className='space-y-2'>

          <p className='text-gray-500'><strong>Shipper:</strong> {enquiry.shipper}</p>
          <p className='text-gray-500' ><strong>Route:</strong> {enquiry.por} → {enquiry.pol} → {enquiry.pod}</p>
          <p className='text-gray-500'><strong>Shipment Terms:</strong> {enquiry.shipmentTerms}</p>
          <p className='text-gray-500'><strong>Commodity:</strong> {enquiry.commodity}</p>
          <p className='text-gray-500'><strong>Weight:</strong> {enquiry.weight}</p>
          <p className='text-gray-500'><strong>Equipment Type:</strong> {enquiry.equipmentType}</p>
          <p className='text-gray-500'><strong>Stuffing Date:</strong> {enquiry.stuffingDate}</p>
          <p className='text-gray-500'><strong>Target Vessel:</strong> {enquiry.targetVessel}</p>
          <p className='text-gray-500'><strong>MSDS:</strong> {enquiry.msds ? 'Yes' : 'No'}</p>
          <p className='text-gray-500'><strong>Class / UN Number / Packing Group:</strong> {enquiry.class} / {enquiry.unNumber} / {enquiry.packingGroup}</p>
          <p className='text-gray-500'><strong>Dimensions:</strong> {enquiry.dimensions}</p>
          <p className='text-gray-500'><strong>Executive Remarks:</strong> {enquiry.executiveRemarks}</p>

          {enquiry.photos?.length > 0 && (
            <div className="mt-4">
              <h4 className="font-medium">Uploaded Diagrams:</h4>
              <div className="grid grid-cols-2 gap-4 mt-2">
                {enquiry.photos.map((filename, index) => (
                  <img
                    key={index}
                    src={`http://localhost:5000/uploads/${filename}`}
                    alt={`Diagram ${index + 1}`}
                    className="w-full border rounded"
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <h3 className="text-lg font-semibold">Procurement Info</h3>
        <input
          name="carrier"
          placeholder="Carrier Name"
          value={form.carrier}
          onChange={handleChange}
          className="w-full p-2 bg-gray-100 rounded"
        />
        <input
          name="rate"
          placeholder="Rate"
          value={form.rate}
          onChange={handleChange}
          className="w-full p-2 bg-gray-100 rounded"
        />
        <textarea
          name="remarks"
          placeholder="Remarks"
          value={form.remarks}
          onChange={handleChange}
          className="w-full p-2 bg-gray-100 rounded"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-60"
        >
          {loading ? 'Saving...' : 'Save'}
        </button>
      </form>
    </div>
  );
};

export default ProcurementDesk;

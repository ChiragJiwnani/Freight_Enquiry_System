import React, { useEffect, useState } from 'react';
import axios from '../api/axios';
import { Link } from 'react-router-dom';
import socket from '../sockets/socket';

const shipmentTypes = ['All', 'Sea Export', 'Sea Import', 'Air Export', 'Air Import', 'Cross Country'];

const EnquiryList = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [filterType, setFilterType] = useState('');
  const [loading, setLoading] = useState(true);

  // Fetch all enquiries
  const fetchEnquiries = async () => {
    try {
      const { data } = await axios.get('/enquiries');
      setEnquiries(data);
    } catch (err) {
      console.error('❌ Failed to fetch enquiries:', err);
    } finally {
      setLoading(false);
    }
  };

  // Real-time socket update
  useEffect(() => {
    fetchEnquiries();
    const handleNewEnquiry = (newEnquiry) => {
      setEnquiries((prev) =>
        prev.find((e) => e._id === newEnquiry._id) ? prev : [newEnquiry, ...prev]
      );
    };

    socket.on('new_enquiry', handleNewEnquiry);
    return () => socket.off('new_enquiry', handleNewEnquiry);
  }, []);

  // Filter logic
  const filtered = filterType ? enquiries.filter((e) => e.type === filterType) : enquiries;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6 text-center">📦 Enquiry List</h2>

      {/* Filter Tabs */}
      <div className="flex flex-wrap justify-center gap-3 mb-6">
        {shipmentTypes.map((type) => {
          const active = filterType === type || (type === 'All' && !filterType);
          return (
            <button
              key={type}
              onClick={() => setFilterType(type === 'All' ? '' : type)}
              className={`px-4 py-2 rounded-full text-sm font-medium border ${
                active ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'
              }`}
            >
              {type}
            </button>
          );
        })}
      </div>

      {/* Enquiry Grid */}
      <div className="grid gap-4">
        {loading ? (
          <p className="text-center text-gray-400">Loading enquiries...</p>
        ) : filtered.length > 0 ? (
          filtered.map((e) => (
            <div
              key={e._id}
              className="bg-white p-4 rounded shadow-md flex justify-between items-center"
            >
              <div>
                <p><strong>Shipper:</strong> {e.shipper}</p>
                <p><strong>Route:</strong> {e.pol} → {e.pod}</p>
                <p><strong>Type:</strong> {e.type}</p>
                <p>
                  <strong>Status:</strong>{' '}
                  <span
                    className={`font-semibold ${
                      e.status === 'pending' ? 'text-red-500' : 'text-green-600'
                    }`}
                  >
                    {e.status}
                  </span>
                </p>
              </div>
              <Link
                to={`/procurement/${e._id}`}
                className={`px-4 py-2 rounded text-white ${
                  e.status === 'pending' ? 'bg-blue-600' : 'bg-yellow-600'
                } hover:opacity-90 transition`}
              >
                {e.status === 'pending' ? 'Open' : 'Edit'}
              </Link>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">No enquiries found for selected type.</p>
        )}
      </div>
    </div>
  );
};

export default EnquiryList;

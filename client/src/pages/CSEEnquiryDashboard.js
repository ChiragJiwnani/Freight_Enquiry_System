import React, { useEffect, useState } from 'react';
import axios from '../api/axios';
import { Link } from 'react-router-dom';

const CSEEnquiryDashboard = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    fetchEnquiries();
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">📋 Customer Service Dashboard</h2>
        <button
          onClick={fetchEnquiries}
          className="bg-blue-400 text-white px-4 py-2 rounded hover:scale-105 transition duration-300"
        >
          🔄 Refresh
        </button>
      </div>

      {loading ? (
        <p className="text-center text-gray-500">Loading enquiries...</p>
      ) : enquiries.length === 0 ? (
        <p className="text-center text-gray-400">No enquiries found.</p>
      ) : (
        <div className="grid gap-4">
          {enquiries.map((e) => (
            <div
              key={e._id}
              className={`p-4 rounded shadow flex justify-between items-center ${e.status === 'pending' ? 'bg-red-100' : 'bg-green-100'
                }`}
            >

              <div>
                <p><strong>Shipper:</strong> {e.shipper}</p>
                <p><strong>Route:</strong> {e.pol} → {e.pod}</p>
                <p><strong>Type:</strong> {e.type}</p>
                <p><strong>Equipment:</strong> {e.equipmentType}</p>
                <p><strong>Status:</strong>{' '}
                  <span
                    className={`font-semibold ${e.status === 'pending'
                      ? 'text-red-500'
                      : 'text-green-600'
                      }`}
                  >
                    {e.status}
                  </span>
                </p>
              </div>
              <Link
                to={`/enquiry/${e._id}`}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
              >
                Open
              </Link>
            </div>
          ))}
        </div>
      )
      }
    </div >
  );
};

export default CSEEnquiryDashboard;

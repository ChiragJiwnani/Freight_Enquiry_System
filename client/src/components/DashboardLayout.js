// File: client/src/components/DashboardLayout.js
import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Topbar */}
      <header className="bg-white shadow p-4 flex justify-between items-center">
        <h1 className="text-xl font-semibold text-blue-700">🚢 Freight Enquiry System</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">
            Logged in as <strong>{user?.role || 'User'}</strong>
          </span>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Page Content */}
      <main className="flex-1 p-6 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;

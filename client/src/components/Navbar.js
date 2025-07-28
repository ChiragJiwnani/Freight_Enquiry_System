// File: client/src/components/Navbar.js
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); // clears token and user
    navigate('/login');
  };

  const baseLink = 'hover:scale-105 px-3 py-1 rounded transition';
  const activeLink = 'bg-gray-700 text-white';

  return (
    <nav className="bg-gray-800 p-4 text-white flex justify-between items-center">
      <div className="space-x-4 text-sm flex items-center">

        {user?.role === 'executive' && (
          <>
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `${baseLink} ${isActive ? activeLink : ''}`
              }
            >
              📋 Customer Dashboard
            </NavLink>

            <NavLink
              to="/new"
              className={({ isActive }) =>
                `${baseLink} ${isActive ? activeLink : ''}`
              }
            >
              ➕ Create Enquiry
            </NavLink>
          </>
        )}

        {user?.role === 'procurement' && (
          <NavLink
            to="/procurement"
            className={({ isActive }) =>
              `${baseLink} ${isActive ? activeLink : ''}`
            }
          >
            🚚 Procurement Desk
          </NavLink>
        )}
      </div>

    </nav>
  );
};

export default Navbar;

// File: client/src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './output.css';
import { AuthProvider } from './auth/AuthContext';
import ProtectedRoute from './auth/ProtectedRoute';
import DashboardLayout from './components/DashboardLayout';
import CSEEnquiryDashboard from './pages/CSEEnquiryDashboard';
import EnquiryForm from './pages/EnquiryForm';
import EnquiryDetails from './pages/EnquiryDetails';
import ProcurementDesk from './pages/ProcurementDesk';
import Login from './pages/Login';
import Register from './pages/Register';
import Navbar from './components/Navbar';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar/>
        <Routes>

          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Dashboard Routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<CSEEnquiryDashboard />} />
            <Route path="dashboard" element={<CSEEnquiryDashboard />} />

            <Route
              path="new"
              element={
                <ProtectedRoute allowedRoles={['executive']}>
                  <EnquiryForm />
                </ProtectedRoute>
              }
            />

            <Route
              path="enquiry/:id"
              element={
                <ProtectedRoute allowedRoles={['executive', 'procurement']}>
                  <EnquiryDetails />
                </ProtectedRoute>
              }
            />

            <Route
              path="procurement"
              element={
                <ProtectedRoute allowedRoles={['procurement']}>
                  <ProcurementDesk />
                </ProtectedRoute>
              }
            />

            <Route
              path="procurement/:id"
              element={
                <ProtectedRoute allowedRoles={['procurement']}>
                  <ProcurementDesk />
                </ProtectedRoute>
              }
            />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;

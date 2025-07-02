import React, { useState } from 'react';
import axios from '../api/axios';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'executive',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await axios.post('/auth/register', form);
      alert('✅ Account created. Please login.');
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.error || '❌ Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <header className="bg-white shadow p-4 flex justify-between items-center">
        <h1 className="text-xl font-semibold text-blue-700">🚢 Freight Enquiry System</h1>
      </header>

      <form
        onSubmit={handleSubmit}
        className="max-w-md mx-auto mt-20 p-6 bg-white rounded shadow space-y-4"
      >
        <h2 className="text-xl font-bold text-center">Register</h2>

        {error && (
          <p className="text-red-600 text-sm text-center bg-red-100 p-2 rounded">
            {error}
          </p>
        )}

        <input
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          className="w-full p-2 bg-gray-100 rounded"
          required
          autoFocus
        />

        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="w-full p-2 bg-gray-100 rounded"
          required
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="w-full p-2 bg-gray-100 rounded"
          required
        />

        <select
          name="role"
          value={form.role}
          onChange={handleChange}
          className="w-full p-2 bg-gray-100 rounded"
        >
          <option value="executive">Customer Service Executive</option>
          <option value="procurement">Procurement Manager</option>
        </select>

        <button
          type="submit"
          disabled={loading}
          className="bg-green-100 text-white px-4 py-2 rounded w-full disabled:opacity-60 hover:bg-green-500 transition duration-300"
        >
          {loading ? 'Registering...' : 'Register'}
        </button>
      </form>

      <p className="text-center mt-4">
        Already have an account?{' '}
        <Link to="/login" className="text-blue-600 hover:underline">
          Login
        </Link>
      </p>
    </>
  );
};

export default Register;

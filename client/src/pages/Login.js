// Login.js
import React, { useState } from 'react';
import axios from '../api/axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { Link } from 'react-router-dom';

const Login = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [form, setForm] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await axios.post('/auth/login', form);
            const { token, user } = res.data;

            localStorage.setItem('token', token);
            localStorage.setItem('role', user.role);
            localStorage.setItem('userId', user.id);

            login(user, token, user.role);

            navigate(user.role === 'executive' ? '/dashboard' : '/procurement');
        } catch (err) {
            alert(err.response?.data?.error || 'Login failed');
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
                <h2 className="text-xl font-bold">Login</h2>
                <input
                    name="email"
                    type="email"
                    placeholder="Email"
                    onChange={handleChange}
                    value={form.email}
                    required
                    className="w-full p-2 bg-gray-100 rounded"
                />
                <input
                    name="password"
                    type="password"
                    placeholder="Password"
                    onChange={handleChange}
                    value={form.password}
                    required
                    className="w-full p-2 bg-gray-100 rounded"
                />
                <button
                    type="submit"
                    className="bg-blue-200 text-white px-4 py-2 rounded w-full hover:bg-blue-500 transition duration-300 disabled:opacity-60"
                    disabled={loading}
                >
                    {loading ? 'Logging in...' : 'Login'}
                </button>
            </form>

            <p className="text-center mt-4">
                Don't have an account?{' '}
                <Link to="/register" className="text-blue-600 hover:underline">
                    Register
                </Link>
            </p>
        </>
    );
};

export default Login;

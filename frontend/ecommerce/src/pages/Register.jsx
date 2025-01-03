import React, { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import logo from '../components/logo.png';
import { useNavigate } from 'react-router-dom';




function RegisterPage() {
    const nav = useNavigate();
    // State to store form inputs
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        address: '',
        birthday: '',
    });

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Handle input changes
    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData({ ...formData, [id]: value });
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
    
        // Password validation
        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match!");
            return;
        }
    
        try {
            const response = await axios.post('http://localhost:8800/register', {
                name: formData.name,
                email: formData.email,
                password: formData.password,
                address: formData.address,
                birthday: formData.birthday,
            });
    
            if (response.data.success) {
                setSuccess('Registration successful!');
                setFormData({
                    name: '',
                    email: '',
                    password: '',
                    confirmPassword: '',
                    address: '',
                    birthday: '',
                });
                nav('/'); // Redirect to login page
            } else {
                setError(response.data.message || 'Registration failed!');
            }
        } catch (err) {
            console.error(err);
            // Display error message from backend
            setError(err.response?.data?.message || 'An error occurred while registering.');
        }
    };
    return (
        <div className="container vh-100 d-flex align-items-center justify-content-center">
            <div className="row w-100">
                {/* Left Logo Section */}
                <div className="col-md-6 d-flex justify-content-center align-items-center">
                    <img
                        src={logo}
                        alt="Bag Logo"
                        className="img-fluid"
                        style={{ maxWidth: '400px' }}
                    />
                </div>

                {/* Right Register Form Section */}
                <div className="col-md-6 d-flex justify-content-center align-items-center">
                <div
                        className="p-3 rounded shadow bg-light"
                        style={{
                            width: '100%',
                            maxWidth: '550px',
                            height: 'auto',
                            maxHeight: '600px', // Added max height
                            overflowY: 'auto', // Scrollbar if content exceeds height
                        }}
                    >
                        <h3 className="fw-bold mb-3">Welcome!</h3>
                        <p className="text-muted mb-4">Register to BareBags</p>

                        {/* Error or Success Messages */}
                        {error && <div className="alert alert-danger">{error}</div>}
                        {success && <div className="alert alert-success">{success}</div>}

                        {/* Form */}
                        <form onSubmit={handleSubmit}>
                            {/* Name Input */}
                            <div className="mb-4">
                                <label htmlFor="name" className="form-label">ENTER YOUR NAME</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            {/* Email Input */}
                            <div className="mb-4">
                                <label htmlFor="email" className="form-label">ENTER YOUR EMAIL</label>
                                <input
                                    // type="email"
                                    className="form-control"
                                    id="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            {/* Password Input */}
                            <div className="mb-4">
                                <label htmlFor="password" className="form-label">ENTER YOUR PASSWORD</label>
                                <input
                                    type="password"
                                    className="form-control"
                                    id="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            {/* Confirm Password Input */}
                            <div className="mb-4">
                                <label htmlFor="confirmPassword" className="form-label">CONFIRM PASSWORD</label>
                                <input
                                    type="password"
                                    className="form-control"
                                    id="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            {/* Address Input */}
                            <div className="mb-4">
                                <label htmlFor="address" className="form-label">ENTER YOUR ADDRESS</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            {/* Birthday Input */}
                            <div className="mb-4">
                                <label htmlFor="birthday" className="form-label">ENTER YOUR BIRTHDAY</label>
                                <input
                                    type="date"
                                    className="form-control"
                                    id="birthday"
                                    value={formData.birthday}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            {/* Register Button */}
                            <div className="d-grid">
                                <button type="submit" className="btn btn-lg mt-4" style={{ backgroundColor: "#eab676", color: "#FFF" }}>
                                    Register
                                </button>
                            </div>
                        </form>

                        {/* Login Link */}
                        <p className="text-center mt-4">
                            Already have an account?{' '}
                            <a href="/" className="fw-bold text-decoration-underline">Login here.</a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RegisterPage;

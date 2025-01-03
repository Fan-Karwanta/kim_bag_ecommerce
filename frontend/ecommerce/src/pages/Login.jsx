import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useUser } from '../context/UserContext'; // Import the useUser hook
import 'bootstrap/dist/css/bootstrap.min.css';
import logo from '../components/logo.png';

function LoginPage() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login, userEmail } = useUser(); // Get the login function from context

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const { email, password } = formData;

    // Check for admin credentials
    if (email === 'admin' && password === 'password') {
      navigate('/dashboard');
      return;
    }

    try {
      const response = await axios.post('http://localhost:8800/login', {
        email,
        password,
      });

      if (response.data.success) {
        login(email); // Use the login function from context to set the email globally
        console.log("userEmail:", userEmail); // Debug log for userEmail
        if (response.data.isAdmin) {
          navigate('/dashboard');
        } else {
          navigate('/marketplace');
        }
      } else {
        setError(response.data.message || 'Invalid credentials');
      }
    } catch (err) {
      console.error(err);
      setError('An error occurred during login.');
    }
  };

  return (
    <div className="container vh-100 d-flex align-items-center justify-content-center">
      <div className="row w-100">
        <div className="col-md-6 d-flex justify-content-center align-items-center">
          <img
            src={logo}
            alt="Bag Logo"
            className="img-fluid"
            style={{ maxWidth: '400px' }}
          />
        </div>

        <div className="col-md-6 d-flex justify-content-center align-items-center">
          <div className="p-5 rounded shadow bg-light" style={{ width: '100%', maxWidth: '500px' }}>
            <h3 className="fw-bold mb-3">Hey there!</h3>
            <p className="text-muted mb-4">Login to BareBags</p>

            {error && <div className="alert alert-danger">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="email" className="form-label">EMAIL</label>
                <input
                  type="text"
                  className="form-control form-control-md"
                  id="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-4">
                <label htmlFor="password" className="form-label">PASSWORD</label>
                <input
                  type="password"
                  className="form-control form-control-md"
                  id="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="d-grid">
                <button type="submit" className="btn btn-lg mt-4" style={{ backgroundColor: "#eab676", color: "#FFF" }}>
                  Login
                </button>
              </div>
            </form>

            <p className="text-center mt-4">
              Don't have an account?{' '}
              <a href="/register" className="fw-bold text-decoration-underline">Register here.</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;

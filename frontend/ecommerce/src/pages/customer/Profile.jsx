import React, { useState, useEffect } from 'react';
import { useUser } from '../../context/UserContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from "../../components/CustomerNavbar";

const Profile = () => {
  const { userEmail } = useUser();
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    birthday: '',
    address: ''
  });
  const [orders, setOrders] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({});
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeOrderId, setActiveOrderId] = useState(null);

  const openModal = (orderId) => {
    setActiveOrderId(orderId);
  };

  const closeModal = () => {
    setActiveOrderId(null);
  };


  const submitReview = async (orderId, bagId, idx) => {
    const rating = document.getElementById(`rating-${idx}`).value;
    const comment = document.getElementById(`comment-${idx}`).value;
  
    try {
      const response = await fetch('http://localhost:8800/submit_review', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId,
          bagId,
          rating,
          comment,
        }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to submit review');
      }
  
      const result = await response.json();
      alert('Review submitted successfully!');
    } catch (error) {
      alert('Error submitting review: ' + error.message);
    }
  };
  
  


  useEffect(() => {
    if (userEmail) {
      fetchUserData();
      fetchOrders();
    }
  }, [userEmail]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:8800/orders?email=${userEmail}`);
      const data = await response.json();
      
      if (data.success) {
        setOrders(data.data);
      } else {
        setError(data.message || 'Failed to fetch orders');
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      setError('Error loading orders');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserData = async () => {
    try {
      const response = await fetch(`http://localhost:8800/users?email=${userEmail}`);
      const data = await response.json();
      if (response.ok) {
        const formattedData = {
          ...data,
          birthday: data.birthday ? data.birthday.split('T')[0] : ''
        };
        setUserData(formattedData);
        setEditedData(formattedData);
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError('Error fetching user data');
      console.error('Error:', error);
    }
  };


  const handleEdit = () => {
    setIsEditing(true);
    setError('');
    setSuccess('');
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedData(userData);
    setError('');
    setSuccess('');
  };

  const handleChange = (e) => {
    setEditedData({
      ...editedData,
      [e.target.name]: e.target.value
    });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch('http://localhost:8800/users/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...editedData,
          email: userEmail
        })
      });

      const data = await response.json();
      if (response.ok) {
        setUserData(editedData);
        setIsEditing(false);
        setSuccess('Profile updated successfully!');
        setError('');
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError('Error updating profile');
      console.error('Error:', error);
    }
  };

  const handlePasswordSubmit = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    try {
      const response = await fetch('http://localhost:8800/users/password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: userEmail,
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        })
      });

      const data = await response.json();
      if (response.ok) {
        document.getElementById('passwordResetModal').querySelector('.btn-close').click();
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
        setSuccess('Password updated successfully!');
        setError('');
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError('Error updating password');
      console.error('Error:', error);
    }
  };

  return (
    <>
      <Navbar />
      <div className="container py-4">
        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}
        {success && (
          <div className="alert alert-success" role="alert">
            {success}
          </div>
        )}

        <div className="row">
          <div className="col-12">
            <h2 className="h3 mb-4">My Profile</h2>
            
            {/* Profile Information */}
            <div className="row mb-5">
              <div className="col-md-6">
                <div className="mb-4">
                  <label className="form-label mb-2">Name:</label>
                  <input
                    type="text"
                    className="form-control bg-secondary bg-opacity-25 border-0 py-2"
                    name="name"
                    value={isEditing ? editedData.name : userData.name}
                    onChange={handleChange}
                    disabled={!isEditing}
                  />
                </div>
                <div className="mb-4">
                  <label className="form-label mb-2">E-mail:</label>
                  <input
                    type="email"
                    className="form-control bg-secondary bg-opacity-25 border-0 py-2"
                    value={userData.email}
                    readOnly
                  />
                </div>
                <div className="mb-4">
                  <label className="form-label mb-2 ">Birthday:</label>
                  <input
                    type="date"
                    className="form-control bg-secondary bg-opacity-25 border-0 py-2"
                    name="birthday"
                    value={isEditing ? editedData.birthday : userData.birthday || ''}
                    onChange={handleChange}
                    disabled={!isEditing}
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="mb-4">
                  <label className="form-label mb-2">Address:</label>
                  <textarea
                    className="form-control bg-secondary bg-opacity-25 border-0 py-2"
                    name="address"
                    value={isEditing ? editedData.address : userData.address}
                    onChange={handleChange}
                    disabled={!isEditing}
                    rows="4"
                    style={{ resize: 'none' }}
                  />
                </div>
                <div className="mt-4">
                  {isEditing ? (
                    <>
                      <button className="btn btn-primary px-4 me-2" onClick={handleSubmit}>Save</button>
                      <button className="btn btn-secondary px-4" onClick={handleCancel}>Cancel</button>
                    </>
                  ) : (
                
                    <>
                      <button className="btn btn-secondary me-2 rounded-3 px-4" onClick={handleEdit}>
                        Edit Your Information
                      </button>
                      <button 
                        className="btn btn-secondary rounded-3 px-4" 
                        data-bs-toggle="modal" 
                        data-bs-target="#passwordResetModal"
                      >
                        Reset your Password
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Orders Section */}
            <h2 className="h3 mb-4">My Orders</h2>
            <div className="orders-section">
              {loading ? (
                <div className="text-center py-4">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : orders.length === 0 ? (
                <div className="alert alert-info">
                  You haven't placed any orders yet.
                </div>
              ) : (
                orders.map((order) => (
                  <div
                    key={order.orderId}
                    className="card mb-3 bg-secondary bg-opacity-25 border-0 rounded-3"
                  >
                    <div className="card-body py-4">
                      <div className="row">
                        <div className="col-md-4">
                          <p className="mb-2">
                            <strong>Order ID: #{order.orderId}</strong>
                          </p>
                          <p className="mb-2">
                            <strong>Total:</strong> ₱{order.totalPrice}
                          </p>
                          <p className="mb-2">
                            <strong>Purchases:</strong>
                          </p>
                          {order.purchases.map((bag, idx) => (
                            <p key={idx} className="mb-1">
                              • {bag}
                            </p>
                          ))}
                        </div>
                        <div className="col-md-5">
                          <p className="mb-2">
                            <strong>Shipping Address:</strong>
                          </p>
                          <p className="mb-0" style={{ lineHeight: '1.5' }}>
                            {order.address}
                          </p>
                        </div>
                        <div className="col-md-3 text-end">
                          <p className="mb-2">
                            <strong>Order Status:</strong>
                          </p>
                          <button
                            className={`btn ${
                              order.orderStatus === 'Pending'
                                ? 'btn-warning'
                                : 'btn-success'
                            } rounded-3`}
                          >
                            {order.orderStatus}
                          </button>
                          {order.orderStatus === 'Delivered' && (
                            <button
                              className="btn btn-primary rounded-3 ms-2"
                              onClick={() => openModal(order.orderId)}
                            >
                              Rate
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Modal for rating */}
                    {activeOrderId === order.orderId && (
                      <div
                        className="modal"
                        style={{
                          position: 'fixed',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          backgroundColor: 'rgba(0, 0, 0, 0.5)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <div
                          className="modal-content"
                          style={{
                            background: '#fff',
                            padding: '20px',
                            borderRadius: '8px',
                            width: '400px',
                          }}
                        >
                          <h2>Rate Order #{order.orderId}</h2>
                          <form className="mb-3" onSubmit={(e) => e.preventDefault()}>
                            {order.purchases.map((bag, idx) => (
                              <div key={idx} className="mb-4">
                                <p className="mb-1">
                                  <b>{bag}</b>
                                </p>

                                {/* Rating Input */}
                                <label htmlFor={`rating-${idx}`} className="form-label">
                                  Rate (1-5):
                                </label>
                                <input
                                  type="number"
                                  id={`rating-${idx}`}
                                  name={`rating-${idx}`}
                                  min="1"
                                  max="5"
                                  className="form-control"
                                  required
                                />

                                {/* Comment Input */}
                                <label htmlFor={`comment-${idx}`} className="form-label">
                                  Leave a Review:
                                </label>
                                <textarea
                                  id={`comment-${idx}`}
                                  name={`comment-${idx}`}
                                  rows="3"
                                  className="form-control"
                                  placeholder="Write your comment here..."
                                  required
                                ></textarea>

                                {/* Submit Button */}
                                <button
                                  type="button"
                                  className="btn btn-primary mt-2"
                                  onClick={() => submitReview(order.orderId, bag, idx)}
                                >
                                  Submit
                                </button>
                              </div>
                            ))}
                          </form>


                          <div className="modal-actions">
                            <button
                              className="btn btn-secondary rounded-3"
                              onClick={closeModal}
                            >
                              Close
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>


      {/* Password Reset Modal */}
      <div className="modal fade" id="passwordResetModal" tabIndex="-1">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Reset Password</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label mb-2">Current Password:</label>
                <input
                  type="password"
                  className="form-control"
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                />
              </div>
              <div className="mb-3">
                <label className="form-label mb-2">New Password:</label>
                <input
                  type="password"
                  className="form-control"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                />
              </div>
              <div className="mb-3">
                <label className="form-label mb-2">Confirm New Password:</label>
                <input
                  type="password"
                  className="form-control"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
              <button type="button" className="btn btn-primary" onClick={handlePasswordSubmit}>
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
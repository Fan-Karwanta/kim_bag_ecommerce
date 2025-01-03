import React from 'react';
import { Link } from "react-router-dom";
import axios from "axios";

// Function to handle the delete operation
const handleDelete = async (id) => {
  if (window.confirm("Are you sure you want to delete this bag?")) {
    try {
      const response = await axios.delete(`http://localhost:8800/bags_tbl/${id}`); // Replace with your API URL
      console.log(response.data); // Log success message from API
      alert("Bag deleted successfully!");
      window.location.reload(); // Refresh the page
    } catch (error) {
      console.error("Error deleting bag:", error);
      alert("Failed to delete the bag. Please try again.");
    }
  }
};

const AdminCardBag = ({ bag }) => {
  return (
    <div
      className="card shadow-sm p-3 mb-5 bg-white rounded"
      style={{
        width: '18rem',
        border: '2px solid #ccc', // Light gray border
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // Subtle shadow
      }}
    >
      {/* Image placeholder for bags covers */}
      <div
        className="d-flex justify-content-center align-items-center rounded bg-secondary mx-auto"
        style={{
          width: '100%',
          maxWidth: '240px',
          aspectRatio: '4 / 5',
          marginBottom: '1rem',
          overflow: 'hidden',
        }}
      >
        {bag.image && (
          <img
            src={bag.image.startsWith("http") ? bag.image : `http://localhost:8800${bag.image}`}
            alt={bag.prod_name}
            className="w-100 h-100 rounded"
            style={{
              objectFit: 'cover',
            }}
          />
        )}
      </div>

      {/* Card Body */}
      <div className="card-body">
        <h5 className="card-title d-flex justify-content-between">
          <span>{bag.prod_name || 'Bag Name'}</span>
          <span className="fw-bold">&#8369;{bag.price || 350}</span>
        </h5>
        <p className="card-text text-muted">
          {bag.prod_desc || 'lorem ipsum lorem ipsum lorem ipsum'}
        </p>
        <p className="mb-2">Stock No: {bag.stock}</p>

        {/* Buttons */}
        <div className="d-flex justify-content-between mt-2">
          <Link to={`/update_bag/${bag.id}`} className="text-white text-decoration-none">
            <button className="btn btn-primary btn-sm">Edit</button>
          </Link>
          <button
            className="btn btn-danger btn-sm"
            onClick={() => handleDelete(bag.id)} // Call the delete handler
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminCardBag;

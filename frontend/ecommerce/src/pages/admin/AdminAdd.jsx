import Navbar from "../../components/AdminNavbar";
import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const AdminAdd = () => {
  const [bags_tbl, setBags] = useState({
    prod_name: "",
    prod_desc: "",
    price: "",
    stock_no: "",
    image: "",
  });

  const [imageFile, setImageFile] = useState(null); // For uploading images
  const navigate = useNavigate();

  const handleAddBag = async (e) => {
    e.preventDefault();
    try {
      let imageUrl = "";

      // Upload the image if a file is selected
      if (imageFile) {
        const formData = new FormData();
        formData.append("image", imageFile);

        console.log("FormData:", imageFile); // Debug: Check file upload content

        const uploadRes = await axios.post("http://localhost:8800/upload", formData);
        imageUrl = uploadRes.data.imageUrl; // Server returns the image URL
      }

      // Prepare bag data
      const newBag = {
        prod_name: bags_tbl.prod_name,
        prod_desc: bags_tbl.prod_desc,
        price: bags_tbl.price,
        stock_no: bags_tbl.stock_no,
        image: imageUrl || bags_tbl.image, // Use uploaded image or fallback to URL input
      };

      // Send data to server
      await axios.post("http://localhost:8800/bags_tbl", newBag);
      alert("Bag added successfully!");
      navigate("/dashboard"); // Redirect back to homepage
    } catch (err) {
      console.error("Failed to add bag:", err);
      alert("Failed to add the bag. Please try again.");
    }
  };

  // Handles input changes and updates state
  const handleChange = (e) => {
    const { name, value } = e.target;
    setBags((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div>
      {/* Navbar */}
      <Navbar />

      {/* Form Container */}
      <div className="container mt-5">
        <h2 className="mb-5">Add a Bag</h2>
        <div className="row">
          {/* Form Section */}
          <div className="col-md-6">
            <form onSubmit={handleAddBag}>
              {/* Bag Name */}
              <div className="mb-3">
                <label className="form-label">Bag Name:</label>
                <input
                  type="text"
                  name="prod_name"
                  value={bags_tbl.prod_name}
                  onChange={handleChange}
                  className="form-control"
                  required
                />
              </div>

              {/* Bag Description */}
              <div className="mb-3">
                <label className="form-label">Bag Description:</label>
                <textarea
                  name="prod_desc"
                  value={bags_tbl.prod_desc}
                  onChange={handleChange}
                  className="form-control"
                  rows="3"
                  required
                ></textarea>
              </div>

              {/* Price and Stock */}
              <div className="row mb-3">
                <div className="col">
                  <label className="form-label">Price:</label>
                  <input
                    type="number"
                    name="price"
                    value={bags_tbl.price}
                    onChange={handleChange}
                    className="form-control"
                    required
                  />
                </div>
                <div className="col">
                  <label className="form-label">Stock No:</label>
                  <input
                    type="text"
                    name="stock_no"
                    value={bags_tbl.stock_no}
                    onChange={handleChange}
                    className="form-control"
                    required
                  />
                </div>
              </div>

              {/* Image Upload */}
              <div className="mb-3">
                <label className="form-label">Image Upload:</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files[0])}
                  className="form-control"
                />
              </div>

              {/* Optional Image URL */}
              <div className="mb-3">
                <label className="form-label">Image URL (optional):</label>
                <input
                  type="text"
                  name="image"
                  value={bags_tbl.image}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>

              {/* Submit Button */}
              <button type="submit" className="btn btn-primary mt-3">
                Add Bag
              </button>
            </form>
          </div>

          {/* Image Preview Placeholder */}
          <div className="col-md-6 d-flex justify-content-center align-items-center">
            {imageFile ? (
              <img
                src={URL.createObjectURL(imageFile)}
                alt="Preview"
                style={{
                  maxWidth: "100%",
                  maxHeight: "400px",
                  borderRadius: "10px",
                }}
              />
            ) : (
              <div
                style={{
                  width: "100%",
                  height: "400px",
                  backgroundColor: "#e0e0e0",
                  borderRadius: "10px",
                }}
              ></div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAdd;

import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Navbar from "../../components/AdminNavbar";
import "./AdminDashboard.css";
import AdminCardBag from "../../components/AdminCardBag";

const AdminDashboard = () => {
  const [bags_tbl, setBags] = useState([]); // State to hold fetched Bags

  useEffect(() => {
    const fetchAllBags = async () => {
      try {
        const res = await axios.get("http://localhost:8800/bags_tbl");
        console.log(res.data); // Log the fetched data
        setBags(res.data); // Update the state with fetched bags
      } catch (err) {
        console.log(err); 
      }
    };
    fetchAllBags();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8800/bags_tbl/${id}`);
      setBags(bags_tbl.filter((bag) => bag.id !== id)); // Update the state
      alert("Bag deleted successfully!");
    } catch (err) {
      console.error("Failed to delete the bag:", err);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="m-5">
        <div className="d-flex justify-content-between align-items-center mb-5">
          {/* TITLE */}
          <div className="h2 mb-0">Manage Your Bags</div>

          {/* ADD Bag BTN */}
          <button className="btn btn-primary">
            <Link to="/add_bag" className="text-white text-decoration-none">
              Add New Bag
            </Link>
          </button>
        </div>

        {/* CARDS CONTAINER */}
        <div className="row">
          {bags_tbl.map((bag) => (
            <div className="col-md-4 col-lg-3 mb-4" key={bag.id}>
              <AdminCardBag
                bag={bag}
                handleDelete={handleDelete}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

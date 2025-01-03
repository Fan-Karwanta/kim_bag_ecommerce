import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import logo from "./logo.png";

const Navbar = () => {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  return (
    <div className="position-relative">
      <nav
        className="navbar px-4 py-3"
        style={{
          backgroundColor: "#eab676",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        }}
      >
        <div className="container-fluid">
          {/* Empty div for spacing */}
          <div style={{ width: "40px" }}></div>

        {  /* Centered Logo and Text */}
                <div
                className="d-flex align-items-center justify-content-center"
                style={{ flex: 1 }}
                >
                <img
                  src={logo}
                  alt="Logo"
                  style={{
                  maxHeight: "40px",
                  marginRight: "10px",
                  }}
                />
                <span
                  className="navbar-brand mb-0 fs-4"
                  style={{ color: "#fff", fontWeight: "bold" }}
                >
                  BareBag
                </span>
                </div>

                {/* Hamburger Button */}
                <button
                className="navbar-toggler"
                type="button"
                aria-expanded={menuOpen}
                aria-label="Toggle navigation"
                onClick={() => setMenuOpen(!menuOpen)}
                style={{
                  backgroundColor: "#fff",
                  border: "none",
                  padding: "8px",
                  borderRadius: "5px",
                  width: "40px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                >
                <span className="navbar-toggler-icon"></span>
                </button>
              </div>
              </nav>

              {/* Dropdown Menu - Positioned absolutely */}
      {menuOpen && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            backgroundColor: "#f8d7a9",
            borderRadius: "8px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            zIndex: 1000,
            marginTop: "4px",
          }}
        >
          <ul
            className="navbar-nav text-center p-3"
            style={{ margin: 0, padding: 0, listStyleType: "none" }}
          >
            <li className="nav-item">
              <Link
                to="/dashboard"
                className={`nav-link ${isActive("/dashboard") ? "active" : ""}`}
                style={{
                  color: isActive("/dashboard") ? "#fff" : "#6c757d",
                  padding: "10px",
                  display: "block",
                  fontWeight: "bold",
                  borderRadius: "5px",
                }}
              >
                Inventory
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/orders"
                className={`nav-link ${isActive("/orders") ? "active" : ""}`}
                style={{
                  color: isActive("/orders") ? "#fff" : "#6c757d",
                  padding: "10px",
                  display: "block",
                  fontWeight: "bold",
                  borderRadius: "5px",
                }}
              >
                Manage Orders
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/"
                className={`nav-link ${isActive("/") ? "active" : ""}`}
                style={{
                  color: isActive("/") ? "#fff" : "#6c757d",
                  padding: "10px",
                  display: "block",
                  fontWeight: "bold",
                  borderRadius: "5px",
                }}
              >
                Logout
              </Link>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default Navbar;
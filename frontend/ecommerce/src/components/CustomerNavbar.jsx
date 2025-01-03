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
          {/* Spacer for left side */}
          <div style={{ width: "40px" }}></div>

          {/* Logo and Text - Always centered */}
          <div
            className="d-flex align-items-center justify-content-center"
            style={{
              position: "absolute",
              left: "50%",
              transform: "translateX(-50%)",
            }}
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

          {/* Hamburger Button - Fixed to right */}
          <button
            className="navbar-toggler ms-auto"
            type="button"
            aria-expanded={menuOpen}
            aria-label="Toggle navigation"
            onClick={() => setMenuOpen(!menuOpen)}
            style={{
              border: "none",
              padding: "8px",
              borderRadius: "5px",
              backgroundColor: "#fff",
              width: "40px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 1,
            }}
          >
            <span className="navbar-toggler-icon"></span>
          </button>
        </div>
      </nav>

      {/* Dropdown Menu */}
      {menuOpen && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            left: "50%",
            transform: "translateX(-50%)",
            width: "90%",
            maxWidth: "300px",
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
                to="/marketplace"
                className={`nav-link ${isActive("/marketplace") ? "active" : ""}`}
                style={{
                  color: "#6c757d",
                  padding: "10px",
                  display: "block",
                  fontWeight: "bold",
                  position: "relative",
                }}
              >
                Marketplace
                {isActive("/marketplace") && (
                  <div
                    style={{
                      position: "absolute",
                      bottom: "0",
                      left: 0,
                      right: 0,
                      height: "3px",
                      backgroundColor: "#6c757d",
                      borderRadius: "2px",
                    }}
                  ></div>
                )}
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/cart"
                className={`nav-link ${isActive("/cart") ? "active" : ""}`}
                style={{
                  color: "#6c757d",
                  padding: "10px",
                  display: "block",
                  fontWeight: "bold",
                  position: "relative",
                }}
              >
                Cart
                {isActive("/cart") && (
                  <div
                    style={{
                      position: "absolute",
                      bottom: "0",
                      left: 0,
                      right: 0,
                      height: "3px",
                      backgroundColor: "#6c757d",
                      borderRadius: "2px",
                    }}
                  ></div>
                )}
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/profile"
                className={`nav-link ${isActive("/profile") ? "active" : ""}`}
                style={{
                  color: "#6c757d",
                  padding: "10px",
                  display: "block",
                  fontWeight: "bold",
                  position: "relative",
                }}
              >
                Profile
                {isActive("/profile") && (
                  <div
                    style={{
                      position: "absolute",
                      bottom: "0",
                      left: 0,
                      right: 0,
                      height: "3px",
                      backgroundColor: "#6c757d",
                      borderRadius: "2px",
                    }}
                  ></div>
                )}
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/"
                className={`nav-link ${isActive("/") ? "active" : ""}`}
                style={{
                  color: "#6c757d",
                  padding: "10px",
                  display: "block",
                  fontWeight: "bold",
                  position: "relative",
                }}
              >
                Logout
                {isActive("/") && (
                  <div
                    style={{
                      position: "absolute",
                      bottom: "0",
                      left: 0,
                      right: 0,
                      height: "3px",
                      backgroundColor: "#6c757d",
                      borderRadius: "2px",
                    }}
                  ></div>
                )}
              </Link>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default Navbar;
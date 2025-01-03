import React from "react";
import { Link, useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import logo from "./logo.png";

const Navbar = () => {
  const location = useLocation();

  // Function to check if the current route is active
  const isActive = (path) => location.pathname === path;

  return (
    <nav
      className="navbar navbar-expand-lg px-4 py-3"
      style={{
        backgroundColor: "#eab676", // Original navbar color
        color: "#fff",
      }}
    >
      <div className="container-fluid">
        <div className="d-flex align-items-center">
          <img
            src={logo}
            alt="Logo"
            style={{
              maxHeight: "40px",
              marginRight: "15px",
            }}
          />
          <span
            className="navbar-brand fs-4"
            style={{ color: "#fff", fontWeight: "bold" }}
          >
            BareBag
          </span>
        </div>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link
                to="/marketplace"
                className={`nav-link ${
                  isActive("/marketplace") ? "active" : ""
                }`}
                style={{
                  color: "#fff",
                  position: "relative",
                  fontWeight: "bold",
                }}
              >
                Marketplace
                {isActive("/marketplace") && (
                  <div
                    style={{
                      position: "absolute",
                      bottom: "-5px",
                      left: 0,
                      right: 0,
                      height: "3px",
                      backgroundColor: "#fff", // White marker
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
                  color: "#fff",
                  position: "relative",
                  fontWeight: "bold",
                }}
              >
                Cart
                {isActive("/cart") && (
                  <div
                    style={{
                      position: "absolute",
                      bottom: "-5px",
                      left: 0,
                      right: 0,
                      height: "3px",
                      backgroundColor: "#fff", // White marker
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
                  color: "#fff",
                  position: "relative",
                  fontWeight: "bold",
                }}
              >
                Profile
                {isActive("/profile") && (
                  <div
                    style={{
                      position: "absolute",
                      bottom: "-5px",
                      left: 0,
                      right: 0,
                      height: "3px",
                      backgroundColor: "#fff", // White marker
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
                  color: "#fff",
                  position: "relative",
                  fontWeight: "bold",
                }}
              >
                Logout
                {isActive("/") && (
                  <div
                    style={{
                      position: "absolute",
                      bottom: "-5px",
                      left: 0,
                      right: 0,
                      height: "3px",
                      backgroundColor: "#fff", // White marker
                      borderRadius: "2px",
                    }}
                  ></div>
                )}
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

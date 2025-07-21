import React from "react";
import { Link } from "react-router-dom"; // React Router Link for navigation
import "./Navbar.css";
import { useNavigate } from "react-router-dom";

const NavBar = ({ setSearchQuery }) => {
      const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user"); 
    navigate("/login");
    };
  return (
    <nav className="navbar navbar-expand-md navbar-light bg-light">
      <div className="container-fluid">
        {/* Logo */}
        <h1 className="navbar-brand">
          <Link className="nav-link" to="/">
            Mini Blog
          </Link>
        </h1>

        {/* Toggler button for mobile view */}
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

        {/* Navbar links */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/">
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/blog">
                Blogs
              </Link>
            </li>
          </ul>

          {/* Search container */}
          <div className="search-container">
            <input
              type="text"
              placeholder="Tìm kiếm ........."
              className="search-input"
              onChange={(e) => setSearchQuery(e.target.value)} // Update search query here
            />
            <button className="search-btn">
              <i className="fas fa-search"></i>
            </button>
          </div>
        </div>
          {localStorage.getItem("user") && (
          <button className="btn-logout" onClick={handleLogout}>Logout</button>
        )}
      </div>
    </nav>
  );
};

export default NavBar;

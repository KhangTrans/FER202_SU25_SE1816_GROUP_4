import React from 'react'
import './Navbar.css';
const NavBar = () => {
  return (
    <div className="navbar">
      <h1 className="logo">Mini Blog</h1>
      <div className="search-container">
        <input type="text" placeholder="Tìm kiếm ........." className="search-input" />
        <button className="search-btn">
          <i className="fas fa-search"></i>
        </button>
      </div>
    </div>
  )
}

export default NavBar

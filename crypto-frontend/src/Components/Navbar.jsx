import React from "react";
import { Link } from "react-router-dom";
import "../styles/components/navbar.css";

function Navbar() {
  return (
    <nav className="navbar">

      <div className="logo">
        CryptoTrack
      </div>

      <div className="nav-links">
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/portfolio">Portfolio</Link>
        <Link to="/exchange">Exchange</Link>
        <Link to="/trade">Trade</Link>
      </div>

    </nav>
  );
}

export default Navbar;
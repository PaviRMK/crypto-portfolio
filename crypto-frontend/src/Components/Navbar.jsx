import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Notifications from "./Notifications"; // ✅ IMPORT THIS
import "../styles/components/navbar.css";

function Navbar() {

  const [showNotifications, setShowNotifications] = useState(false);
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    const storedAlerts = JSON.parse(localStorage.getItem("alerts")) || [];
    setAlerts(storedAlerts);
  }, []);

  const totalAlerts = alerts.length;

  return (

    <nav className="navbar">

      {/* LEFT */}
      <div className="logo">CryptoTrack</div>

      {/* RIGHT SIDE */}
      <div className="nav-right">

        <div className="nav-links">
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/portfolio">Portfolio</Link>
          <Link to="/exchange">Exchange</Link>
          <Link to="/trade">Trade</Link>
        </div>

        {/* 🔔 NOTIFICATION ICON */}
        <div className="notification-wrapper">

          <div
            className="notification-icon"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            🔔

            {totalAlerts > 0 && (
              <span className="notification-badge">
                {totalAlerts}
              </span>
            )}
          </div>

          {/* ✅ USE COMPONENT INSTEAD OF INLINE UI */}
          {showNotifications && (
            <Notifications
              notifications={alerts.map(a => ({
                asset: a.assetSymbol,
                message: `${a.assetSymbol} - ${a.message}`,
                type: a.severity === "CRITICAL" ? "scam" : "risk"
              }))}
              onClose={() => setShowNotifications(false)}
            />
          )}

        </div>

      </div>

    </nav>
  );
}

export default Navbar;
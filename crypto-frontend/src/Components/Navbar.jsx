import React, { useState } from "react";
import { Link } from "react-router-dom";
import Notifications from "./Notifications";
import "../styles/components/navbar.css";

function Navbar({ alerts = [] }) {

  const [showNotifications, setShowNotifications] = useState(false);

  const totalAlerts = alerts.length;

  return (
    <nav className="navbar">

      <div className="logo">CryptoTrack</div>

      <div className="nav-right">

        <div className="nav-links">
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/portfolio">Portfolio</Link>
          <Link to="/exchange">Exchange</Link>
          <Link to="/trade">Trade</Link>
        </div>

        <div className="notification-wrapper">

          <div
            className="notification-icon"
            onClick={() => setShowNotifications(prev => !prev)}
          >
            🔔

            {totalAlerts > 0 && (
              <span className="notification-badge">
                {totalAlerts}
              </span>
            )}
          </div>

          {showNotifications && (
            <Notifications
              notifications={alerts}
              onClose={() => setShowNotifications(false)}
            />
          )}

        </div>

      </div>

    </nav>
  );
}

export default Navbar;
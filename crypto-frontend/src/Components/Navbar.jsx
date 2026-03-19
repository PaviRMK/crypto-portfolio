import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../styles/components/navbar.css";

function Navbar() {

  const [showPanel, setShowPanel] = useState(false);
  const [alerts, setAlerts] = useState([]);

  /* LOAD ALERTS FROM LOCAL STORAGE */

  useEffect(() => {
    const storedAlerts = JSON.parse(localStorage.getItem("alerts")) || [];
    setAlerts(storedAlerts);
  }, []);

  /* CLOSE PANEL WHEN CLICK OUTSIDE */

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(".notification-wrapper")) {
        setShowPanel(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <nav className="navbar">

      {/* LOGO */}
      <div className="logo">
        CryptoTrack
      </div>

      {/* NAV LINKS */}
      <div className="nav-links">
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/portfolio">Portfolio</Link>
        <Link to="/exchange">Exchange</Link>
        <Link to="/trade">Trade</Link>
      </div>

      {/* 🔔 NOTIFICATION */}
      <div className="notification-wrapper">

        {/* ICON */}
        <div
          className="notification-icon"
          onClick={() => setShowPanel(!showPanel)}
        >
          🔔

          {alerts.length > 0 && (
            <span className="notification-badge">
              {alerts.length}
            </span>
          )}
        </div>

        {/* PANEL */}
        {showPanel && (
          <div className="notification-panel">

            <h4>Notifications</h4>

            {alerts.length === 0 ? (
              <p className="empty-text">No alerts</p>
            ) : (

              <>

                {/* 🚨 SCAM ALERTS */}
                {alerts.filter(a => a.severity === "CRITICAL").length > 0 && (
                  <>
                    <div className="alert-group-title">🚨 Scam Alerts</div>

                    {alerts
                      .filter(a => a.severity === "CRITICAL")
                      .map((alert, i) => (
                        <div key={i} className="alert-item critical">
                          {alert.assetSymbol} - {alert.message}
                        </div>
                      ))}
                  </>
                )}

                {/* ⚠ RISK ALERTS */}
                {alerts.filter(a => a.severity === "HIGH").length > 0 && (
                  <>
                    <div className="alert-group-title">⚠ Risk Alerts</div>

                    {alerts
                      .filter(a => a.severity === "HIGH")
                      .map((alert, i) => (
                        <div key={i} className="alert-item high">
                          {alert.assetSymbol} - {alert.message}
                        </div>
                      ))}
                  </>
                )}

                {/* 📉 LOW ALERTS */}
                {alerts.filter(a => a.severity === "LOW").length > 0 && (
                  <>
                    <div className="alert-group-title">📉 Info</div>

                    {alerts
                      .filter(a => a.severity === "LOW")
                      .map((alert, i) => (
                        <div key={i} className="alert-item low">
                          {alert.assetSymbol} - {alert.message}
                        </div>
                      ))}
                  </>
                )}

              </>

            )}

          </div>
        )}

      </div>

    </nav>
  );
}

export default Navbar;
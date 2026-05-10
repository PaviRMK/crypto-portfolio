import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Notifications from "./Notifications";
import { logoutUser } from "../services/authApi";
import { useUser } from "../contexts/UserContext";
import "../styles/components/navbar.css";

const formatCurrency = (value) => {
  const numberValue = Number(value ?? 0);
  return `$${numberValue.toFixed(2)}`;
};

function Navbar({
  alerts = [],
  portfolioSnapshot = {}
}) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileMenuRef = useRef(null);
  const navigate = useNavigate();
  const { user, loading: userLoading, error: userError } = useUser();

  const totalAlerts = alerts.length;

  console.log("[Navbar] User state:", { user, userLoading, userError });

  const displayName = user?.name || (userLoading ? "Loading..." : "User");
  const displayEmail = user?.email || (userLoading ? "loading..." : "No email");
  const avatarInitial = displayName && !displayName.includes("Loading") 
    ? displayName.charAt(0).toUpperCase() 
    : "•";

  const totalValue = formatCurrency(portfolioSnapshot?.totalValue);
  const totalPnl = Number(portfolioSnapshot?.totalPnl ?? 0);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (!profileMenuRef.current?.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const closeProfileMenu = () => {
    setShowProfileMenu(false);
  };

  const handleNavigate = (path) => {
    closeProfileMenu();
    navigate(path);
  };

  const handleLogout = () => {
    logoutUser();
    closeProfileMenu();
    setShowNotifications(false);
    navigate("/login");
  };

  const menuItems = [
    {
      label: "Profile",
      className: "dropdown-item",
      action: () => handleNavigate("/profile")
    },
    {
      label: "Settings",
      className: "dropdown-item",
      action: () => handleNavigate("/settings")
    },
    {
      label: "Logout",
      className: "dropdown-item logout",
      action: handleLogout
    }
  ];

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
            onClick={() => setShowNotifications((prev) => !prev)}
            role="button"
            aria-label="Toggle notifications panel"
            aria-expanded={showNotifications}
          >
            🔔

            {totalAlerts > 0 && (
              <span className="notification-badge">
                {totalAlerts}
              </span>
            )}
          </div>

          <Notifications
            notifications={alerts}
            isOpen={showNotifications}
            onClose={() => setShowNotifications(false)}
          />
        </div>

        <div className="profile-wrapper" ref={profileMenuRef}>
          <button
            className={`profile-avatar ${userLoading ? "loading" : ""}`}
            onClick={() => setShowProfileMenu((prev) => !prev)}
            aria-label="Open user menu"
            aria-expanded={showProfileMenu}
          >
            {avatarInitial}
          </button>

          <div className={`dropdown ${showProfileMenu ? "open" : ""}`}>
            <div className="dropdown-user">
              <p className={`dropdown-name ${userLoading ? "skeleton" : ""}`}>
                {displayName}
              </p>
              <p className={`dropdown-email ${userLoading ? "skeleton" : ""}`}>
                {displayEmail}
              </p>
              {userError && (
                <p className="dropdown-error">{userError}</p>
              )}
            </div>

            <div className="dropdown-divider" />

            <div className="dropdown-summary">
              <div className="summary-line">
                <span>Total Value</span>
                <strong>{totalValue}</strong>
              </div>
              <div className="summary-line">
                <span>Profit</span>
                <strong className={totalPnl >= 0 ? "profit-positive" : "profit-negative"}>
                  {formatCurrency(totalPnl)}
                </strong>
              </div>
            </div>

            <div className="dropdown-divider" />

            {menuItems.map((item) => (
              <button
                key={item.label}
                className={item.className}
                onClick={item.action}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
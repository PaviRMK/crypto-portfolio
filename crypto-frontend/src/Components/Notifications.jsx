import React, { useState } from "react";
import "../styles/components/notifications.css";

const getTimeAgo = () => {
  return "Just now"; // you can enhance later
};

const getIcon = (type) => {
  if (type === "scam") return "🚨";
  if (type === "risk") return "⚠";
  return "📉";
};

const getBorderColor = (type) => {
  if (type === "scam") return "red";
  if (type === "risk") return "yellow";
  return "orange";
};

const groupAlerts = (notifications) => {
  const grouped = {};

  notifications.forEach((n) => {
    const key = n.asset || "Market";
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(n);
  });

  return grouped;
};

const Notifications = ({ notifications, onClose }) => {

  const [visibleAlerts, setVisibleAlerts] = useState(notifications);

  const grouped = groupAlerts(visibleAlerts);

  const handleDismiss = (index) => {
    setVisibleAlerts(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="notification-panel">

      {/* HEADER */}
      <div className="notification-header">
        <h3>🔔 Risk & Market Alerts</h3>
        <button onClick={onClose}>✖</button>
      </div>

      {/* GROUPED ALERTS */}
      {Object.keys(grouped).map((group, gIndex) => (
        <div key={gIndex} className="notification-group">

          <h4 className="group-title">
            {group} Alerts ({grouped[group].length})
          </h4>

          {grouped[group].map((alert, index) => {

            const type =
              alert.type ||
              (alert.message?.includes("Scam") ? "scam" :
               alert.message?.includes("High") ? "risk" : "price");

            return (
              <div
                key={index}
                className={`notification-item unread`}
                style={{
                  borderLeft: `4px solid ${getBorderColor(type)}`
                }}
              >

                <div className="notif-content">

                  <span className="notif-icon">
                    {getIcon(type)}
                  </span>

                  <div className="notif-text">
                    <p>{alert.message}</p>
                    <span>{getTimeAgo()}</span>
                  </div>

                </div>

                {/* ACTIONS */}
                <div className="notif-actions">
                  <button>View</button>
                  <button onClick={() => handleDismiss(index)}>
                    Dismiss
                  </button>
                </div>

              </div>
            );
          })}

        </div>
      ))}

    </div>
  );
};

export default Notifications;
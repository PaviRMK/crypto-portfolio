import React, { useState, useEffect } from "react";
import "../styles/components/notifications.css";

const getTimeAgo = () => "Just now";

const getIcon = (severity) => {
  if (severity === "CRITICAL") return "🚨";
  if (severity === "HIGH") return "⚠️";
  return "📉";
};

const getBorderColor = (severity) => {
  if (severity === "CRITICAL") return "red";
  if (severity === "HIGH") return "orange";
  return "yellow";
};

const formatMessage = (message, assetSymbol) => {
  if (!message) return "";

  let msg = String(message).trim();
  const symbol = (assetSymbol || "").trim();

  msg = msg.replace(/^[^A-Za-z0-9]+/, "").trim();

  if (symbol) {
    msg = msg.replace(`in ${symbol}`, "").trim();
  }

  return msg;
};

const groupAlerts = (alerts) => {
  const grouped = {};
  alerts.forEach((a) => {
    const key = a.assetSymbol || "Market";
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(a);
  });
  return grouped;
};

const Notifications = ({ notifications = [], onClose }) => {

  const [visibleAlerts, setVisibleAlerts] = useState([]);

  // 🔥 THIS IS THE FIX
  useEffect(() => {
    setVisibleAlerts(notifications);
  }, [notifications]);

  const grouped = groupAlerts(visibleAlerts);

  const handleDismiss = (alertToDismiss) => {
    setVisibleAlerts((prev) =>
      prev.filter((a) => a !== alertToDismiss)
    );
  };

  return (
    <div className="notification-panel">

      <div className="notification-header">
        <h3>🔔 Risk & Market Alerts</h3>
        <button onClick={onClose}>✖</button>
      </div>

      {visibleAlerts.length === 0 && (
        <p className="empty-text">No alerts available</p>
      )}

      {Object.keys(grouped).map((group, gIndex) => (
        <div key={gIndex} className="notification-group">

          <h4 className="group-title">
            {group} Alerts ({grouped[group].length})
          </h4>

          {grouped[group].map((alert, index) => {

            const cleanMsg = formatMessage(
              alert.message,
              alert.assetSymbol
            );

            const severity = (alert.severity || "")
              .toString()
              .toUpperCase();

            return (
              <div
                key={index}
                className="notification-item unread"
                style={{
                  borderLeft: `4px solid ${getBorderColor(severity)}`
                }}
              >

                <div className="notif-content">

                  <span className="notif-icon">
                    {getIcon(severity)}
                  </span>

                  <div className="notif-text">

                    <p>
                      <strong>{alert.assetSymbol || "Market"}</strong> → {cleanMsg}
                      {severity && ` (${severity})`}
                    </p>

                    <span>{getTimeAgo()}</span>
                  </div>

                </div>

                <div className="notif-actions">
                  <button onClick={() => handleDismiss(alert)}>
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
import React, { useEffect, useState } from "react";
import { getRiskAlerts } from "../services/portfolioApi";
import "../styles/components/riskAlert.css";

const RiskAlert = () => {

  const [riskAlerts, setRiskAlerts] = useState([]);
  const userId = 1;

  useEffect(() => {
    const loadAlerts = async () => {
      try {
        const data = await getRiskAlerts(userId);
        setRiskAlerts(data);
      } catch (error) {
        console.error("Failed to load risk alerts", error);
      }
    };

    loadAlerts();
  }, []);

  const severityColor = (severity) => {
    switch (severity) {
      case "CRITICAL": return "critical";
      case "HIGH": return "high";
      case "MEDIUM": return "medium";
      case "LOW": return "low";
      default: return "";
    }
  };

  if (riskAlerts.length === 0) {
    return <p className="no-alert">No risk alerts detected.</p>;
  }

  return (
    <div className="risk-alert-container">

      {riskAlerts.map((alert, index) => (
        <div className="risk-card" key={index}>

          <div className="risk-header">
            <span className="coin">{alert.assetSymbol}</span>

            <span className={`severity-badge ${severityColor(alert.severity)}`}>
              {alert.severity}
            </span>
          </div>

          <p className="risk-message">{alert.message}</p>

          <div className="risk-progress">
            <div className={`progress-bar ${severityColor(alert.severity)}`}></div>
          </div>

        </div>
      ))}

    </div>
  );
};

export default RiskAlert;
import React, { useEffect, useState } from "react";
import { getRiskAlerts } from "../services/portfolioApi";
import "../styles/components/riskAlert.css";

const RiskAlert = ({ userId }) => {

  const [alerts, setAlerts] = useState([]);

  useEffect(() => {

    const fetchAlerts = async () => {
      try {

        const data = await getRiskAlerts(userId);
        setAlerts(data);

      } catch (error) {

        console.error("Risk alert fetch failed", error);

      }
    };

    fetchAlerts();

  }, [userId]); // IMPORTANT

  if (!alerts || alerts.length === 0) {
    return (
      <div className="risk-container">
        <h3>⚠ Portfolio Risk Alerts</h3>
        <p className="no-alert">No risk alerts detected</p>
      </div>
    );
  }

  return (

    <div className="risk-container">

      <h3>⚠ Portfolio Risk Alerts</h3>

      <div className="risk-alert-container">

        {alerts.map((alert,index)=>(
          <div className="risk-card" key={index}>

            <div className="risk-header">
              <span>{alert.assetSymbol}</span>

              <span className={`severity-badge ${alert.severity.toLowerCase()}`}>
                {alert.severity}
              </span>
            </div>

            <p className="risk-message">
              {alert.message}
            </p>

          </div>
        ))}

      </div>

    </div>
  );

};

export default RiskAlert;
import React from "react";

const PortfolioRiskCard = ({ alerts }) => {

  if (!alerts || alerts.length === 0) {
    return null;
  }

  const mainAlert = alerts[0];

  const severity = mainAlert.severity.toLowerCase();

  const riskWidth = {
    low: "35%",
    medium: "60%",
    high: "85%",
    critical: "100%"
  };

  return (
    <div className="portfolio-risk-card">

      <div className="risk-top">

        <h3>Overall Portfolio Risk</h3>

        <span className={`risk-badge ${severity}`}>
          {mainAlert.severity}
        </span>

      </div>

      <p className="risk-description">
        {mainAlert.message}
      </p>

      <div className="risk-bar-container">

        <div
          className={`risk-bar ${severity}`}
          style={{ width: riskWidth[severity] }}
        ></div>

      </div>

    </div>
  );
};

export default PortfolioRiskCard;
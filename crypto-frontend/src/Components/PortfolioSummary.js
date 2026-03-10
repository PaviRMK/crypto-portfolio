import React from "react";

const PortfolioSummary = ({ summary }) => {

  if (!summary) return null;

  return (
    <div className="summary-grid">

      <div className="summary-card">
        <h4>Total Investment</h4>
        <p>${Number(summary.totalInvestment).toLocaleString()}</p>
      </div>

      <div className="summary-card">
        <h4>Current Value</h4>
        <p>${Number(summary.currentValue).toLocaleString()}</p>
      </div>

      <div className="summary-card">
        <h4>Total PnL</h4>
        <p className={summary.totalPnl > 0 ? "green" : "red"}>
          ${Number(summary.totalPnl).toLocaleString()}
        </p>
      </div>

    </div>
  );
};

export default PortfolioSummary;
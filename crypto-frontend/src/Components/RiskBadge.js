import React from "react";

const RiskBadge = ({ risk }) => {

  if (!risk) return null;

  const isHigh = risk.toUpperCase().includes("HIGH");

  return (
    <div className="risk-container">
      <span className={`badge ${isHigh ? "red" : "green"}`}>
        {risk}
      </span>
    </div>
  );
};

export default RiskBadge;
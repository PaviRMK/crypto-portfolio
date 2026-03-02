import React from "react";

const RiskBadge = ({ risk }) => {

  if (!risk) return null;

  const isHigh = risk.toUpperCase().includes("HIGH");

  return (
    <div style={{ marginBottom: "20px" }}>
      <span
        style={{
          padding: "8px 16px",
          borderRadius: "20px",
          fontWeight: "600",
          background: isHigh ? "#ef4444" : "#22c55e",
          color: "white"
        }}
      >
        {risk}
      </span>
    </div>
  );
};

export default RiskBadge;
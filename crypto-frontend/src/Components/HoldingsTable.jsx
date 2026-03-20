import React, { useState } from "react";

const HoldingsTable = ({ holdings, alerts = [] }) => {

  const [expandedIndex, setExpandedIndex] = useState(null);

  if (!holdings || holdings.length === 0) {
    return (
      <div className="portfolio-section">
        <h3>Holdings</h3>
        <p className="empty-text">No holdings available.</p>
      </div>
    );
  }

  const getStatus = (holding) => {
    const assetAlerts = alerts.filter(
      (a) => a.assetSymbol === holding.assetSymbol
    );

    const scamAlert = assetAlerts.find(
      (a) => a.severity === "CRITICAL"
    );

    if (scamAlert) {
      return {
        label: "SCAM",
        type: "scam",
        reason: scamAlert.message,
        suggestion: "Avoid completely 🚫"
      };
    }

    const risk = holding.riskLevel?.toLowerCase();

    if (risk === "high") {
      return {
        label: "HIGH",
        type: "high",
        reason: "High volatility or concentration",
        suggestion: "Reduce exposure"
      };
    }

    if (risk === "medium") {
      return {
        label: "MEDIUM",
        type: "medium",
        reason: "Moderate risk",
        suggestion: "Monitor closely"
      };
    }

    if (risk === "low") {
      return {
        label: "LOW",
        type: "low",
        reason: "Stable asset",
        suggestion: "Safe to hold"
      };
    }

    return {
      label: "NOT CHECKED",
      type: "unknown",
      reason: "No data available",
      suggestion: "-"
    };
  };

  return (
    <div className="portfolio-section">

      <h3>Holdings</h3>

      <table className="portfolio-table">

        <thead>
          <tr>
            <th>Asset</th>
            <th>Risk & Scam</th>
            <th>Quantity</th>
            <th className="text-right">Average Cost</th>
            <th className="text-right">Live Price</th>
            <th className="text-right">Current Value</th>
            <th className="text-right">Profit & Loss</th>
          </tr>
        </thead>

        <tbody>

          {holdings.map((holding, index) => {

            const pnl = Number(holding.pnl ?? holding.unrealizedPnl ?? 0);
            const status = getStatus(holding);

            const isOpen = expandedIndex === index;

            return (
              <React.Fragment key={index}>

                {/* MAIN ROW */}
                <tr
                  onClick={() =>
                    setExpandedIndex(isOpen ? null : index)
                  }
                  style={{ cursor: "pointer" }}
                >

                  <td>{holding.assetSymbol}</td>

                  <td>
                    <span className={`badge ${status.type}`}>
                      {status.label}
                    </span>
                  </td>

                  <td>
                    {Number(holding.quantity).toLocaleString()}
                  </td>

                  <td className="text-right">
                    ${Number(holding.avgCost).toLocaleString()}
                  </td>

                  <td className="text-right">
                    ${Number(holding.livePrice).toLocaleString()}
                  </td>

                  <td className="text-right">
                    ${Number(holding.currentValue).toLocaleString()}
                  </td>

                  <td
                    className={
                      pnl >= 0
                        ? "pnl-positive text-right"
                        : "pnl-negative text-right"
                    }
                  >
                    ${pnl.toLocaleString()}
                  </td>

                </tr>

                {/* 🔥 EXPANDED ROW */}
                {isOpen && (
                  <tr className="expanded-row">
                    <td colSpan="7">

                      <div className="expanded-content">

                        <div className="expanded-header">
                          <span className={`badge ${status.type}`}>
                            {status.label}
                          </span>
                        </div>

                        <p>
                          <strong>Reason:</strong> {status.reason}
                        </p>

                        <p className="suggestion">
                          <strong>Suggestion:</strong> {status.suggestion}
                        </p>

                      </div>

                    </td>
                  </tr>
                )}

              </React.Fragment>
            );
          })}

        </tbody>

      </table>

    </div>
  );
};

export default HoldingsTable;
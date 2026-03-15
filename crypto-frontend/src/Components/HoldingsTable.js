import React from "react";

const HoldingsTable = ({ holdings }) => {

  if (!holdings || holdings.length === 0) {
    return (
      <div className="portfolio-section">
        <h3>Holdings</h3>
        <p className="empty-text">No holdings available.</p>
      </div>
    );
  }

  return (

    <div className="portfolio-section">

      <h3>Holdings</h3>

      <table className="portfolio-table">

        <thead>
          <tr>
            <th>Asset</th>
            <th>Risk</th>
            <th>Quantity</th>
            <th>Avg Cost</th>
            <th>Live Price</th>
            <th>Current Value</th>
            <th>Unrealized PnL</th>
          </tr>
        </thead>

        <tbody>

          {holdings.map((holding, index) => {

            const riskLevel = holding.riskLevel || "LOW";

            return (

              <tr key={index}>

                {/* Asset */}
                <td className="asset-name">
                  {holding.assetSymbol}
                </td>

                {/* Risk */}
                <td>
                  <span className={`risk-badge ${riskLevel.toLowerCase()}`}>
                    {riskLevel}
                  </span>
                </td>

                {/* Quantity */}
                <td>
                  {Number(holding.quantity).toLocaleString()}
                </td>

                {/* Avg Cost */}
                <td>
                  ${Number(holding.avgCost).toLocaleString()}
                </td>

                {/* Live Price */}
                <td>
                  ${Number(holding.livePrice).toLocaleString()}
                </td>

                {/* Current Value */}
                <td>
                  ${Number(holding.currentValue).toLocaleString()}
                </td>

                {/* PnL */}
                <td className={holding.unrealizedPnl >= 0 ? "green" : "red"}>
                  ${Number(holding.unrealizedPnl).toLocaleString()}
                </td>

              </tr>

            );

          })}

        </tbody>

      </table>

    </div>

  );

};

export default HoldingsTable;
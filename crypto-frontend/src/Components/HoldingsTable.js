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
            <th>Quantity</th>
            <th>Avg Cost</th>
            <th>Live Price</th>
            <th>Current Value</th>
            <th>Unrealized PnL</th>
          </tr>
        </thead>

        <tbody>
          {holdings.map((holding, index) => (
            <tr key={index}>
              <td className="asset-cell">
                {holding.assetSymbol}
              </td>

              <td>
                {Number(holding.quantity).toLocaleString()}
              </td>

              <td>
                ${Number(holding.avgCost).toLocaleString()}
              </td>

              <td>
                ${Number(holding.livePrice).toLocaleString()}
              </td>

              <td>
                ${Number(holding.currentValue).toLocaleString()}
              </td>

              <td className={holding.unrealizedPnl >= 0 ? "green" : "red"}>
                ${Number(holding.unrealizedPnl).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default HoldingsTable;
import React from "react";

const HoldingsTable = ({ holdings }) => {

  if (!holdings || holdings.length === 0) {
    return (
      <div className="portfolio-section">
        <h3>Holdings</h3>
        <p style={{ color: "#94a3b8" }}>No holdings available.</p>
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
          </tr>
        </thead>

        <tbody>
          {holdings.map((item, index) => (
            <tr key={index}>
              <td style={{ fontWeight: 600 }}>
                {item.assetSymbol}
              </td>

              <td>
                {Number(item.quantity).toLocaleString()}
              </td>

              <td>
                ${Number(item.avgCost).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default HoldingsTable;
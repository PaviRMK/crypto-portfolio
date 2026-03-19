import React from "react";
import "../styles/components/exchange.css";

const ExchangeTable = ({ exchanges = [] }) => {

  // Show message instead of returning null
  if (exchanges.length === 0) {
    return (
      <div className="exchange-container card">
        <h3 className="exchange-title">Top Exchanges</h3>
        <p style={{ opacity: 0.7 }}>No exchange data available.</p>
      </div>
    );
  }

  return (
    <div className="exchange-container card">
      <h3 className="exchange-title">Top Exchanges</h3>

      <table className="exchange-table">
        <thead>
          <tr>
            <th>Exchange</th>
            <th>Pair</th>
            <th>Last Price</th>
            <th>Volume</th>
            <th>Trust</th>
          </tr>
        </thead>

        <tbody>
          {exchanges.slice(0, 5).map((ex, index) => (
            <tr key={index}>
              <td>{ex.exchangeName}</td>
              <td>{ex.pair}</td>
              <td>
                ${ex.lastPrice ? ex.lastPrice.toLocaleString() : "-"}
              </td>
              <td>
                ${ex.volume ? ex.volume.toLocaleString() : "-"}
              </td>
              <td>
                <span className={`trust ${ex.trustScore?.toLowerCase()}`}>
                  {ex.trustScore || "N/A"}
                </span>
              </td>
            </tr>
          ))}
        </tbody>

      </table>
    </div>
  );
};

export default ExchangeTable;
import React from "react";
import "../styles/components/exchange.css";

const ExchangeTable = ({ exchanges }) => {
  if (!exchanges || exchanges.length === 0) return null;

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
              <td>${ex.lastPrice.toLocaleString()}</td>
              <td>${ex.volume.toLocaleString()}</td>
              <td>
                <span className={`trust ${ex.trustScore}`}>
                  {ex.trustScore}
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
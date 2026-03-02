import React from "react";

const TradesTable = ({ trades }) => {

  if (!trades || trades.length === 0) {
    return (
      <div className="portfolio-section">
        <h3>Trade History</h3>
        <p style={{ color: "#94a3b8" }}>No trades found.</p>
      </div>
    );
  }

  return (
    <div className="portfolio-section">
      <h3>Trade History</h3>

      <table className="portfolio-table">
        <thead>
          <tr>
            <th>Asset</th>
            <th>Side</th>
            <th>Quantity</th>
            <th>Price</th>
            <th>Fee</th>
            <th>Realized PnL</th>
            <th>Date</th>
          </tr>
        </thead>

        <tbody>
          {trades.map((trade, index) => (
            <tr key={index}>
              
              <td style={{ fontWeight: 600 }}>
                {trade.assetSymbol}
              </td>

              <td className={trade.side === "BUY" ? "green" : "red"}>
                {trade.side}
              </td>

              <td>
                {Number(trade.quantity).toLocaleString()}
              </td>

              <td>
                ${Number(trade.price).toLocaleString()}
              </td>

              <td>
                ${Number(trade.fee).toLocaleString()}
              </td>

              <td className={trade.realizedPnl > 0 ? "green" : "red"}>
                ${Number(trade.realizedPnl).toLocaleString()}
              </td>

              <td>
                {new Date(trade.executedAt).toLocaleDateString("en-IN", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric"
                })}{" "}
                {new Date(trade.executedAt).toLocaleTimeString("en-IN", {
                  hour: "2-digit",
                  minute: "2-digit"
                })}
              </td>

            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TradesTable;
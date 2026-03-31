import React from "react";
import "../styles/components/tradesTable.css";

const TradesTable = ({ trades }) => {

  if (!trades || trades.length === 0) {

    return <p className="empty-text">No trades available</p>;

  }

  return (

    <table className="trades-table">

      <thead>

        <tr>

          <th>Symbol</th>
          <th>Side</th>
          <th>Price</th>
          <th>Quantity</th>
          <th>Date</th>

        </tr>

      </thead>

      <tbody>

        {trades.map((trade, index) => {

          return (

            <tr key={index}>

              <td>{trade.symbol}</td>

              <td className={trade.side === "BUY" ? "buy-text" : "sell-text"}>
                {trade.side}
              </td>

              <td>${Number(trade.price).toFixed(2)}</td>

              <td>{Number(trade.quantity).toFixed(2)}</td>

              <td>
                {new Date(trade.executedAt).toLocaleString()}
              </td>

            </tr>

          );

        })}

      </tbody>

    </table>

  );

};

export default TradesTable;
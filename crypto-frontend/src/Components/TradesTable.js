import React, { useState } from "react";

const TradesTable = ({ trades }) => {

  const tradesPerPage = 6;
  const [currentPage, setCurrentPage] = useState(1);

  if (!trades || trades.length === 0) {
    return (
      <div className="portfolio-section">
        <h3>Trade History</h3>
        <p>No trades found.</p>
      </div>
    );
  }

  const totalPages = Math.ceil(trades.length / tradesPerPage);

  const indexOfLastTrade = currentPage * tradesPerPage;
  const indexOfFirstTrade = indexOfLastTrade - tradesPerPage;

  const currentTrades = trades.slice(indexOfFirstTrade, indexOfLastTrade);

  const goToPage = (page) => {
    setCurrentPage(page);
  };

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
          {currentTrades.map((trade, index) => (
            <tr key={index}>
              <td>{trade.assetSymbol}</td>

              <td className={trade.side === "BUY" ? "green" : "red"}>
                {trade.side}
              </td>

              <td>{trade.quantity}</td>

              <td>${trade.price}</td>

              <td>${trade.fee}</td>

              <td className={trade.realizedPnl > 0 ? "green" : "red"}>
                ${trade.realizedPnl}
              </td>

              <td>
                {new Date(trade.executedAt).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}

      <div className="pagination">

        <span className="pagination-info">
          Showing {indexOfFirstTrade + 1} -{" "}
          {Math.min(indexOfLastTrade, trades.length)} of {trades.length} trades
        </span>

        <div className="pagination-buttons">

          <button
            disabled={currentPage === 1}
            onClick={() => goToPage(currentPage - 1)}
          >
            Prev
          </button>

          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index}
              className={currentPage === index + 1 ? "active-page" : ""}
              onClick={() => goToPage(index + 1)}
            >
              {index + 1}
            </button>
          ))}

          <button
            disabled={currentPage === totalPages}
            onClick={() => goToPage(currentPage + 1)}
          >
            Next
          </button>

        </div>
      </div>

    </div>
  );
};

export default TradesTable;
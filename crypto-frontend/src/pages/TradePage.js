import React, { useState, useEffect } from "react";
import { placeOrder, getTrades } from "../services/tradeApi";
import TradesTable from "../Components/TradesTable";
import "../styles/pages/trade.css";

const TradePage = () => {

  const userId = 1;

  const [symbol, setSymbol] = useState("BTC");
  const [quantity, setQuantity] = useState("");
  const [trades, setTrades] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const tradesPerPage = 10;

  /* ================= LOAD TRADES ================= */

  const loadTrades = async () => {

    try {

      const data = await getTrades(userId);

      setTrades(data);

    } catch (error) {

      console.error("Failed to fetch trades", error);

      setTrades([]);

    }

  };

  useEffect(() => {

    loadTrades();

  }, []);

  /* ================= PLACE ORDER ================= */

  const submitOrder = async (side) => {

    if (!quantity) {

      alert("Enter quantity");

      return;

    }

    try {

      await placeOrder(userId, {
        assetSymbol: symbol,
        side,
        quantity: Number(quantity)
      });

      setQuantity("");

      loadTrades();

    } catch (error) {

      console.error("Trade failed", error);

      alert("Order failed");

    }

  };

  /* ================= PAGINATION ================= */
const indexOfLastTrade = currentPage * tradesPerPage;
const indexOfFirstTrade = indexOfLastTrade - tradesPerPage;

const currentTrades = trades.slice(indexOfFirstTrade, indexOfLastTrade);

const totalPages = Math.ceil(trades.length / tradesPerPage);
const totalTrades = trades.length;

  /* ================= UI ================= */

  return (

    <div className="trade-page">

      <h1>Trading Panel</h1>

      {/* Trading Panel */}

      <div className="trade-panel">

        <select
          value={symbol}
          onChange={(e) => setSymbol(e.target.value)}
        >

          <option>BTC</option>
          <option>ETH</option>
          <option>SOL</option>
          <option>BNB</option>
          <option>XRP</option>
          <option>ADA</option>
          <option>DOGE</option>
          <option>MATIC</option>
          <option>DOT</option>
          <option>AVAX</option>

        </select>

        <input
          type="number"
          min="0.0001"
          step="0.0001"
          placeholder="Enter quantity"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
        />

        <button
          className="buy-btn"
          onClick={() => submitOrder("BUY")}
        >
          BUY
        </button>

        <button
          className="sell-btn"
          onClick={() => submitOrder("SELL")}
        >
          SELL
        </button>

      </div>

      {/* Trade History */}

      <div className="trade-history-card">

        <h2>Trade History</h2>

        <TradesTable trades={currentTrades} />

        {/* Pagination */}

        <div className="table-pagination">

          <div className="pagination-info">
            Showing {(currentPage - 1) * tradesPerPage + 1} –
            {Math.min(currentPage * tradesPerPage, totalTrades)} of {totalTrades} trades
          </div>

          <div className="pagination-controls">

            <button
              className="page-btn"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              Prev
            </button>

            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index}
                className={`page-number ${currentPage === index + 1 ? "active-page" : ""}`}
                onClick={() => setCurrentPage(index + 1)}
              >
                {index + 1}
              </button>
            ))}

            <button
              className="page-btn"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              Next
            </button>

          </div>

        </div>

      </div>

    </div>

  );

};

export default TradePage;
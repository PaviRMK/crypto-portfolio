import React, { useState } from "react";
import ConnectExchangeForm from "../Components/ConnectExchangeForm";
import SyncPortfolioButton from "../Components/SyncPortfolioButton";
import { useNavigate } from "react-router-dom";
import "../styles/pages/exchangePage.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const ExchangePage = () => {

  const navigate = useNavigate();

  const [connected, setConnected] = useState(false);

  /* ================= AFTER CONNECT ================= */

  const handleConnected = () => {
    setConnected(true);
  };

  /* ================= AFTER SYNC ================= */

  const handleSynced = () => {

    console.log("Portfolio synced successfully");

    // redirect to portfolio page
    navigate("/portfolio");

  };

  return (
  <div className="exchange-page">

    <h1>Exchange Integration</h1>

    <div className="exchange-grid">

      <ConnectExchangeForm onConnected={handleConnected} />

      <div className="connected-card">

        <h2>Connected Exchanges</h2>

        {connected ? (

          <div className="exchange-box">

            <div className="exchange-header">
              <span className="exchange-name">🟡 Binance</span>
              <span className="status">Connected</span>
            </div>

            <div className="exchange-actions">

              <SyncPortfolioButton
                exchangeId={1}
                onSynced={handleSynced}
              />

              <button className="disconnect-btn">
                Disconnect
              </button>

            </div>

            <p className="sync-time">
              Last Sync: Just now
            </p>

          </div>

        ) : (

          <p className="empty-text">
            No exchange connected yet
          </p>

        )}

      </div>

    </div>

    {/* IMPORTANT: Toast container */}

    <ToastContainer
      position="top-right"
      autoClose={4000}
      newestOnTop
      closeOnClick
      pauseOnHover
      theme="dark"
    />

  </div>
);
};

export default ExchangePage;
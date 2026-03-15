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

    navigate("/portfolio");

  };

  return (

    <div className="exchange-page">

      <h1>Exchange Integration</h1>

      <div className="exchange-grid">

        {/* LEFT CARD (CONNECT FORM) */}
        <ConnectExchangeForm onConnected={handleConnected} />

        {/* RIGHT CARD (CONNECTED EXCHANGE) */}
        <div className="connected-card">

          <h2>Connected Exchanges</h2>

          {connected ? (

            <div className="exchange-box">

              {/* HEADER */}
              <div className="exchange-header">

                <div className="exchange-info">
                  <span className="exchange-dot"></span>
                  <span className="exchange-name">Binance</span>
                </div>

                <span className="status connected">
                  Connected
                </span>

              </div>

              {/* ACTION BUTTONS */}
              <div className="exchange-actions">

                <SyncPortfolioButton
                  className="sync-btn"
                  exchangeId={1}
                  onSynced={handleSynced}
                />

                <button className="disconnect-btn">
                  Disconnect
                </button>

              </div>

              {/* SYNC TIME */}
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
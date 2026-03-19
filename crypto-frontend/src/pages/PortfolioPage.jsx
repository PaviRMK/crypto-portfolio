import React, { useEffect, useState, useCallback } from "react";
import {
  getPortfolioSummary,
  getHoldingsLive,
  getRiskAlerts
} from "../services/portfolioApi";

import PortfolioSummary from "../Components/PortfolioSummary";
import HoldingsTable from "../Components/HoldingsTable";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "../styles/pages/portfolio.css";

/* Toast Close Button */

const ToastCloseButton = ({ closeToast }) => (
  <button className="toast-close-btn" onClick={closeToast}>
    ✕
  </button>
);

const PortfolioPage = () => {

  const userId = localStorage.getItem("userId") || 1;

  const [summary, setSummary] = useState(null);
  const [holdings, setHoldings] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ================= LOAD DATA ================= */

  const loadPortfolioData = useCallback(async () => {

    try {

      const summaryData = await getPortfolioSummary(userId);
      const holdingsData = await getHoldingsLive(userId);
      const alertsData = await getRiskAlerts(userId);

      setSummary(summaryData);
      setHoldings(holdingsData);
      setAlerts(alertsData || []);

      /* 🔔 STORE ALERTS FOR NAVBAR PANEL */
      localStorage.setItem("alerts", JSON.stringify(alertsData || []));

    } catch (error) {

      console.error("Portfolio API error", error);

    } finally {

      setLoading(false);

    }

  }, [userId]);

  /* ================= AUTO REFRESH ================= */

  useEffect(() => {

    loadPortfolioData();

    const interval = setInterval(() => {
      loadPortfolioData();
    }, 30000); // 30 sec

    return () => clearInterval(interval);

  }, [loadPortfolioData]);

  /* ================= TOAST (ONLY SCAM) ================= */

  useEffect(() => {

    if (!alerts || alerts.length === 0) return;

    alerts.forEach(alert => {

      const toastId = alert.assetSymbol + alert.message;

      /* 🚨 ONLY SHOW TOAST FOR CRITICAL */
      if (alert.severity === "CRITICAL") {

        toast.error(
          `🚨 Scam Alert: ${alert.assetSymbol} is flagged as malicious`,
          {
            toastId,
            className: "toast-scam",
            autoClose: false
          }
        );

      }

    });

  }, [alerts]);

  /* ================= LOADING ================= */

  if (loading) {
    return <div className="loader">Loading Portfolio...</div>;
  }

  /* ================= UI ================= */

  return (

    <div className="portfolio-page">

      <PortfolioSummary summary={summary} />

      <HoldingsTable holdings={holdings} />

      {/* Toast only for scam alerts */}

      <ToastContainer
        position="top-right"
        autoClose={4000}
        newestOnTop
        closeOnClick
        pauseOnHover
        theme="dark"
        closeButton={ToastCloseButton}
        limit={3}
        hideProgressBar={true}
        style={{ marginTop: "60px" }}
      />

    </div>

  );

};

export default PortfolioPage;
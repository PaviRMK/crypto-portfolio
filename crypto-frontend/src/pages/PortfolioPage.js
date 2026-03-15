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

  /* LOAD PORTFOLIO DATA */

  const loadPortfolioData = useCallback(async () => {

    try {

      const summaryData = await getPortfolioSummary(userId);
      const holdingsData = await getHoldingsLive(userId);
      const alertsData = await getRiskAlerts(userId);

      setSummary(summaryData);
      setHoldings(holdingsData);
      setAlerts(alertsData || []);

    } catch (error) {

      console.error("Portfolio API error", error);

    } finally {

      setLoading(false);

    }

  }, [userId]);

  /* FETCH DATA ON PAGE LOAD */

  useEffect(() => {
    loadPortfolioData();
  }, [loadPortfolioData]);

  /* SHOW TOAST NOTIFICATIONS */

  useEffect(() => {

    if (alerts.length > 0) {

      alerts.forEach(alert => {

        toast.warning(alert.message, {
          toastId: alert.message
        });

      });

    }

  }, [alerts]);

  /* LOADING SCREEN */

  if (loading) {
    return <div className="loader">Loading Portfolio...</div>;
  }

  return (

    <div className="portfolio-page">

      <PortfolioSummary summary={summary} />

      <HoldingsTable holdings={holdings} />

      <ToastContainer
        position="top-right"
        autoClose={4000}
        newestOnTop
        closeOnClick
        pauseOnHover
        theme="dark"
        closeButton={ToastCloseButton}
        style={{ marginTop: "60px" }}
      />

    </div>

  );

};

export default PortfolioPage;
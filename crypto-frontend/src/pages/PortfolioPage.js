import React, { useEffect, useState } from "react";
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

const ToastCloseButton = ({ closeToast }) => (
  <button className="toast-close-btn" onClick={closeToast}>✕</button>
);

const PortfolioPage = () => {

  const userId = localStorage.getItem("userId") || 1;

  const [summary, setSummary] = useState(null);
  const [holdings, setHoldings] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadPortfolioData = async () => {

    try {

      const summaryData = await getPortfolioSummary(userId);
      const holdingsData = await getHoldingsLive(userId);
      const alertsData = await getRiskAlerts(userId);

      setSummary(summaryData);
      setHoldings(holdingsData);
      setAlerts(alertsData || []);

      if (alertsData?.length > 0) {
        alertsData.forEach(alert => {
          toast.warning(alert.message);
        });
      }

    } catch (error) {

      console.error("Portfolio API error", error);

    } finally {

      setLoading(false);

    }

  };

  useEffect(() => {
    loadPortfolioData();
  }, []);

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
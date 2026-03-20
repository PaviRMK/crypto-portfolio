import React, { useEffect, useState, useCallback } from "react";
import {
  getPortfolioSummary,
  getHoldingsLive,
  getRiskAlerts,
  getPnlSummary,
  exportPortfolio,
  getTaxHint
} from "../services/portfolioApi";

import PortfolioSummary from "../Components/PortfolioSummary";
import HoldingsTable from "../Components/HoldingsTable";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "../styles/pages/portfolio.css";

const PortfolioPage = () => {

  const userId = localStorage.getItem("userId") || 1;

  const [summary, setSummary] = useState(null);
  const [holdings, setHoldings] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [pnl, setPnl] = useState(null);
  const [taxHint, setTaxHint] = useState("");
  const [loading, setLoading] = useState(true);


  /* ================= LOAD DATA ================= */

  const loadPortfolioData = useCallback(async () => {
    try {
      const [
        summaryData,
        holdingsData,
        alertsData,
        pnlData,
        taxData
      ] = await Promise.all([
        getPortfolioSummary(userId),
        getHoldingsLive(userId),
        getRiskAlerts(userId),
        getPnlSummary(userId),
        getTaxHint(userId)
      ]);

      setSummary(summaryData);
      setHoldings(holdingsData);
      setAlerts(alertsData || []);
      setPnl(pnlData);
      setTaxHint(taxData);

      localStorage.setItem("alerts", JSON.stringify(alertsData || []));

    } catch (error) {
      console.error("Portfolio error:", error);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  /* ================= AUTO REFRESH ================= */

  useEffect(() => {
    loadPortfolioData();
    const interval = setInterval(loadPortfolioData, 30000);
    return () => clearInterval(interval);
  }, [loadPortfolioData]);

  /* ================= SCAM ALERT TOAST ================= */

  useEffect(() => {
    const scam = alerts.find((a) => a.severity === "CRITICAL");

    if (scam) {
      toast.error(`${scam.assetSymbol} is flagged as a SCAM token`, {
        toastId: `scam-${scam.assetSymbol}`
      });
    }
  }, [alerts]);

  /* ================= EXPORT ================= */

  const handleExport = async () => {
    try {
      const blob = await exportPortfolio(userId);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "portfolio.csv";
      a.click();
    } catch (error) {
      console.error("Export failed", error);
    }
  };

  if (loading) return <div className="loader">Loading...</div>;

  return (
    <div className="portfolio-page">

      <PortfolioSummary summary={summary} />

      {pnl && (
        <div className="pnl-grid">
          <div className="pnl-card green">
            Realized Profit & Loss <br />
            ${pnl.realizedPnl?.toFixed(2)}
          </div>
          <div className="pnl-card yellow">
            Unrealized Profit & Loss <br />
            ${pnl.unrealizedPnl?.toFixed(2)}
          </div>
        </div>
      )}

      {taxHint && (
        <div className="tax-hint">
          💡 {taxHint}
        </div>
      )}

      <button className="export-btn" onClick={handleExport}>
        Export Portfolio CSV
      </button>

      {/* HOLDINGS */}
      <HoldingsTable holdings={holdings} alerts={alerts} />

   
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

export default PortfolioPage;
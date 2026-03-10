import React, { useEffect, useState, useCallback } from "react";
import API from "../api";
import PortfolioSummary from "../Components/PortfolioSummary";
import HoldingsTable from "../Components/HoldingsTable";
import TradesTable from "../Components/TradesTable";
import RiskBadge from "../Components/RiskBadge";
import TradeForm from "../Components/TradeForm";
import { useNavigate } from "react-router-dom";
import "../styles/pages/portfolio.css";

const PortfolioPage = () => {

  const userId = 1;
  const navigate = useNavigate();

  const [summary, setSummary] = useState(null);
  const [holdings, setHoldings] = useState([]);
  const [trades, setTrades] = useState([]);
  const [risk, setRisk] = useState(null);
  const [loading, setLoading] = useState(true);

  /* ================= FETCH FUNCTIONS ================= */

  const fetchSummary = async () => {
    const res = await API.get(
      `/portfolio/summary?userId=${userId}`
    );
    setSummary(res.data);
  };

  const fetchHoldings = async () => {
    const res = await API.get(
      `/portfolio/holdings-live?userId=${userId}`
    );
    setHoldings(res.data);
  };

  const fetchTrades = async () => {
    const res = await API.get(
      `/portfolio/trades?userId=${userId}`
    );
    setTrades(res.data);
  };

  const fetchRisk = async () => {
    const res = await API.get(
      `/portfolio/risk?userId=${userId}`
    );
    setRisk(res.data);
  };

  /* ================= REFRESH ALL ================= */

  const refreshAllData = useCallback(async () => {
    await fetchSummary();
    await fetchHoldings();
    await fetchTrades();
    await fetchRisk();
  }, []);

  /* ================= INITIAL LOAD ================= */

  useEffect(() => {
    const loadData = async () => {
      await refreshAllData();
      setLoading(false);
    };

    loadData();
  }, [refreshAllData]);

  if (loading) {
    return <div className="loader">Loading Portfolio...</div>;
  }

  return (
    <div className="portfolio-page">

      <div className="portfolio-header">
        <h2 className="portfolio-title">Portfolio Overview</h2>

        <button
          className="back-btn"
          onClick={() => navigate("/dashboard")}
        >
          ← Back to Dashboard
        </button>
      </div>

      <PortfolioSummary summary={summary} />
      <RiskBadge risk={risk} />
      <HoldingsTable holdings={holdings} />
      <TradesTable trades={trades} />

      <TradeForm onTradeSuccess={refreshAllData} />

    </div>
  );
};

export default PortfolioPage;
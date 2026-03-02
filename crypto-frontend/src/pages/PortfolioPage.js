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

  /* =========================
     SYMBOL → COINGECKO ID MAP
  ========================= */

  const symbolToId = {
    BTC: "bitcoin",
    ETH: "ethereum",
    XRP: "ripple",
    USDT: "tether"
  };

  /* =========================
     FETCH HOLDINGS + CALCULATE SUMMARY
  ========================= */

  const fetchHoldings = async () => {
    const res = await API.get(`/portfolio/holdings?userId=${userId}`);
    const holdingsData = res.data;

    setHoldings(holdingsData);

    await calculatePortfolioSummary(holdingsData);
  };

  const calculatePortfolioSummary = async (holdingsData) => {

    if (!holdingsData || holdingsData.length === 0) {
      setSummary({
        totalInvestment: 0,
        currentValue: 0,
        totalPnl: 0
      });
      return;
    }

    let totalInvestment = 0;
    let currentValue = 0;

    const coinIds = holdingsData
      .map(h => symbolToId[h.assetSymbol])
      .filter(Boolean)
      .join(",");

    if (!coinIds) return;

    const priceRes = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${coinIds}&vs_currencies=usd`
    );

    const prices = await priceRes.json();

    holdingsData.forEach(h => {

      const coinId = symbolToId[h.assetSymbol];
      const livePrice = prices[coinId]?.usd || 0;

      const investment = h.quantity * h.avgCost;
      const value = h.quantity * livePrice;

      totalInvestment += investment;
      currentValue += value;
    });

    const totalPnl = currentValue - totalInvestment;

    setSummary({
      totalInvestment,
      currentValue,
      totalPnl
    });
  };

  /* =========================
     OTHER FETCH FUNCTIONS
  ========================= */

  const fetchTrades = async () => {
    const res = await API.get(`/portfolio/trades?userId=${userId}`);
    setTrades(res.data);
  };

  const fetchRisk = async () => {
    const res = await API.get(`/portfolio/risk?userId=${userId}`);
    setRisk(res.data);
  };

  /* =========================
     REFRESH ALL DATA
  ========================= */

  const refreshAllData = useCallback(async () => {
    await fetchHoldings();   // 🔥 recalculates summary
    await fetchTrades();
    await fetchRisk();
  }, []);

  /* =========================
     INITIAL LOAD
  ========================= */

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
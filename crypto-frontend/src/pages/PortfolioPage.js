import React, { useEffect, useState, useCallback } from "react";
import {
  getPortfolioSummary,
  getHoldingsLive,
  getRiskAlerts
} from "../services/portfolioApi";

import PortfolioSummary from "../Components/PortfolioSummary";
import HoldingsTable from "../Components/HoldingsTable";
import RiskAlert from "../Components/RiskAlert";

import "../styles/pages/portfolio.css";

const PortfolioPage = () => {

  const userId = 1;

  const [summary, setSummary] = useState(null);
  const [holdings, setHoldings] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSummary = async () => {
    const data = await getPortfolioSummary(userId);
    setSummary(data);
  };

  const fetchHoldings = async () => {
    const data = await getHoldingsLive(userId);
    setHoldings(data);
  };

  const fetchAlerts = async () => {
    const data = await getRiskAlerts(userId);
    setAlerts(data);
  };

  const refreshAllData = useCallback(async () => {
    await fetchSummary();
    await fetchHoldings();
    await fetchAlerts();
  }, []);

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

      <PortfolioSummary summary={summary} />

      <RiskAlert alerts={alerts} />

      <HoldingsTable holdings={holdings} />

    </div>
  );
};

export default PortfolioPage;
import API from "../api";

/* ==========================
   PORTFOLIO SUMMARY
========================== */

export const getPortfolioSummary = async (userId) => {

  const response = await API.get(
    `/portfolio/summary?userId=${userId}`
  );

  return response.data;
};

/* ==========================
   LIVE HOLDINGS
========================== */

export const getHoldingsLive = async (userId) => {
  const response = await API.get("/portfolio/holdings-live", {
    params: { userId }
  });

  return response.data;
};

/* ==========================
   RISK ALERTS
========================== */

export const getRiskAlerts = async (userId) => {

  const response = await API.get("/portfolio/risk-alerts", {
    params: { userId }
  });

  return response.data;
};
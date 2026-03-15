import API from "../api";

/*
==========================
COMMON SAFE REQUEST
==========================
*/

const safeRequest = async (requestFn, fallback) => {
  try {
    const response = await requestFn();
    return response.data;
  } catch (error) {
    console.error("API Error:", error);
    return fallback;
  }
};

/*
==========================
PORTFOLIO SUMMARY
==========================
*/

export const getPortfolioSummary = async (userId) => {

  return safeRequest(
    () =>
      API.get("/portfolio/summary", {
        params: { userId }
      }),
    null
  );

};


/*
==========================
LIVE HOLDINGS
==========================
*/

export const getHoldingsLive = async (userId) => {

  return safeRequest(
    () =>
      API.get("/portfolio/holdings-live", {
        params: { userId }
      }),
    []
  );

};


/*
==========================
RISK ALERTS
==========================
*/

export const getRiskAlerts = async (userId) => {

  return safeRequest(
    () =>
      API.get("/portfolio/risk-alerts", {
        params: { userId }
      }),
    []
  );

};
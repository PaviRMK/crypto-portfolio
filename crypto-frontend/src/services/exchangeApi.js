import API from "../api";

/* =====================
   CONNECT EXCHANGE
===================== */

export const connectExchange = async (data) => {
  const response = await API.post("/exchange/connect", data);
  return response.data;
};

/* =====================
   SYNC PORTFOLIO
===================== */

export const syncExchangePortfolio = async (userId, exchangeId) => {
  const response = await API.get(`/exchange/sync?userId=${userId}&exchangeId=${exchangeId}`);
  return response.data;
};
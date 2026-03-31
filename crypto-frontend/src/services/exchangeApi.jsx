import API from "../api";

/* =====================
   CONNECT EXCHANGE
===================== */
export const connectExchange = async (exchange, apiKey, secretKey) => {

  const exchangeMap = {
    Binance: 1,
    Bybit: 2,
    Coinbase: 3
  };

  const userId = localStorage.getItem("userId") || 1;

  const payload = {
    userId: Number(userId),
    exchangeId: exchangeMap[exchange],
    apiKey,
    secret: secretKey
  };

  const response = await API.post("/exchange/connect", payload);
  return response.data;
};

/* =====================
   SYNC TRADES
===================== */
export const syncTrades = async (userId, exchangeId) => {

  const response = await API.get("/exchange/sync-trades", {
    params: { userId, exchangeId }
  });

  return response.data;
};
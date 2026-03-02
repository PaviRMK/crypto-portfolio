import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8080/api"
});

// AUTH APIs
export const loginUser = (data) => {
  return API.post("/auth/login", data);
};

export const registerUser = (data) => {
  return API.post("/auth/register", data);
};

// CRYPTO APIs
export const getTopCoins = (currency, perPage) => {
  return API.get("/crypto/top-coins", {
    params: { currency, perPage }
  });
};

export const getChartData = (coinId, currency, days) => {
  return API.get("/crypto/chart", {
    params: { coinId, currency, days }
  });
};

export const getPortfolioSummary = (userId) =>
  API.get(`/portfolio/summary?userId=${userId}`);

export const getHoldings = (userId) =>
  API.get(`/portfolio/holdings?userId=${userId}`);

export const getTrades = (userId) =>
  API.get(`/portfolio/trades?userId=${userId}`);

export const getRisk = (userId) =>
  API.get(`/portfolio/risk?userId=${userId}`);

export const createTrade = (userId, data) =>
  API.post(`/portfolio/trade?userId=${userId}`, data);

export default API;

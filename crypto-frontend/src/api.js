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

export default API;

import API from "../api";

/* TOP COINS */

export const getTopCoins = async (currency, perPage) => {
  const response = await API.get("/crypto/top-coins", {
    params: { currency, perPage }
  });

  return response.data?.data || response.data || [];
};

/* CHART DATA */

export const getChartData = async (coinId, currency, days) => {
  const response = await API.get("/crypto/chart", {
    params: { coinId, currency, days }
  });
  return response.data;
};
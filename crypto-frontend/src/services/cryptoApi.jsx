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
    console.log("RAW API response:", response);         // 👈 full response
  console.log("response.data:", response.data);       // 👈 data object
  console.log("prices:", response.data?.prices);      // 👈 prices array

  return response.data?.prices || response.data || [];
};
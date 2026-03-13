import API from "../api";

/* =========================
   PLACE BUY / SELL ORDER
========================= */

export const placeOrder = async (userId, orderData) => {

  const response = await API.post(
    `/trades/order?userId=${userId}`,
    orderData
  );

  return response.data;

};


/* =========================
   GET TRADE HISTORY
========================= */

export const getTrades = async (userId) => {

  const response = await API.get(
    `/portfolio/trades?userId=${userId}`
  );

  return response.data;

};
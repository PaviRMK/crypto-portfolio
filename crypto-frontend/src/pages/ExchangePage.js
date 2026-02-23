import React, { useEffect, useState } from "react";
import { getTopCoins } from "../api";
import API from "../api";
import ExchangeTable from "../Components/ExchangeTable";
import { useNavigate } from "react-router-dom";
import "../styles/pages/dashboard.css";

const ExchangePage = () => {
  const [coins, setCoins] = useState([]);
  const [exchangeMap, setExchangeMap] = useState({});
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch top 5 coins only
        const coinRes = await getTopCoins("usd", 5);
        const topCoins = coinRes.data;
        setCoins(topCoins);

        const exchangeDataObj = {};

        // For each coin fetch exchange
        for (let coin of topCoins) {
          const res = await API.get(
            `/crypto/exchange?coinId=${coin.id}`
          );
          exchangeDataObj[coin.id] = res.data;
        }

        setExchangeMap(exchangeDataObj);

      } catch (error) {
        console.error("Exchange Page Error:", error);
      }

      setLoading(false);
    };

    fetchData();
  }, []);

  return (
    <div className="dashboard-wrapper">

      <div className="dashboard-header">
        <h2>Top 5 Coins – Exchange Details</h2>
        <button
          className="logout-btn"
          onClick={() => navigate("/dashboard")}
        >
          Back
        </button>
      </div>

      {loading ? (
        <div className="loader">Loading Exchange Details...</div>
      ) : (
        coins.map((coin) => (
          <div key={coin.id} className="table-card">
            <h3 style={{ marginBottom: "20px" }}>
              {coin.name}
            </h3>
            <ExchangeTable exchanges={exchangeMap[coin.id]} />
          </div>
        ))
      )}

    </div>
  );
};

export default ExchangePage;
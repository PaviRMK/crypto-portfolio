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
        // 1️⃣ Fetch top 5 coins
        const coinRes = await getTopCoins("usd", 5);
        const topCoins = coinRes.data;
        setCoins(topCoins);

        // 2️⃣ Fetch exchange data for all coins in parallel
        const exchangePromises = topCoins.map((coin) =>
          API.get(`/crypto/exchange?coinId=${coin.id}`)
        );

        const exchangeResponses = await Promise.all(exchangePromises);

        // 3️⃣ Build exchange map
        const exchangeDataObj = {};
        topCoins.forEach((coin, index) => {
          exchangeDataObj[coin.id] = exchangeResponses[index].data;
        });

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

      {/* Header */}
      <div className="dashboard-header">
        <h2>Top 5 Coins – Exchange Details</h2>
        <button
          className="logout-btn"
          onClick={() => navigate("/dashboard")}
        >
          Back
        </button>
      </div>

      {/* Loading */}
      {loading ? (
        <div className="loader">Loading Exchange Details...</div>
      ) : (
        coins.map((coin) => (
          <div key={coin.id} className="table-card">
            <h3 style={{ marginBottom: "20px" }}>
              {coin.name}
            </h3>

            {/* 👇 Safe fallback added here */}
            <ExchangeTable exchanges={exchangeMap[coin.id] || []} />
          </div>
        ))
      )}

    </div>
  );
};

export default ExchangePage;
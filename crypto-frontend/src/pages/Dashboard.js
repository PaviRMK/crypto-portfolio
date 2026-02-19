import React, { useEffect, useState } from "react";
import { getTopCoins, getChartData } from "../api";
import FilterBar from "../Components/FilterBar";
import CryptoTable from "../Components/CryptoTable";
import CryptoChart from "../Components/CryptoChart";
import "../styles/pages/dashboard.css";


const Dashboard = () => {
  const [coins, setCoins] = useState([]);
  const [selectedCoin, setSelectedCoin] = useState("bitcoin");
  const [chartData, setChartData] = useState([]);
  const [currency, setCurrency] = useState("usd");
  const [perPage, setPerPage] = useState(10);
  const [days, setDays] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCoins();
  }, [currency, perPage]);

  useEffect(() => {
    fetchChart();
  }, [selectedCoin, currency, days]);

  const fetchCoins = async () => {
    setLoading(true);
    try {
      const res = await getTopCoins(currency, perPage);
      setCoins(res.data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const fetchChart = async () => {
    try {
      const res = await getChartData(selectedCoin, currency, days);
      setChartData(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
  <div className="dashboard-wrapper">

    <div className="dashboard-header">
      <h2>Crypto Market Dashboard</h2>
      <button className="logout-btn">Logout</button>
    </div>

    <div className="filter-card">
      <FilterBar
        setCurrency={setCurrency}
        setPerPage={setPerPage}
        setDays={setDays}
      />
    </div>

    <div className="chart-card">
      <CryptoChart chartData={chartData} />
    </div>

    <div className="table-card">
      {loading ? (
        <div className="loader">Loading...</div>
      ) : (
        <CryptoTable
          coins={coins}
          setSelectedCoin={setSelectedCoin}
          currency={currency}
        />
      )}
    </div>

  </div>
);



};

export default Dashboard;

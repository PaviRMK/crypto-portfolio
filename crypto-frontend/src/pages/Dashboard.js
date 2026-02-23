import React, { useEffect, useState } from "react";
import { getTopCoins, getChartData } from "../api";
import { useNavigate } from "react-router-dom";
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

  const navigate = useNavigate();

  useEffect(() => {
    const fetchCoins = async () => {
      setLoading(true);
      const res = await getTopCoins(currency, perPage);
      setCoins(res.data);
      setLoading(false);
    };
    fetchCoins();
  }, [currency, perPage]);

  useEffect(() => {
    const fetchChart = async () => {
      const res = await getChartData(selectedCoin, currency, days);
      setChartData(res.data);
    };
    fetchChart();
  }, [selectedCoin, currency, days]);

  return (
    <div className="dashboard-wrapper">

      <div className="dashboard-header">
        <h2>Crypto Market Dashboard</h2>
        <button
          className="exchange-btn"
          onClick={() => navigate("/exchanges")}
        >
          Show Exchanges
        </button>
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
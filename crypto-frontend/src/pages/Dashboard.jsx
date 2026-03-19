import React, { useEffect, useState } from "react";
import { getTopCoins, getChartData } from "../services/cryptoApi";
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


  /* =============================
        FETCH TOP COINS
  ============================== */
  useEffect(() => {
    const fetchCoins = async () => {
      try {
        setLoading(true);
        const res = await getTopCoins(currency, perPage);
        setCoins(res);
      } catch (error) {
        console.error("Error fetching coins:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCoins();
  }, [currency, perPage]);

  /* =============================
        FETCH CHART DATA
  ============================== */
  useEffect(() => {
    const fetchChart = async () => {
      try {
        const res = await getChartData(selectedCoin, currency, days);
        setChartData(res);
      } catch (error) {
        console.error("Error fetching chart:", error);
      }
    };

    fetchChart();
  }, [selectedCoin, currency, days]);

  return (
    <div className="dashboard-wrapper">

      {/* FILTER SECTION */}
      <div className="filter-card">
        <FilterBar
          setCurrency={setCurrency}
          setPerPage={setPerPage}
          setDays={setDays}
        />
      </div>

      {/* CHART SECTION */}
      <div className="chart-card">
        <CryptoChart chartData={chartData} />
      </div>

      {/* TABLE SECTION */}
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
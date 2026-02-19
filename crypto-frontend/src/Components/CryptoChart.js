import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement
} from "chart.js";

import "../styles/components/chart.css";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement);

const CryptoChart = ({ chartData }) => {

  const data = {
  labels: chartData.map(item =>
    new Date(item[0]).toLocaleTimeString()
  ),
  datasets: [
    {
      label: "Price",
      data: chartData.map(item => item[1]),
      borderColor: "#38bdf8",
      backgroundColor: "rgba(56,189,248,0.2)",
      tension: 0.4,
      pointRadius: 0,
      fill: true
    }
  ]
};

const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false
    }
  },
  scales: {
    x: {
      ticks: {
        maxTicksLimit: 6, // 👈 IMPORTANT
        color: "#94a3b8"
      },
      grid: {
        display: false
      }
    },
    y: {
      ticks: {
        color: "#94a3b8"
      },
      grid: {
        color: "rgba(148,163,184,0.1)"
      }
    }
  }
};


  return (
    <div className="chart-container">
      <div className="chart-title">Crypto Price Trend</div>
      <div className="chart-inner">
      <Line data={data} options={options} />

      </div>
    </div>
  );
};

export default CryptoChart;

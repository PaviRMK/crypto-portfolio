import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ExchangePage from "./pages/ExchangePage";
import PortfolioPage from "./pages/PortfolioPage";
import TradePage from "./pages/TradePage";

import Navbar from "./Components/Navbar";
import { getRiskAlerts } from "./services/portfolioApi";
import CoinDetails from "./pages/CoinDetails";

function App() {

  const [alerts, setAlerts] = useState([]);

  const userId = localStorage.getItem("userId") || 1;

  // 🔥 FETCH ONCE (MAIN FIX)
  useEffect(() => {
    const loadAlerts = async () => {
      try {
        const data = await getRiskAlerts(userId);
        console.log("APP ALERTS:", data); // DEBUG
        setAlerts(data || []);
      } catch (err) {
        console.error("App Alerts Error:", err);
      }
    };

    loadAlerts();
  }, [userId]);

  const Layout = ({ children }) => (
    <>
      {/* ✅ PASS ALERTS HERE */}
      <Navbar alerts={alerts} />
      {children}
    </>
  );

  return (
    <Router>

      <Routes>

        <Route path="/" element={<Navigate to="/login" />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/dashboard"
          element={
            <Layout>
              <Dashboard />
            </Layout>
          }
        />
          <Route path="/coins/:coinId" element={
              <Layout><
                  CoinDetails />
              </Layout>
          } />
        <Route
          path="/exchange"
          element={
            <Layout>
              <ExchangePage />
            </Layout>
          }
        />

        <Route
          path="/portfolio"
          element={
            <Layout>
              {/* ✅ PASS HERE ALSO (optional but good) */}
              <PortfolioPage alerts={alerts} />
            </Layout>
          }
        />

        <Route
          path="/trade"
          element={
            <>
              <Navbar alerts={alerts} />
              <TradePage />
            </>
          }
        />

      </Routes>

    </Router>
  );
}

export default App;
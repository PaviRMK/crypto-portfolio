import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ExchangePage from "./pages/ExchangePage";
import PortfolioPage from "./pages/PortfolioPage";
import TradePage from "./pages/TradePage";

import Navbar from "./Components/Navbar";
import { getPortfolioSummary, getRiskAlerts } from "./services/portfolioApi";
import ProfilePage from "./pages/ProfilePage";
import SettingsPage from "./pages/SettingsPage";
import { UserProvider } from "./contexts/UserContext";

function App() {

  const [alerts, setAlerts] = useState([]);
  const [portfolioSnapshot, setPortfolioSnapshot] = useState({
    totalValue: 0,
    totalPnl: 0
  });

  const userId = localStorage.getItem("userId") || 1;

  useEffect(() => {
    const loadNavbarData = async () => {
      try {
        const [alertData, summaryData] = await Promise.all([
          getRiskAlerts(userId),
          getPortfolioSummary(userId)
        ]);

        setAlerts(alertData || []);
        setPortfolioSnapshot({
          totalValue: summaryData?.totalValue ?? 0,
          totalPnl: summaryData?.totalPnl ?? 0
        });
      } catch (err) {
        console.error("App navbar data error:", err);
      }
    };

    loadNavbarData();
  }, [userId]);

  const Layout = ({ children }) => (
    <>
      <Navbar
        alerts={alerts}
        portfolioSnapshot={portfolioSnapshot}
      />
      {children}
    </>
  );

  return (
    <UserProvider>
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
              <PortfolioPage alerts={alerts} />
            </Layout>
          }
        />

        <Route
          path="/trade"
          element={
            <>
              <Navbar
                alerts={alerts}
                portfolioSnapshot={portfolioSnapshot}
              />
              <TradePage />
            </>
          }
        />

        <Route
          path="/profile"
          element={
            <Layout>
              <ProfilePage />
            </Layout>
          }
        />

        <Route
          path="/settings"
          element={
            <Layout>
              <SettingsPage />
            </Layout>
          }
        />

        </Routes>

      </Router>
    </UserProvider>
  );
}

export default App;
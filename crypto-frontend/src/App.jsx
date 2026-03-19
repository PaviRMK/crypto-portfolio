import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ExchangePage from "./pages/ExchangePage";
import PortfolioPage from "./pages/PortfolioPage";
import TradePage from "./pages/TradePage";

import Navbar from "./Components/Navbar";

function App() {

  const Layout = ({ children }) => (
    <>
      <Navbar />
      {children}
    </>
  );

  return (
    <Router>

      <Routes>

        {/* Redirect root to login */}
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
              <PortfolioPage />
            </Layout>
          }
        />
        <Route path="/trade" element={
          <>
            <Navbar />
            <TradePage />
          </>
        } />

      </Routes>

    </Router>
  );
}

export default App;
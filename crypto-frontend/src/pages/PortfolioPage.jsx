import React, { useEffect, useState, useCallback } from "react";
import {
  getPortfolioSummary,
  getHoldingsLive,
  getRiskAlerts,
  getPnlSummary,
  exportPortfolio,
  downloadTaxReport
} from "../services/portfolioApi";

import PortfolioSummary from "../Components/PortfolioSummary";
import HoldingsTable from "../Components/HoldingsTable";
import TaxCard from "../Components/TaxCard";
import Notifications from "../Components/Notifications";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Papa from "papaparse";

import "../styles/pages/portfolio.css";

/* Toast Close Button */

const ToastCloseButton = ({ closeToast }) => (
  <button className="toast-close-btn" onClick={closeToast}>
    ✕
  </button>
);
const PortfolioPage = ({ alerts = [] }) => {

  const userId = localStorage.getItem("userId") || 1;

  const [summary, setSummary] = useState(null);
  const [holdings, setHoldings] = useState([]);
  const [pnl, setPnl] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [downloading, setDownloading] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewError, setPreviewError] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [previewHeaders, setPreviewHeaders] = useState([]);
  const [previewRows, setPreviewRows] = useState([]);
  const [summaryRows] = useState([]);
  const [error, setError] = useState("");

  /* ================= LOAD DATA ================= */
  const loadPortfolioData = useCallback(async () => {
    try {
      const [
        summaryData,
        holdingsData,
        pnlData
      ] = await Promise.all([
        getPortfolioSummary(userId),
        getHoldingsLive(userId),
        getPnlSummary(userId)
      ]);

      const summaryData = await getPortfolioSummary(userId);
      const holdingsData = await getHoldingsLive(userId);
      const alertsData = await getRiskAlerts(userId);

      setSummary(summaryData);
      setHoldings(holdingsData);
      setAlerts(alertsData || []);
      setPnl(pnlData);

    } catch (error) {

      console.error("Portfolio API error", error);

    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    loadPortfolioData();
  }, [loadPortfolioData]);

  /* ================= SCAM ALERT ================= */
  useEffect(() => {
    alerts.forEach((alert) => {
      if (alert.severity === "CRITICAL") {
        toast.error(`${alert.assetSymbol} is flagged as a SCAM token`, {
          toastId: `scam-${alert.assetSymbol}`
        });
      }
    });
  }, [alerts]);

  const formatNumber = (value) => {
    const num = Number(value);
    return isNaN(num) ? value : num.toFixed(2);
  };

  const handleExport = async () => {
    try {
      const blob = await exportPortfolio(userId);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "portfolio.csv";
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Export failed", error);
    }
  };

  const handleDownloadTaxReport = async () => {
    try {
      setDownloading(true);
      const blob = await downloadTaxReport(userId);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "tax_report.csv";
      a.click();
      window.URL.revokeObjectURL(url);
    } finally {
      setDownloading(false);
    }
  };

  const handlePreviewTaxReport = async () => {
    try {
      setPreviewLoading(true);
      const blob = await downloadTaxReport(userId);
      const csvText = await blob.text();

      const parsed = Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true
      });

      setPreviewHeaders(parsed.meta.fields);
      setPreviewRows(parsed.data.map(obj =>
        parsed.meta.fields.map(h => obj[h])
      ));
      setShowPreview(true);

    } finally {
      setPreviewLoading(false);
    }
  };

  const status =
    pnl?.realizedPnl > 0
      ? "Profit"
      : pnl?.realizedPnl < 0
        ? "Loss"
        : "Neutral";

  if (loading) return <div className="loader">Loading...</div>;

  return (
    <div className="portfolio-page">

      {/* 🔔 BELL BUTTON */}
      <div style={{ position: "absolute", top: 20, right: 30 }}>
        <button onClick={() => setShowNotifications(prev => !prev)}>
          🔔 ({alerts.length})
        </button>
      </div>

      {/* 🔥 NOTIFICATIONS (FINAL FIX) */}
      {showNotifications && (
        <Notifications
          notifications={alerts}
          onClose={() => setShowNotifications(false)}
        />
      )}

      <PortfolioSummary summary={summary} />

      {pnl && (
        <div className="pnl-grid">
          <div className={pnl.realizedPnl >= 0 ? "pnl-card realized-green" : "pnl-card red"}>
            <div className="pnl-title">Realized Profit & Loss</div>
            <div className="pnl-value">${formatNumber(pnl.realizedPnl)}</div>
          </div>

          <div className={pnl.unrealizedPnl >= 0 ? "pnl-card unrealized-green" : "pnl-card red"}>
            <div className="pnl-title">Unrealized Profit & Loss</div>
            <div className="pnl-value">${formatNumber(pnl.unrealizedPnl)}</div>
          </div>
        </div>
      )}

      <TaxCard
        taxHint="Tax calculated based on realized trades"
        realizedProfit={`$${formatNumber(pnl?.realizedPnl)}`}
        status={status}
        downloading={downloading}
        previewLoading={previewLoading}
        previewError={previewError}
        previewHeaders={previewHeaders}
        previewRows={previewRows}
        summaryRows={summaryRows}
        showPreview={showPreview}
        error={error}
        onDownload={handleDownloadTaxReport}
        onPreview={handlePreviewTaxReport}
        onTogglePreview={() => setShowPreview(prev => !prev)}
      />

      <button className="export-btn" onClick={handleExport}>
        Export Portfolio CSV
      </button>

      <HoldingsTable holdings={holdings} alerts={alerts} />

        <ToastContainer
            position="top-right"
            autoClose={4000}
            newestOnTop
            closeOnClick
            pauseOnHover
            theme="dark"
            closeButton={ToastCloseButton}
            style={{ marginTop: "60px" }}
        />

    </div>
  );
};

export default PortfolioPage;
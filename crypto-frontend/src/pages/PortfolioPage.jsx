import React, { useEffect, useState, useCallback } from "react";
import {
  getPortfolioSummary,
  getHoldingsLive,
  getRiskAlerts,
  getPnlSummary,
  exportPortfolio,
  getTaxHint,
  downloadTaxReport
} from "../services/portfolioApi";

import PortfolioSummary from "../Components/PortfolioSummary";
import HoldingsTable from "../Components/HoldingsTable";
import TaxCard from "../Components/TaxCard";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "../styles/pages/portfolio.css";

const PortfolioPage = () => {

  const userId = localStorage.getItem("userId") || 1;

  const [summary, setSummary] = useState(null);
  const [holdings, setHoldings] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [pnl, setPnl] = useState(null);
  const [taxHint, setTaxHint] = useState("");
  const [loading, setLoading] = useState(true);

  const [downloading, setDownloading] = useState(false);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewError, setPreviewError] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [previewHeaders, setPreviewHeaders] = useState([]);
  const [previewRows, setPreviewRows] = useState([]);
  const [summaryRows] = useState([]);
  const [error, setError] = useState("");

  /* ================= CSV PARSER ================= */

  const parseCsvLine = (line) => {
    const result = [];
    let current = "";
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];

      if (char === '"') {
        if (inQuotes && line[i + 1] === '"') {
          current += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === "," && !inQuotes) {
        result.push(current.trim());
        current = "";
      } else {
        current += char;
      }
    }

    result.push(current.trim());
    return result;
  };

  /* ================= FORMAT FUNCTION (IMPORTANT) ================= */

  const formatNumber = (value) => {
    const num = Number(value);
    return isNaN(num) ? value : num.toFixed(2);
  };

  /* ================= BUILD PREVIEW ================= */

  const buildTaxPreview = (csvText) => {
  const lines = csvText
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length < 2) {
    return { headers: [], rows: [], summaries: [] };
  }

  const headers = parseCsvLine(lines[0]);
  const parsedRows = lines.slice(1).map(parseCsvLine);

  const summaryMatchers = ["TOTAL PROFIT", "LOSS", "NET RESULT"];

  const summaries = parsedRows
    .filter((row) => {
      const rowText = row.join(" ").toUpperCase();
      return summaryMatchers.some((key) => rowText.includes(key));
    })
    .map((row) => {
      const nonEmpty = row.filter((cell) => cell !== "");

      return {
        label: nonEmpty[0],
        value: Number(nonEmpty[nonEmpty.length - 1]).toFixed(2) // ✅ FIXED DECIMAL
      };
    });

  const detailRows = parsedRows
    .filter((row) => {
      const rowText = row.join(" ").toUpperCase();
      return !summaryMatchers.some((key) => rowText.includes(key));
    })
    .map((row) =>
      row.map((cell) => {
        const num = Number(cell);
        return isNaN(num) ? cell : num.toFixed(2); // ✅ FIX ALL NUMBERS
      })
    );

  return {
    headers,
    rows: detailRows,
    summaries
  };
};

  /* ================= LOAD DATA ================= */

  const loadPortfolioData = useCallback(async () => {
    try {
      const [
        summaryData,
        holdingsData,
        alertsData,
        pnlData,
        taxData
      ] = await Promise.all([
        getPortfolioSummary(userId),
        getHoldingsLive(userId),
        getRiskAlerts(userId),
        getPnlSummary(userId),
        getTaxHint(userId)
      ]);

      setSummary(summaryData);
      setHoldings(holdingsData);
      setAlerts(alertsData || []);
      setPnl(pnlData);
      setTaxHint(typeof taxData === "string" ? taxData : "");

    } catch (error) {
      console.error("Portfolio error:", error);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    loadPortfolioData();
    const interval = setInterval(loadPortfolioData, 30000);
    return () => clearInterval(interval);
  }, [loadPortfolioData]);

  /* ================= SCAM ALERT ================= */

  useEffect(() => {
    const scam = alerts.find((a) => a.severity === "CRITICAL");

    if (scam) {
      toast.error(`${scam.assetSymbol} is flagged as a SCAM token`, {
        toastId: `scam-${scam.assetSymbol}`
      });
    }
  }, [alerts]);

  /* ================= EXPORT ================= */

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

  /* ================= TAX REPORT ================= */

  const handleDownloadTaxReport = async () => {
    try {
      setDownloading(true);
      setError("");

      const blob = await downloadTaxReport(userId);

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "tax_report.csv";
      a.click();

      window.URL.revokeObjectURL(url);

    } catch (err) {
      setError("Unable to download report. Try again.");
    } finally {
      setDownloading(false);
    }
  };

  const handlePreviewTaxReport = async () => {
    try {
      setPreviewLoading(true);
      setPreviewError("");

      const blob = await downloadTaxReport(userId);
      const csvText = await blob.text();

      const parsed = buildTaxPreview(csvText);

      setPreviewHeaders(parsed.headers);
      setPreviewRows(parsed.rows);
      setShowPreview(true);

    } catch {
      setPreviewError("Unable to load preview.");
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

      {/* SUMMARY */}
      <PortfolioSummary summary={summary} />

      {/* PNL */}
      {pnl && (
        <div className="pnl-grid">

          <div
            className={
              pnl.realizedPnl >= 0
                ? "pnl-card realized-green"
                : "pnl-card red"
            }
          >
            <div className="pnl-label">
              <span>Realized Profit & Loss</span>
              <span className="tooltip-wrap" aria-label="Sold profit">
                <span className="info-icon">ⓘ</span>
                <span className="tooltip" role="tooltip">Sold profit</span>
              </span>
            </div>
            <br />
            ${formatNumber(pnl.realizedPnl)}
          </div>

          <div
            className={
              pnl.unrealizedPnl >= 0
                ? "pnl-card unrealized-green"
                : "pnl-card red"
            }
          >
            <div className="pnl-label">
              <span>Unrealized Profit & Loss</span>
              <span className="tooltip-wrap" aria-label="Holding profit">
                <span className="info-icon">ⓘ</span>
                <span className="tooltip" role="tooltip">Holding profit</span>
              </span>
            </div>
            <br />
            ${formatNumber(pnl.unrealizedPnl)}
          </div>

        </div>
      )}

      {/* TAX CARD */}
      <TaxCard
        taxHint={taxHint}
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
        onTogglePreview={() => setShowPreview((prev) => !prev)}
      />

      {/* EXPORT */}
      <button className="export-btn" onClick={handleExport}>
        Export Portfolio CSV
      </button>
     
      <HoldingsTable holdings={holdings} alerts={alerts} />  

      {/* TOAST */}
      <ToastContainer position="top-right" theme="dark" />

    </div>
  );
};

export default PortfolioPage;
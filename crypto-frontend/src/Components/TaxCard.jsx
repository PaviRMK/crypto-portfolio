import React from "react";
import "../styles/components/taxcard.css";

const TaxCard = ({
  taxHint,
  realizedProfit,
  status,
  downloading,
  previewLoading,
  previewError,
  previewHeaders,
  previewRows,
  summaryRows,
  showPreview,
  error,
  onDownload,
  onPreview,
  onTogglePreview
}) => {

  /* ================= FORMAT CELL ================= */

  const formatCell = (value) => {
    if (value === null || value === undefined || value === "") return "-";

    // ✅ Handle date formats FIRST
    if (typeof value === "string") {
      if (value.includes("T")) {
        return value.split("T")[0];
      }
      if (/^\d{4}-\d{2}-\d{2}/.test(value)) {
        return value.split(" ")[0];
      }
    }

    // ✅ Format only numbers
    if (!isNaN(value) && value !== "") {
      return Number(value).toFixed(2);
    }

    return value;
  };

  /* ================= VALIDATION ================= */

  if (taxHint === null || taxHint === undefined) return null;

  const hasPreviewData =
    Array.isArray(previewHeaders) &&
    previewHeaders.length > 0 &&
    Array.isArray(previewRows) &&
    previewRows.length > 0;

  const statusClass =
    status === "Profit"
      ? "tax-status tax-status-profit"
      : status === "Loss"
      ? "tax-status tax-status-loss"
      : "tax-status tax-status-neutral";

  /* ================= UI ================= */

  return (
    <div className="tax-card">

      {/* HEADER */}
      <div className="tax-header">
        ⚠️ Tax-Ready Information
      </div>

      {/* MESSAGE */}
      <p className="tax-message">{taxHint}</p>

      {/* META */}
      <div className="tax-meta-grid">
        <div className="tax-meta-item">
          <span className="tax-meta-label">Realized Profit:</span>
          <span className="tax-meta-value">{realizedProfit}</span>
        </div>

        <div className="tax-meta-item">
          <span className="tax-meta-label">Status:</span>
          <span className={statusClass}>{status}</span>
        </div>
      </div>

      {/* ACTIONS */}
      <div className="tax-actions">

        <button
          className="tax-preview-btn"
          onClick={showPreview ? onTogglePreview : onPreview}
          disabled={previewLoading}
          type="button"
        >
          {previewLoading
            ? "Loading Preview..."
            : showPreview
            ? "Hide Preview"
            : "Preview Tax-Ready Report"}
        </button>

        <button
          className="tax-download-btn"
          onClick={onDownload}
          disabled={downloading}
          type="button"
        >
          {downloading
            ? "Downloading..."
            : "Download Tax-Ready Report"}
        </button>

      </div>

      {/* ERROR */}
      {previewError && (
        <p className="tax-error">{previewError}</p>
      )}

      {/* ================= PREVIEW ================= */}
      {showPreview && hasPreviewData && (
        <div className="tax-preview">

          <h4 className="tax-preview-title">
            Tax-Ready Report Preview
          </h4>

          <div className="tax-preview-table-wrap">

            <table className="tax-preview-table">

              {/* HEADER */}
              <thead>
                <tr>
                  {previewHeaders.map((header, idx) => (
                    <th key={idx}>{header}</th>
                  ))}
                </tr>
              </thead>

              {/* BODY */}
              <tbody>
                {previewRows.map((row, rowIdx) => (
                  <tr key={rowIdx}>

                    {previewHeaders.map((header, colIdx) => {
                      const value = row[colIdx];
                      const normalizedHeader =
                        header?.toLowerCase().trim();

                      // 🔥 TAX EVENT BADGE
                      if (normalizedHeader === "tax event") {
                        return (
                          <td key={colIdx}>
                            <span className="badge tax-event">
                              {value}
                            </span>
                          </td>
                        );
                      }

                      // 🔥 HOLDING TYPE BADGE
                      if (normalizedHeader === "holding type") {
                        return (
                          <td key={colIdx}>
                            <span
                              className={
                                value === "Long-Term"
                                  ? "badge holding-long"
                                  : value === "Unknown"
                                  ? "badge holding-neutral"
                                  : "badge holding-short"
                              }
                            >
                              {value}
                            </span>
                          </td>
                        );
                      }

                      // ✅ FIX: prevent string cutting (symbol, category, text fields)
                      if (
                        normalizedHeader === "symbol" ||
                        normalizedHeader === "category" ||
                        normalizedHeader === "tax insight"
                      ) {
                        return (
                          <td key={colIdx}>
                            {String(value).trim()}
                          </td>
                        );
                      }

                      return (
                        <td key={colIdx}>
                          {formatCell(value)}
                        </td>
                      );
                    })}

                  </tr>
                ))}
              </tbody>

            </table>
          </div>

          {/* SUMMARY */}
          {Array.isArray(summaryRows) && summaryRows.length > 0 && (
            <div className="tax-summary-grid">

              {summaryRows.map((summary, idx) => {

                const label = (summary.label || "").toUpperCase();

                const summaryClass =
                  label.includes("LOSS")
                    ? "tax-summary-item tax-summary-loss"
                    : label.includes("PROFIT") ||
                      label.includes("NET")
                    ? "tax-summary-item tax-summary-profit"
                    : "tax-summary-item";

                return (
                  <div className={summaryClass} key={idx}>
                    <span>{summary.label}</span>
                    <strong>
                      {formatCell(summary.value)}
                    </strong>
                  </div>
                );
              })}

            </div>
          )}

        </div>
      )}

      {/* FINAL ERROR */}
      {error && (
        <p className="tax-error">{error}</p>
      )}

    </div>
  );
};

export default TaxCard;
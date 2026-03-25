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

  // Format numeric values to 2 decimal places
  const formatNumericDisplay = (value) => {
    if (value === null || value === undefined || value === "-") return value;
    const num = parseFloat(value);
    return isNaN(num) ? value : num.toFixed(2);
  };

  // show nothing only if completely missing
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

  return (
    <div className="tax-card">

      <div className="tax-header">
        ⚠️ Tax Information
      </div>

      <p className="tax-message">
        {taxHint}
      </p>

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
            : "Preview Tax Report"}
        </button>

        <button
          className="tax-download-btn"
          onClick={onDownload}
          disabled={downloading}
          type="button"
        >
          {downloading ? "Downloading..." : "Download Tax Report"}
        </button>
      </div>

      {previewError && (
        <p className="tax-error">{previewError}</p>
      )}

      {showPreview && hasPreviewData && (
        <div className="tax-preview">
          <h4 className="tax-preview-title">Tax Report Preview</h4>
          <div className="tax-preview-table-wrap">
            <table className="tax-preview-table">
              <thead>
                <tr>
                  {previewHeaders.map((header, idx) => (
                    <th key={`tax-header-${idx}`}>{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {previewRows.map((row, rowIdx) => (
                  <tr key={`tax-row-${rowIdx}`}>
                    {previewHeaders.map((_, colIdx) => (
                      <td key={`tax-cell-${rowIdx}-${colIdx}`}>
                        {formatNumericDisplay(row[colIdx] || "-")}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {Array.isArray(summaryRows) && summaryRows.length > 0 && (
            <div className="tax-summary-grid">
              {summaryRows.map((summary, idx) => {
                const summaryLabel = (summary.label || "").toUpperCase();
                const summaryClass =
                  summaryLabel.includes("LOSS")
                    ? "tax-summary-item tax-summary-loss"
                    : summaryLabel.includes("PROFIT") ||
                      summaryLabel.includes("NET RESULT")
                    ? "tax-summary-item tax-summary-profit"
                    : "tax-summary-item";

                return (
                  <div className={summaryClass} key={`tax-summary-${idx}`}>
                    <span>{summary.label}</span>
                    <strong>{formatNumericDisplay(summary.value)}</strong>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {error && (
        <p className="tax-error">{error}</p>
      )}

    </div>
  );
};

export default TaxCard;
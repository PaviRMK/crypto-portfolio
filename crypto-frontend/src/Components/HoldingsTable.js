import React from "react";

const HoldingsTable = ({ holdings }) => {

  const coinRiskData = {
    BTC: {
      risk: "LOW",
      volatility: "Medium",
      category: "Blue-chip crypto",
      reason: "Large market cap and strong liquidity."
    },
    ETH: {
      risk: "MEDIUM",
      volatility: "Medium",
      category: "Smart Contract Platform",
      reason: "Large ecosystem with moderate volatility."
    },
    XRP: {
      risk: "MEDIUM",
      volatility: "Medium",
      category: "Payment Network Token",
      reason: "Regulatory uncertainty."
    },
    DOGE: {
      risk: "HIGH",
      volatility: "Extreme",
      category: "Meme coin",
      reason: "Highly speculative asset."
    }
  };

  if (!holdings || holdings.length === 0) {
    return (
      <div className="portfolio-section">
        <h3>Holdings</h3>
        <p className="empty-text">No holdings available.</p>
      </div>
    );
  }

  return (
    <div className="portfolio-section">

      <h3>Holdings</h3>

      <table className="portfolio-table">

        <thead>
          <tr>
            <th>Asset</th>
            <th>Quantity</th>
            <th>Avg Cost</th>
            <th>Live Price</th>
            <th>Current Value</th>
            <th>Unrealized PnL</th>
          </tr>
        </thead>

        <tbody>

          {holdings.map((holding, index) => {

            const risk = coinRiskData[holding.assetSymbol];

            return (

              <tr key={index}>

                {/* Asset Column */}

                <td>
                  <div className="asset-cell">

                    <span className="asset-name">
                      {holding.assetSymbol}
                    </span>

                    {risk && (
                      <div className="risk-wrapper">

                        <span className={`risk-badge ${risk.risk.toLowerCase()}`}>
                          {risk.risk}
                        </span>

                        {/* Tooltip */}

                        <div className="tooltip">

                          <h4>Risk Analysis</h4>

                          <p><b>Risk Level:</b> {risk.risk}</p>

                          <p><b>Volatility:</b> {risk.volatility}</p>

                          <p><b>Category:</b> {risk.category}</p>

                          <p className="risk-description">
                            {risk.reason}
                          </p>

                        </div>

                      </div>
                    )}

                  </div>
                </td>

                <td>
                  {Number(holding.quantity).toLocaleString()}
                </td>

                <td>
                  ${Number(holding.avgCost).toLocaleString()}
                </td>

                <td>
                  ${Number(holding.livePrice).toLocaleString()}
                </td>

                <td>
                  ${Number(holding.currentValue).toLocaleString()}
                </td>

                <td className={holding.unrealizedPnl >= 0 ? "green" : "red"}>
                  ${Number(holding.unrealizedPnl).toLocaleString()}
                </td>

              </tr>

            );
          })}

        </tbody>

      </table>

    </div>
  );
};

export default HoldingsTable;
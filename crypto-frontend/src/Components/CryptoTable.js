import React from "react";
import "../styles/components/table.css";


const CryptoTable = ({ coins = [], setSelectedCoin, currency }) => {

  const symbolMap = {
    usd: "$",
    inr: "₹",
    eur: "€",
    gbp: "£"
  };

  const formatNumber = (num) => {
    if (!num) return "-";
    return num.toLocaleString();
  };

  return (
    <div style={{ overflowX: "auto" }}>
      <table className="crypto-table">
        <thead>
          <tr>
            <th>Coin</th>
            <th>Price</th>
            <th>24H %</th>
            <th>Market Cap</th>
            <th>Volume</th>
          </tr>
        </thead>

        <tbody>
          {coins.map((coin) => (
            <tr
              key={coin.id}
              onClick={() => setSelectedCoin(coin.id)}
            >
              {/* Coin Column */}
              <td>
                <div className="coin-cell">
                  <img src={coin.image.replace("large", "small")} alt={coin.name}/>

                  <div>
                  <div style={{ fontWeight: "600" }}>
                         {coin.name}
                   </div>
                    <div style={{ fontSize: "12px", color: "#94a3b8" }}>
                      {coin.symbol.toUpperCase()}
                    </div>
                  </div>
                  </div>
                
              </td>

              {/* Price */}
              <td>
                {symbolMap[currency]}
                {coin.current_price?.toFixed(2)}
              </td>

              {/* 24H % */}
              <td
                className={
                  coin.price_change_percentage_24h > 0
                    ? "green"
                    : "red"
                }
              >
                {coin.price_change_percentage_24h?.toFixed(2)}%
              </td>

              {/* Market Cap */}
              <td>
                {symbolMap[currency]}
                {formatNumber(coin.market_cap)}
              </td>

              {/* Volume */}
              <td>
                {symbolMap[currency]}
                {formatNumber(coin.total_volume)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CryptoTable;

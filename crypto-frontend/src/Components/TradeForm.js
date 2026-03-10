import React, { useState } from "react";
import API from "../api";

const TradeForm = ({ onTradeSuccess }) => {

  const [asset, setAsset] = useState("");
  const [side, setSide] = useState("BUY");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [fee, setFee] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!asset.trim()) {
      setError("Asset symbol cannot be empty");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await API.post(`/portfolio/trade?userId=1`, {
        assetSymbol: asset.trim().toUpperCase(),
        side,
        quantity,
        price,
        fee
      });

      setAsset("");
      setQuantity("");
      setPrice("");
      setFee("");

      if (onTradeSuccess) {
        await onTradeSuccess();
      }

    } catch (err) {
      setError("Trade failed.");
    }

    setLoading(false);
  };

  return (
    <div className="portfolio-section">
      <h3>Add Trade</h3>

      <form className="trade-grid" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Asset Symbol (BTC)"
          value={asset}
          onChange={(e) => setAsset(e.target.value)}
        />

        <select value={side} onChange={(e) => setSide(e.target.value)}>
          <option value="BUY">BUY</option>
          <option value="SELL">SELL</option>
        </select>

        <input
          type="number"
          placeholder="Quantity"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
        />

        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />

        <input
          type="number"
          placeholder="Fee"
          value={fee}
          onChange={(e) => setFee(e.target.value)}
        />

        <button type="submit" className="trade-btn" disabled={loading}>
          {loading ? "Processing..." : "Submit Trade"}
        </button>
      </form>

      {error && <p className="error-text">{error}</p>}
    </div>
  );
};

export default TradeForm;
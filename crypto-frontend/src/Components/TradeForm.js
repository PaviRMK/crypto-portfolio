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

  const handleTradeSubmit = async (e) => {
    e.preventDefault();

    if (!asset.trim()) {
      setError("Asset symbol cannot be empty");
      return;
    }

    if (!quantity || quantity <= 0) {
      setError("Quantity must be greater than 0");
      return;
    }

    if (!price || price <= 0) {
      setError("Price must be greater than 0");
      return;
    }

    setError("");
    setLoading(true);

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
        onTradeSuccess();
      }

    } catch (err) {
      setError("Trade failed. Please try again.");
      console.error(err);
    }

    setLoading(false);
  };

  return (
    <div className="portfolio-section">
      <h3>Add Trade</h3>

      <form className="trade-grid" onSubmit={handleTradeSubmit}>

        <input
          type="text"
          placeholder="Asset Symbol (e.g BTC)"
          value={asset}
          onChange={(e) => setAsset(e.target.value)}
        />

        <select
          value={side}
          onChange={(e) => setSide(e.target.value)}
        >
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

        <button
          type="submit"
          className="trade-btn"
          disabled={loading}
        >
          {loading ? "Processing..." : "Submit Trade"}
        </button>

      </form>

      {error && (
        <p style={{ color: "#ef4444", marginTop: "12px" }}>
          {error}
        </p>
      )}
    </div>
  );
};

export default TradeForm;
import React, { useState } from "react";
import { connectExchange } from "../services/exchangeApi";
import "../styles/components/connectExchange.css";

const ConnectExchangeForm = ({ onConnected }) => {

  const [exchangeId, setExchangeId] = useState(1);
  const [apiKey, setApiKey] = useState("");
  const [secret, setSecret] = useState("");
  const [loading, setLoading] = useState(false);

  const handleConnect = async () => {

    try {

      setLoading(true);

      await connectExchange({
        userId: 1,
        exchangeId: exchangeId,
        apiKey: apiKey,
        secret: secret
      });

      alert("Exchange Connected Successfully");

      setApiKey("");
      setSecret("");

      if (onConnected) onConnected();

    } catch (err) {
      console.error(err);
      alert("Connection Failed");
    } finally {
      setLoading(false);
    }

  };

  return (
    <div className="connect-card">

      <h2>Connect Exchange</h2>

      <label>Exchange</label>
      <select
        value={exchangeId}
        onChange={(e) => setExchangeId(e.target.value)}
      >
        <option value={1}>Binance</option>
        <option value={2}>Coinbase</option>
        <option value={3}>Kraken</option>
      </select>

      <label>API Key</label>
      <input
        type="text"
        placeholder="Enter API Key"
        value={apiKey}
        onChange={(e) => setApiKey(e.target.value)}
      />

      <label>Secret Key</label>
      <input
        type="password"
        placeholder="Enter Secret Key"
        value={secret}
        onChange={(e) => setSecret(e.target.value)}
      />

      <button onClick={handleConnect}>
        {loading ? "Connecting..." : "Connect Exchange"}
      </button>

    </div>
  );
};

export default ConnectExchangeForm;
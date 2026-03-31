import React, { useState } from "react";
import { connectExchange } from "../services/exchangeApi";
import { toast } from "react-toastify";

const ConnectExchangeForm = ({ onConnected }) => {

  const [exchange, setExchange] = useState("Binance");
  const [apiKey, setApiKey] = useState("");
  const [secretKey, setSecretKey] = useState("");
  const [loading, setLoading] = useState(false);

  const handleConnect = async () => {

    if (!apiKey.trim()) {
      toast.error("Please enter API key");
      return;
    }

    if (!secretKey.trim()) {
      toast.error("Please enter Secret key");
      return;
    }

    try {

      setLoading(true);

      toast.info("Validating exchange credentials...");

      const response = await connectExchange(exchange, apiKey, secretKey);

      if (response.success) {

        toast.success(response.message);

        if (onConnected) {
          onConnected();
        }

      } else {

        toast.error(response.message);

      }

    } catch (error) {

      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Unable to connect exchange");
      }

    } finally {

      setLoading(false);

    }

  };

  return (

    <div className="connect-card">

      <h2>Connect Exchange</h2>

      <select
        value={exchange}
        onChange={(e) => setExchange(e.target.value)}
      >
        <option>Binance</option>
        <option>Bybit</option>
        <option>Coinbase</option>
      </select>

      <input
        type="text"
        placeholder="Enter API Key"
        value={apiKey}
        onChange={(e) => setApiKey(e.target.value)}
      />

      <input
        type="password"
        placeholder="Enter Secret Key"
        value={secretKey}
        onChange={(e) => setSecretKey(e.target.value)}
      />

      <button onClick={handleConnect} disabled={loading}>
        {loading ? "Connecting..." : "Connect Exchange"}
      </button>

    </div>

  );
};

export default ConnectExchangeForm;
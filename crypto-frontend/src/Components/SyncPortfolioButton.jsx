import React, { useState } from "react";
import { syncTrades } from "../services/exchangeApi";

const SyncTradesButton = ({ onSynced }) => {

  const [loading, setLoading] = useState(false);

  const handleSync = async () => {

    try {

      setLoading(true);

      const userId = localStorage.getItem("userId") || 1;

      const data = await syncTrades(userId, 1);

      console.log("Trades Sync Response:", data);

      alert("Trades synced successfully");

      if (onSynced) {
        onSynced();
      }

    } catch (error) {

      console.error("Sync Error:", error);
      alert("Trade sync failed");

    } finally {

      setLoading(false);

    }

  };

  return (
    <button className="sync-btn" onClick={handleSync} disabled={loading}>
      {loading ? "Syncing Trades..." : "Sync Trades"}
    </button>
  );
};

export default SyncTradesButton;
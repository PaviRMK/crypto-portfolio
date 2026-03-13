import React, { useState } from "react";
import { syncExchangePortfolio } from "../services/exchangeApi";

const SyncPortfolioButton = ({ onSynced }) => {

  const [loading, setLoading] = useState(false);

  const handleSync = async () => {

    try {

      setLoading(true);

      const data = await syncExchangePortfolio(1,1);

      console.log("Sync Response:", data);

      alert("Portfolio synced successfully");

      if(onSynced){
        onSynced();
      }

    } catch(error){

      console.error("Sync Error:", error);

      alert("Portfolio sync failed");

    } finally{

      setLoading(false);

    }

  };

  return (
    <button onClick={handleSync}>
      {loading ? "Syncing..." : "Sync Portfolio"}
    </button>
  );
};

export default SyncPortfolioButton;
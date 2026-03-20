import React, { useEffect, useState } from "react";
import "../styles/components/scamAlert.css";

const ScamAlert = ({ asset, onClose }) => {
  const [hide, setHide] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setHide(true); // start fade-out
      setTimeout(onClose, 300); // remove after animation
    }, 2000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`alert ${hide ? "hide" : ""}`}>
      
      <span className="alert-text">
        🚨 {asset} is flagged as a SCAM token!
      </span>

      <button className="alert-close" onClick={onClose}>
        ✖
      </button>

    </div>
  );
};

export default ScamAlert;
import React, { useEffect, useState } from "react";
import "../styles/components/toast.css";

const Toast = ({ message, type = "info", show, onClose }) => {
  const [visible, setVisible] = useState(false);
  const [hide, setHide] = useState(false);

  const getIcon = () => {
    if (type === "error") return "🚨";
    if (type === "warning") return "⚠️";
    return "ℹ️";
  };

  useEffect(() => {
    if (show) {
      setVisible(true);
      setHide(false);

      const timer = setTimeout(() => {
        setHide(true);
        setTimeout(onClose, 300); // fade-out
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  if (!show) return null;

  return (
    <div className={`toast ${visible ? "show" : ""} ${hide ? "hide" : ""}`}>
      
      <div className="toast-content">

        <span className="toast-icon">
          {getIcon()}
        </span>

        <p className="toast-message">
          {message}
        </p>

        <button className="toast-close" onClick={onClose}>
          ✖
        </button>

      </div>

      {/* Progress Bar */}
      <div className="progress"></div>

    </div>
  );
};

export default Toast;
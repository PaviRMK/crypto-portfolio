import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/components/filterbar.css";

const FilterBar = ({
  setCurrency,
  setPerPage,
  setDays
}) => {

  const navigate = useNavigate();

  const handleTimeChange = (e) => {
    const valueMap = {
      "1D": 1,
      "1W": 7,
      "1M": 30,
      "1Y": 365
    };

    setDays(valueMap[e.target.value] || 1);
  };

  return (
    <div className="filter-bar">

      {/* Time Range */}
      <div className="filter-group">
        <label className="filter-label">Time Range</label>
        <select
          className="filter-select"
          onChange={handleTimeChange}
        >
          <option value="1D">1 Day</option>
          <option value="1W">1 Week</option>
          <option value="1M">1 Month</option>
          <option value="1Y">1 Year</option>
        </select>
      </div>

      {/* Currency */}
      <div className="filter-group">
        <label className="filter-label">Currency</label>
        <select
          className="filter-select"
          onChange={(e) => setCurrency(e.target.value)}
        >
          <option value="usd">USD</option>
          <option value="inr">INR</option>
          <option value="eur">EUR</option>
          <option value="gbp">GBP</option>
        </select>
      </div>

      {/* Rows */}
      <div className="filter-group">
        <label className="filter-label">Rows Per Page</label>
        <select
          className="filter-select"
          onChange={(e) => setPerPage(Number(e.target.value))}
        >
          <option value={10}>10 Rows</option>
          <option value={30}>30 Rows</option>
          <option value={50}>50 Rows</option>
        </select>
      </div>

      

    </div>
  );
};

export default FilterBar;
import React from "react";
import "../styles/components/filterbar.css";


const FilterBar = ({ setCurrency, setPerPage, setDays }) => {

  const handleTimeChange = (e) => {
    const value = parseInt(e.target.value);
    setDays(value);
  };

  return (
  <div className="filter-bar">

    {/* Time Range */}
    <div className="filter-group">
      <label className="filter-label">Time Range</label>
      <select className="filter-select" onChange={handleTimeChange}>
        <option>1H</option>
        <option>1D</option>
        <option>1W</option>
        <option>1M</option>
        <option>1Y</option>
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

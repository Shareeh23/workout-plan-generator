import React from "react";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";
import "./ProgressMetric.css";

const ProgressMetric = ({ label, currentValue, change, unit = "kg" }) => {
  const isPositive = change >= 0;

  return (
    <div className="progress-metric">
      <span className="metric-label text-lg">{label}</span>
      <span className="metric-value text-lg">
        {currentValue?.toFixed(1) || "0.0"} {unit}
      </span>
      {change !== undefined && (
        <div
          className={`metric-change-container ${
            isPositive ? "positive" : "negative"
          }`}
        >
          <span>
            {isPositive ? (
              <FaArrowUp className="metric-icon" />
            ) : (
              <FaArrowDown className="metric-icon" />
            )}
          </span>
          <span className="metric-change text-md">
            {Math.abs(change).toFixed(1)} {unit}
          </span>
        </div>
      )}
    </div>
  );
};

export default ProgressMetric;

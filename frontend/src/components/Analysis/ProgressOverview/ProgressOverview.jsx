import React from "react";
import ProgressMetric from "../ProgressMetric/ProgressMetric";
import "./ProgressOverview.css";

const ProgressOverview = ({ progress }) => {
  return (
    <div className="progress-overview-card">
      <h3 className="progress-overview-header">Progress Overview</h3>
      <div className="progress-metrics">
        <ProgressMetric
          label="Weight"
          currentValue={progress?.weight?.current}
          change={progress?.weight?.change}
          unit="kg"
        />
        <ProgressMetric
          label="Volume"
          currentValue={progress?.volume?.current}
          change={progress?.volume?.change}
          unit="kg"
        />
      </div>
    </div>
  );
};

export default ProgressOverview;

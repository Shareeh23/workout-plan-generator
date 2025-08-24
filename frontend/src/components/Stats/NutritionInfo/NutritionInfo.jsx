import React from "react";
import "./NutritionInfo.css";

const NutritionInfo = ({ userData }) => {
  if (!userData) {
    return (
      <div className="nutrition-info">
        <h3 className="nutrition-info-header">
          No nutrition data available. Please complete your profile.
        </h3>
      </div>
    );
  }

  const { height, currentWeight, age, gender, activityLevel, goal, bmr } =
    userData;

  return (
    <div className="nutrition-info">
      <h3 className="nutrition-info-header">Nutrition Profile</h3>
      <div className="info-container">
        <div className="info-item">
          <span className="info-label text-lg">Height</span>
          <span className="info-value text-lg">{height} cm</span>
        </div>
        <div className="info-item">
          <span className="info-label text-lg">Weight</span>
          <span className="info-value text-lg">{currentWeight} kg</span>
        </div>
        <div className="info-item">
          <span className="info-label text-lg">Age</span>
          <span className="info-value text-lg">{age} years</span>
        </div>
        <div className="info-item">
          <span className="info-label text-lg">Gender</span>
          <span className="info-value text-lg">
            {gender?.charAt(0).toUpperCase() + gender?.slice(1)}
          </span>
        </div>
        <div className="info-item">
          <span className="info-label text-lg">Activity Level</span>
          <span className="info-value text-lg">{activityLevel}</span>
        </div>
        <div className="info-item">
          <span className="info-label text-lg">Goal</span>
          <span className="info-value text-lg">{goal}</span>
        </div>
        {bmr && (
          <div className="info-item">
            <span className="info-label text-lg">BMR</span>
            <span className="info-value text-lg">{bmr} kcal</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default NutritionInfo;

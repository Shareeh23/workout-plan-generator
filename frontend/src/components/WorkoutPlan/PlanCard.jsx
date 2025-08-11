// frontend/src/components/WorkoutPlan/PlanCard.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { assignPredefinedPlan } from "../../api/workoutApi";
import AnteriorMuscleModel from "../../components/Home/MuscleModels/AnteriorMuscleModel";
import PosteriorMuscleModel from "../../components/Home/MuscleModels/PosteriorMuscleModel";
import "./PlanCard.css";

const PlanCard = ({ plan }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const { prioritizedMuscles = [], neutralPoints = [], weakPoints = [] } = plan;

  const priorities = {
    prioritized: prioritizedMuscles,
    neutral: neutralPoints,
    weak: weakPoints,
  };

  const handleSelectPlan = async () => {
    try {
      setIsLoading(true);
      await assignPredefinedPlan(plan._id);
      navigate("/"); // Redirect to home after successful selection
    } catch (error) {
      console.error("Error selecting plan:", error);
      // You might want to show a toast/notification here
      alert("Failed to select plan. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="plan-cards">
      <div className="plan-card">
        <div className="muscle-model-container">
          <div className="muscle-model-wrapper">
            <AnteriorMuscleModel priorities={priorities} />
            <PosteriorMuscleModel priorities={priorities} />
          </div>
        </div>

        <button
          onClick={handleSelectPlan}
          disabled={isLoading}
          className="btn-primary-lg"
        >
          {isLoading ? (
            <>
              <span className="btn-spinner"></span>
            </>
          ) : (
            "Select Plan"
          )}
        </button>
      </div>
    </div>
  );
};

export default PlanCard;

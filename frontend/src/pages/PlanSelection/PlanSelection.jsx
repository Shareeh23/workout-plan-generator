// frontend/src/pages/PlanSelection/PlanSelection.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import PlanCard from "../../components/WorkoutPlan/PlanCard";
import { getPredefinedPlans } from "../../api/workoutApi";
import "./PlanSelection.css";

const PlanSelection = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const data = await getPredefinedPlans();
        setPlans(data);
      } catch (err) {
        setError("Failed to load workout plans. Please try again later.");
        console.error("Error fetching plans:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <h1>Loading workout plans...</h1>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p className="error-message text-lg">{error}</p>
        <button onClick={() => window.location.reload()} className="retry-btn btn-primary-lg">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="plan-selection-page">
      <div className="plan-selection-container">
        <div className="plan-selection-header">
          <h1>Choose Your Training Program</h1>
          <p className="text-lg">
            Select a predefined plan or create your custom workout
          </p>
        </div>

        <div className="plans-grid">
          {plans.map((plan) => (
            <PlanCard key={plan._id} plan={plan} />
          ))}
        </div>

        <div className="custom-plan-cta">
          <h2>Don't see what you're looking for?</h2>
          <p className="text-md">Create a custom workout plan tailored to your specific goals</p>
          <Link to="/workout-generation" className="custom-plan-btn">
            Create Custom Plan
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PlanSelection;

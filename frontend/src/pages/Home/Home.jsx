import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import AnteriorMuscleModel from "../../components/Home/MuscleModels/AnteriorMuscleModel";
import PosteriorMuscleModel from "../../components/Home/MuscleModels/PosteriorMuscleModel";
import UpcomingSession from "../../components/Home/UpcomingSession/UpcomingSession";
import Calendar from "../../components/Home/Calender/Calendar";
import { getWorkoutPlan } from "../../api/workoutApi";
import "./Home.css";

const Home = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [plan, setPlan] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login", { replace: true });
    } else {
      setIsAuthenticated(true);
    }
    const fetchPlan = async () => {
      try {
        const planData = await getWorkoutPlan();
        setPlan(planData);
      } catch (error) {
        console.error("Failed to fetch workout plan:", error);
      }
    };

    fetchPlan();
  }, [navigate]);

  return (
    <div className="home-container">
      <Navbar />
      <div className="home-dashboard">
        <section className="anterior-view">
          <AnteriorMuscleModel
            priorities={{
              prioritized: plan.prioritizedMuscles || [],
              neutral: plan.neutralPoints || [],
              weak: plan.weakPoints || [],
            }}
          />
        </section>
        <section className="dashboard-sidebar">
          <div className="dashboard-top-section">
            <div className="color-legend">
              <h4>Muscle Priority</h4>
              <div className="legend-items">
                <div className="legend-item">
                  <span className="legend-color prioritized"></span>
                  <span className="text-lg">Prioritized</span>
                </div>
                <div className="legend-item">
                  <span className="legend-color neutral"></span>
                  <span className="text-lg">Neutral</span>
                </div>
                <div className="legend-item">
                  <span className="legend-color weak"></span>
                  <span className="text-lg">Weak Points</span>
                </div>
              </div>
            </div>
            <div className="posterior-view">
              <PosteriorMuscleModel
                priorities={{
                  prioritized: plan.prioritizedMuscles || [],
                  neutral: plan.neutralPoints || [],
                  weak: plan.weakPoints || [],
                }}
              />
            </div>
          </div>
          <div className="dashboard-bottom-section">
            <div className="archetype-details">
              <h3 className="program-detail-heading">Your Training Profile</h3>
              <div className="program-detail-metadata">
                <div className="detail-item">
                  <span className="label text-lg">Plan:</span>
                  <span className="value text-lg">{plan.planName}</span>
                </div>
                <div className="detail-item">
                  <span className="label text-lg">Training Days:</span>
                  <span className="value text-lg">{plan.trainingDays}</span>
                </div>
              </div>
            </div>
            <div className="calendar-section-card">
              <Calendar />
            </div>
          </div>
        </section>
        <section className="upcoming-session-section">
          <div className="upcoming-session-card">
            <UpcomingSession />
          </div>
          <div className="motivation-card">
                <span className="english text-md">
                  "Today's 1% improvement is tomorrow's 100% success."
                </span>
                <span className="japanese text-md">
                  継続は力なり (Keizoku wa chikara nari) - Continuity is
                  strength.
                </span>
            </div>
        </section>
      </div>
    </div>
  );
};

export default Home;

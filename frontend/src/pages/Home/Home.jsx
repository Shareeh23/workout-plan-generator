import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import AnteriorMuscleModel from "../../components/Home/MuscleModels/AnteriorMuscleModel";
import PosteriorMuscleModel from "../../components/Home/MuscleModels/PosteriorMuscleModel";
import UpcomingSession from "../../components/Home/UpcomingSession/UpcomingSession";
import Calendar from "../../components/Home/Calender/Calendar";
import { getWorkoutPlan } from "../../api/workoutApi";
import "./Home.css";

const Home = ({ user }) => {
  const [plan, setPlan] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login", { replace: true });
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
      <Navbar user={user} />
      <div className="home-dashboard">
        <section className="right-section">
          <div className="model-view">
            <div className="anterior-view">
              <AnteriorMuscleModel
                priorities={{
                  prioritized: plan.prioritizedMuscles || [],
                  neutral: plan.neutralPoints || [],
                  weak: plan.weakPoints || [],
                }}
              />
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
        </section>

        <section className="left-section">
          <div className="calendar-section-card">
            <Calendar />
          </div>
          <div className="upcoming-session-card">
            <UpcomingSession />
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;

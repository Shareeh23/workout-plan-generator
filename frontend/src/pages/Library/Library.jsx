import { useState, useEffect } from "react";
import "./Library.css";
import Navbar from "../../components/Navbar/Navbar";
import { useNavigate } from "react-router-dom";
import { getPredefinedPlans } from "../../api/workoutApi";

export function Library() {
  const [isLoading, setIsLoading] = useState(true);
  const [plans, setPlans] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login", { replace: true });
      return;
    }

    const fetchPlans = async () => {
      try {
        const data = await getPredefinedPlans();
        setPlans(data);
      } catch (err) {
        console.error("Failed to fetch plans:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlans();
  }, [navigate]);

  if (isLoading) {
    return (
      <div className="loading-container">
        <span className="loading"></span>
      </div>
    );
  }

  return (
    <div className="library-container">
      <Navbar />
      <main className="plans-container">
        {plans.map((plan) => (
          <div key={plan._id} className="plans-card">
            <div className="plan-card-header">
              <div className="plan-archetype-details">
                <h3>Archetype</h3>
                <h3 className="archetype-name">
                  {plan.planName || "Archetype Name"}
                </h3>
              </div>
              <div className="plan-training-days-details">
                <h3>Training Days</h3>
                <h3 className="training-days">
                  {plan.trainingDays} days
                </h3>
              </div>
            </div>
            <div className="plan-image">
              <img
                src={`http://localhost:3000${plan.imageUrl}`}
                alt={plan.planName}
                className="archetype-image"
              />
            </div>
            <div className="plan-meta-details">
              <div className="strong-points">
                <div className="points-label text-lg">Strong Points</div>
                <div className="strong-points-array text-lg">
                  {plan.prioritizedMuscles.join(", ")}
                </div>
              </div>
              <div className="neutral-points">
                <div className="points-label text-lg">Neutral Points</div>
                <div className="neutral-points-array text-lg">
                  {plan.neutralPoints.join(", ")}
                </div>
              </div>
              <div className="weak-points">
                <div className="points-label text-lg">Weak Points</div>
                <div className="weak-points-array text-lg">
                  {plan.weakPoints.join(", ")}
                </div>
              </div>
            </div>
          </div>
        ))}
      </main>
    </div>
  );
}

export default Library;

import React, { useState, useEffect } from "react";
import { getFullWorkoutPlan } from "../../api/workoutApi";
import { toast } from "sonner";
import "./WorkoutPlanSessions.css";

const WorkoutPlanSessions = () => {
  const [sessions, setSessions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const data = await getFullWorkoutPlan();
        if (data?.sessions) {
          setSessions(data.sessions);
        } else {
          toast.error("No workout plan found");
        }
      } catch (err) {
        toast.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSessions();
  }, []);

  if (isLoading) {
    return (
      <div className="spinner-container">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="workout-plan-sessions">
      <h2 className="workout-plan-sessions-heading">Your Workout Plan</h2>
      <div className="sessions-container">
        {sessions.map((session, index) => (
          <div key={index} className="session-card">
            <h3>Session {session.order}</h3>
            <div className="session-card-focus-areas text-lg">
              <strong>Focus:</strong>{" "}
              {session.focusAreas?.join(", ") || "Full body"}
            </div>
            <div className="session-exercises-list">
              {session.exercises?.map((exercise, exIndex) => (
                <div key={exIndex} className="exercise-row">
                  {/* Main Exercise */}
                  <div className="session-exercise-item">
                    <div className="session-exercise-name text-lg">{exercise.name}</div>
                    <div className="session-exercise-sets text-lg">
                      {exercise.sets} × {exercise.repRange}
                    </div>
                  </div>

                  {/* Alternate Exercise (if exists) */}
                  {exercise.alternates?.[0] && (
                    <div className="session-exercise-item-alternate">
                      <div className="session-exercise-name text-lg">
                        {exercise.alternates[0].name}
                      </div>
                      <div className="session-exercise-sets text-lg">
                        {exercise.alternates[0].sets} ×
                        {exercise.alternates[0].repRange}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WorkoutPlanSessions;

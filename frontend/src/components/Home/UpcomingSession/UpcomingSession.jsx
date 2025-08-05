import { useEffect, useState } from "react";
import { getWorkoutPlan, getWorkoutLogs } from "../../../api/workoutApi";
import "./UpcomingSession.css";

const UpcomingSession = () => {
  const [plan, setPlan] = useState(null);
  const [exercises, setExercises] = useState([]);
  const [error, setError] = useState(null);

  // Helper: Get next session order
  const getNextSessionOrder = (logs, totalSessions) => {
    if (!Array.isArray(logs) || logs.length === 0) return 1;
    const completed = logs.map((log) => log.sessionOrder);
    for (let i = 1; i <= totalSessions; i++) {
      if (!completed.includes(i)) return i;
    }
    return 1;
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      const fetchData = async () => {
        try {
          // Fetch workout plan
          const planData = await getWorkoutPlan();
          setPlan(planData);

          const logs = await getWorkoutLogs();
          const totalSessions = planData.sessions.length;
          const nextSessionOrder = getNextSessionOrder(logs, totalSessions);

          // Get exercises for the next session
          const nextSession = planData.sessions.find(
            (session) => session.sessionOrder === nextSessionOrder
          );
          setExercises(nextSession?.exercises || []);
        } catch (err) {
          setError(err.message || "Failed to load session data");
        }
      };

      fetchData();
    }, 1000);

    return () => clearTimeout(timer); // Cleanup on unmount
  }, []);

  return (
    <div className="upcoming-session-container">
      <h3 className="upcoming-session-heading">Upcoming Session</h3>
      {!plan ? (
        <div className="upcoming-session-loading">
          <span className="spinner"></span>
        </div>
      ) : error ? (
        <div className="upcoming-session-error text-lg">{error}</div>
      ) : (
        <>
          <div className="upcoming-session-table">
            <div className="upcoming-session-col">
              <div className="upcoming-session-col-header text-lg">
                Exercise
              </div>
              {exercises.length === 0 ? (
                <div
                  className="upcoming-session-no-exercises text-lg"
                  style={{ gridColumn: "1 / span 3", textAlign: "center" }}
                >
                  No exercises planned.
                </div>
              ) : (
                exercises.map((ex, idx) => (
                  <div
                    key={ex._id || idx}
                    className="upcoming-session-col-cell text-lg"
                  >
                    {ex.name}
                    {ex.alternates?.map((alt, altIdx) => (
                      <span key={altIdx} className="alternate-text">
                        {" "}
                        / {alt.name}
                      </span>
                    ))}
                  </div>
                ))
              )}
            </div>
            <div className="upcoming-session-col">
              <div className="upcoming-session-col-header text-lg">Sets</div>
              {exercises.length === 0
                ? null
                : exercises.map((ex, idx) => (
                    <div
                      key={ex._id || idx}
                      className="upcoming-session-col-cell text-lg"
                    >
                      {ex.sets}
                      {ex.alternates?.map((alt, altIdx) => (
                        <span key={altIdx} className="alternate-text">
                          {" "}
                          / {alt.sets}
                        </span>
                      ))}
                    </div>
                  ))}
            </div>
            <div className="upcoming-session-col">
              <div className="upcoming-session-col-header text-lg">Reps</div>
              {exercises.length === 0
                ? null
                : exercises.map((ex, idx) => (
                    <div
                      key={ex._id || idx}
                      className="upcoming-session-col-cell text-lg"
                    >
                      {ex.repRange || ex.reps}
                      {ex.alternates?.map((alt, altIdx) => (
                        <span key={altIdx} className="alternate-text">
                          {" "}
                          / {alt.repRange || alt.reps}
                        </span>
                      ))}
                    </div>
                  ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default UpcomingSession;

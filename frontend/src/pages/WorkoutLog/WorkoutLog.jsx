// frontend/src/pages/WorkoutLog/WorkoutLog.jsx
import React, { useState, useEffect } from "react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import {
  getWorkoutLogs,
  saveWorkoutLog,
  getWorkoutPlan,
  clearWorkoutApiCache,
} from "../../api/workoutApi";
import Navbar from "../../components/Navbar/Navbar";
import ExerciseLog from "../../components/WorkoutLog/ExerciseLog/ExerciseLog";
import SavedExercises from "../../components/WorkoutLog/SavedExercises/SavedExercises";
import ExerciseSelector from "../../components/WorkoutLog/ExerciseSelector/ExerciseSelector";
import SetForm from "../../components/WorkoutLog/SetForm/SetForm";
import "./WorkoutLog.css";

const WorkoutLog = ({ user }) => {
  const [upcomingSession, setUpcomingSession] = useState(null);
  const [exerciseLogs, setExerciseLogs] = useState({});
  const [selectedExercise, setSelectedExercise] = useState(null);

  const [currentLogs, setCurrentLogs] = useState([]);
  const [selectedLog, setSelectedLog] = useState(null);

  // SHARED STATE
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get the upcoming session (always the next one to be performed)
  const getUpcomingSession = async () => {
    try {
      // Get the workout plan
      const plan = await getWorkoutPlan();
      if (!plan?.sessions?.length) {
        throw new Error("No workout sessions found in plan");
      }

      // Get all logs to find the most recent session
      const logs = await getWorkoutLogs();

      // Find the next session from the plan
      let nextSessionOrder = 1; // Default to first session

      if (logs.length > 0) {
        // Get the most recent log's session order
        const lastSessionOrder = Math.max(
          ...logs.map((log) => log.sessionOrder)
        );
        // Find the next session in the plan
        nextSessionOrder = (lastSessionOrder % plan.sessions.length) + 1;
      }

      // Find the next session in the plan
      const nextSession =
        plan.sessions.find(
          (session) => session.sessionOrder === nextSessionOrder
        ) || plan.sessions[0]; // Fallback to first session if not found

      return {
        ...nextSession,
        isUpcoming: true,
      };
    } catch (err) {
      console.error("Error getting upcoming session:", err);
      throw err;
    }
  };

  // Initial data load
  useEffect(() => {
    const loadData = async () => {
      try {
        // Load upcoming session for the session form
        const upcoming = await getUpcomingSession();
        setUpcomingSession(upcoming);

        // Load logs for the previous logs section
        const logs = await getWorkoutLogs(true);
        setCurrentLogs(logs);

        // Set the most recent log as selected (if any)
        if (logs.length > 0) {
          setSelectedLog(logs[logs.length - 1]); // Most recent log
        }
      } catch (err) {
        setError("Failed to load workout data");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Reset exercise logs only when upcoming session changes (not when navigating logs)
  useEffect(() => {
    if (upcomingSession) {
      // Always start with empty logs for the upcoming session
      setExerciseLogs({});
      setSelectedExercise(null);
    }
  }, [upcomingSession]);

  const handleExerciseSelect = (exercise) => {
    setSelectedExercise(exercise);
  };

  const handleSaveExercise = (exerciseWithSets) => {
    console.log("Received exercise data:", exerciseWithSets);

    if (!exerciseWithSets || !exerciseWithSets.name) {
      console.error("Invalid exercise data received");
      return;
    }

    const exerciseSets = exerciseWithSets.performedSets || [];

    setExerciseLogs((prev) => ({
      ...prev,
      [exerciseWithSets.name]: exerciseSets.map((set) => ({
        reps: parseFloat(set.reps) || 0,
        weight: parseFloat(set.weight) || 0,
      })),
    }));
    setSelectedExercise(null);
  };

  const handleSaveWorkout = async () => {
    try {
      const exercises = Object.entries(exerciseLogs).map(
        ([name, performedSets]) => ({
          name,
          performedSets: performedSets.map((set) => ({
            reps: parseFloat(set.reps) || 0,
            weight: parseFloat(set.weight) || 0,
          })),
        })
      );

      if (exercises.length === 0) {
        setError("Please add at least one exercise to save the workout");
        return;
      }

      const logData = {
        sessionOrder: upcomingSession.sessionOrder,
        exercises,
      };

      // Save the log
      await saveWorkoutLog(logData);

      // Clear current session form
      setExerciseLogs({});
      setError(null);

      // Clear API cache to ensure fresh data
      clearWorkoutApiCache();

      try {
        // 1. Get fresh logs first
        const logs = await getWorkoutLogs(true);
        setCurrentLogs(logs);

        // 2. Get the next upcoming session
        const nextUpcoming = await getUpcomingSession();
        setUpcomingSession(nextUpcoming);

        // 3. Update selected log to the most recent (the one we just saved)
        if (logs.length > 0) {
          setSelectedLog(logs[logs.length - 1]);
        }
      } catch (err) {
        console.error("Error updating session:", err);
        setError("Failed to update session. Please refresh the page.");
      }
    } catch (err) {
      setError("Failed to save workout log");
      console.error(err);
    }
  };

  const handleCancelExercise = () => {
    setSelectedExercise(null);
  };

  const handleRemoveExercise = (exerciseName) => {
    setExerciseLogs((prev) => {
      const newLogs = { ...prev };
      delete newLogs[exerciseName];
      return newLogs;
    });
  };

  // Navigate through PREVIOUS LOGS only (doesn't affect session form)
  const navigateLogs = (direction) => {
    if (currentLogs.length === 0) return;

    const currentIndex = selectedLog
      ? currentLogs.findIndex((log) => log._id === selectedLog._id)
      : -1;

    let newIndex;
    if (direction === "next") {
      newIndex = currentIndex < currentLogs.length - 1 ? currentIndex + 1 : 0;
    } else {
      newIndex = currentIndex > 0 ? currentIndex - 1 : currentLogs.length - 1;
    }

    // This only affects the previous logs section, NOT the session form
    setSelectedLog(currentLogs[newIndex]);
  };

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="workout-logs-page">
      <Navbar user={user} />
      <div className="workout-logs-container">
        <section className="session-form">
          <h2>Session {upcomingSession?.sessionOrder}</h2>

          {selectedExercise ? (
            <SetForm
              exercise={selectedExercise}
              onSave={handleSaveExercise}
              onCancel={handleCancelExercise}
            />
          ) : (
            <div className="exercise-selection">
              <div className="exercise-selection-header">
                <h4>Select an exercise to log:</h4>
                {Object.keys(exerciseLogs).length > 0 && (
                  <button
                    className="save-workout-btn btn-primary-lg"
                    onClick={handleSaveWorkout}
                  >
                    Save Workout
                  </button>
                )}
              </div>

              <div className="exercise-list">
                {isLoading ? (
                  <div className="loading-spinner">
                    <div className="spinner"></div>
                  </div>
                ) : upcomingSession?.exercises?.length > 0 ? (
                  upcomingSession.exercises.map((exercise, index) => (
                    <ExerciseSelector
                      key={`upcoming-exercise-${exercise._id || index}`}
                      exercise={exercise}
                      onSelect={handleExerciseSelect}
                      isLogged={!!exerciseLogs[exercise.name]}
                    />
                  ))
                ) : (
                  <p className="text-lg">
                    No exercises scheduled for this session.
                  </p>
                )}
              </div>

              <SavedExercises
                exerciseLogs={exerciseLogs}
                onRemoveExercise={handleRemoveExercise}
              />
            </div>
          )}
        </section>

        <section className="previous-logs">
          <div className="log-navigation">
            <button
              onClick={() => navigateLogs("next")}
              className="btn-fab-md icon-button"
              aria-label="Next"
            >
              <ChevronLeftIcon />
            </button>
            <h2>Previous Workouts</h2>
            <button
              onClick={() => navigateLogs("prev")}
              className="btn-fab-md icon-button"
              aria-label="Previous"
            >
              <ChevronRightIcon />
            </button>
          </div>

          {isLoading ? (
            <div className="loading-spinner">
              <div className="spinner"></div>
            </div>
          ) : currentLogs.length > 0 ? (
            selectedLog ? (
              <div className="log-details">
                <div className="log-header">
                  <h3>Session {selectedLog.sessionOrder}</h3>
                  <span className="log-date text-lg">
                    {new Date(selectedLog.date).toLocaleDateString()}
                  </span>
                </div>

                {selectedLog.exercises?.length > 0 ? (
                  <div className="log-exercises">
                    {selectedLog.exercises.map((exercise, index) => (
                      <ExerciseLog
                        key={`log-${selectedLog._id}-${index}`}
                        exercise={exercise}
                      />
                    ))}
                  </div>
                ) : (
                  <h4>No exercises logged for this session.</h4>
                )}
              </div>
            ) : (
              <h4>No log selected</h4>
            )
          ) : (
            <h4>No workout logs available yet.</h4>
          )}
        </section>
      </div>
    </div>
  );
};

export default WorkoutLog;

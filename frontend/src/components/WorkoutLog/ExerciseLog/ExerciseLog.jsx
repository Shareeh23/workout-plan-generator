// frontend/src/components/WorkoutLog/ExerciseLog.jsx
import React from "react";
import "./ExerciseLog.css";

const ExerciseLog = ({ exercise }) => {
  return (
    <div className="log-exercise-item">
      <h4 className="exercise-name">{exercise.name}</h4>
      {exercise.performedSets?.length > 0 && (
        <div className="exercise-sets">
          {exercise.performedSets.map((set, setIndex) => (
            <div key={setIndex} className="exercise-set">
              <h4>Set {setIndex + 1}</h4>
              <h4>{set.weight} kg</h4>
              <h4>{set.reps} Reps</h4>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ExerciseLog;

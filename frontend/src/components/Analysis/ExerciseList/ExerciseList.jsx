import React from 'react';
import './ExerciseList.css';

const ExerciseList = ({ 
  exercises = [], 
  selectedExercise, 
  onExerciseClick 
}) => {
  return (
    <div className="exercise-btns-container">
      {exercises.map((exercise) => (
        <button
          key={exercise.name}
          onClick={() => onExerciseClick(exercise.name)}
          className={`exercise-button btn-primary-md ${
            selectedExercise === exercise.name ? "active" : ""
          }`}
        >
          {exercise.name}
          {exercise.category && (
            <span className="category-tag">{exercise.category}</span>
          )}
        </button>
      ))}
    </div>
  );
};

export default ExerciseList;

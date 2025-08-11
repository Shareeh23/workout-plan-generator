import React, { useState } from "react";
import "./ExerciseSelector.css";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { CheckIcon } from "@heroicons/react/24/solid";

const ExerciseSelector = ({ exercise, onSelect, isLogged = false }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasAlternates = exercise.alternates && exercise.alternates.length > 0;

  return (
    <div className="exercise-selector">
      <button
        className={`exercise-main-btn ${isLogged ? "logged" : ""}`}
        onClick={() => onSelect(exercise)}
      >
        <span className="exercise-text text-lg">{exercise.name}</span>
        {isLogged && <CheckIcon className="logged-indicator" />}
      </button>

      {hasAlternates && (
        <>
          <button
            className="toggle-alternatives text-md"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <ChevronDownIcon
              className={`toggle-btn-icon transition-transform ${
                isExpanded ? "transform rotate-180" : ""
              }`}
            />
            <span>Alternatives</span>
          </button>

          {isExpanded && (
            <div className="alternative-exercises">
              {exercise.alternates.map((alt, index) => (
                <button
                  key={`${alt.name}-${index}`}
                  className="exercise-alt-btn text-lg"
                  onClick={() => onSelect(alt)}
                >
                  {alt.name}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ExerciseSelector;

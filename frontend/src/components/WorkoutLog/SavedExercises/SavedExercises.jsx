import React from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import './SavedExercises.css';

const SavedExercises = ({ exerciseLogs, onRemoveExercise }) => {
  if (Object.keys(exerciseLogs).length === 0) {
    return null;
  }

  return (
    <div className="saved-exercises">
      <h4 className="exercise-to-log">Exercises to log:</h4>
      <ul>
        {Object.entries(exerciseLogs).map(([name, sets]) => (
          <li key={name} className="text-md">
            <div className="exercise-item">
              <span>
                {name}: {sets.length} set
                {sets.length !== 1 ? 's' : ''}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRemoveExercise(name);
                }}
                className="removal-btn btn-fab-sm"
                aria-label={`Remove ${name} from workout`}
              >
                <XMarkIcon className="x-icon" />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SavedExercises;

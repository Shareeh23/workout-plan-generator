import React from 'react';
import { ExerciseForm } from './ExerciseForm';

const MUSCLE_GROUPS = [
  "Neck",
  "Traps",
  "Front Delts",
  "Side Delts",
  "Rear Delts",
  "Chest",
  "Upper Back",
  "Lats",
  "Biceps",
  "Triceps",
  "Forearms",
  "Abs",
  "Lower Back",
  "Glutes",
  "Quads",
  "Hamstrings",
  "Calves",
];

const INITIAL_EXERCISE = {
  name: '',
  sets: 3,
  repRange: '8-12',
  alternates: []
};

export const SessionForm = ({ session, index, onChange, onRemove}) => {
  const addExercise = () => {
    const updatedExercises = [...session.exercises, { ...INITIAL_EXERCISE }];
    onChange('exercises', updatedExercises);
  };

  const updateExercise = (exerciseIndex, field, value) => {
    const updatedExercises = [...session.exercises];
    updatedExercises[exerciseIndex] = {
      ...updatedExercises[exerciseIndex],
      [field]: value
    };
    onChange('exercises', updatedExercises);
  };

  const removeExercise = (exerciseIndex) => {
    if (session.exercises.length > 1) {
      const updatedExercises = session.exercises.filter(
        (_, i) => i !== exerciseIndex
      );
      onChange('exercises', updatedExercises);
    }
  };

  return (
    <div className="session-form">
      <div className="session-header">
        <h3>Session {index + 1}</h3>
        {onRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="remove-btn btn-text-md"
          >
            Remove Session
          </button>
        )}
      </div>

      <div className="workout-plan-field">
        <label className="workout-plan-label text-md">Focus Areas</label>
        <div className="muscle-group-tags">
          {MUSCLE_GROUPS.map((muscle) => (
            <span
              key={muscle}
              className={`muscle-tag text-md ${
                session.focusAreas?.includes(muscle) ? 'selected' : ''
              }`}
              onClick={() => {
                const newFocusAreas = session.focusAreas?.includes(muscle)
                  ? session.focusAreas.filter((m) => m !== muscle)
                  : [...(session.focusAreas || []), muscle];
                onChange('focusAreas', newFocusAreas);
              }}
            >
              {muscle}
            </span>
          ))}
        </div>
      </div>

      <div className="exercises-container">
        <h4>Exercises</h4>
        {session.exercises?.map((exercise, exIndex) => (
          <ExerciseForm
            key={exIndex}
            exercise={exercise}
            index={exIndex}
            onChange={(field, value) => updateExercise(exIndex, field, value)}
            onRemove={() => removeExercise(exIndex)}
          />
        ))}
        <button
          type="button"
          onClick={addExercise}
          className="add-btn btn-text-md"
        >
          + Add Exercise
        </button>
      </div>

      <div className="workout-plan-field">
        <label className="workout-plan-label text-md">Session Notes</label>
        <textarea
          value={session.notes || ''}
          onChange={(e) => onChange('notes', e.target.value)}
          className="workout-plan-input"
          rows="10"
        />
      </div>
    </div>
  );
};

export default SessionForm;
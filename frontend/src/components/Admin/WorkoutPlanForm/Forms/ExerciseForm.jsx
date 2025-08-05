import React from 'react';

export const ExerciseForm = ({ exercise, index, onChange, onRemove }) => {
  const addAlternate = () => {
    const updatedAlternates = [...(exercise.alternates || []), { 
      name: '', 
      sets: 3, 
      repRange: '8-12' 
    }];
    onChange('alternates', updatedAlternates);
  };

  const updateAlternate = (altIndex, field, value) => {
    const updatedAlternates = [...exercise.alternates];
    updatedAlternates[altIndex] = { ...updatedAlternates[altIndex], [field]: value };
    onChange('alternates', updatedAlternates);
  };

  const removeAlternate = (altIndex) => {
    const updatedAlternates = exercise.alternates.filter((_, idx) => idx !== altIndex);
    onChange('alternates', updatedAlternates);
  };

  return (
    <div className="exercise-form">
      <div className="exercise-header">
        <h4>Exercise {index + 1}</h4>
        {onRemove && (
          <button type="button" onClick={onRemove} className="remove-btn btn-text-md">
            Remove
          </button>
        )}
      </div>
      
      <div className="workout-plan-fields">
        <div className="workout-plan-field">
          <label className="workout-plan-label text-md">Exercise Name</label>
          <input
            type="text"
            value={exercise.name}
            onChange={(e) => onChange('name', e.target.value)}
            className="workout-plan-input"
            required
          />
        </div>
        
        <div className="workout-plan-field">
          <label className="workout-plan-label text-md">Sets</label>
          <input
            type="number"
            min="1"
            value={exercise.sets}
            onChange={(e) => onChange('sets', parseInt(e.target.value, 10))}
            className="workout-plan-input"
            required
          />
        </div>
        
        <div className="workout-plan-field">
          <label className="workout-plan-label text-md">Rep Range</label>
          <input
            type="text"
            value={exercise.repRange}
            onChange={(e) => onChange('repRange', e.target.value)}
            className="workout-plan-input"
            required
          />
        </div>
      </div>
      
      {/* Alternate Exercises */}
      <div className="alternates-section">
        {exercise.alternates?.map((alt, altIndex) => (
          <div key={altIndex} className="alternate-exercise">
            <div className="workout-plan-fields">
              <div className="workout-plan-field">
                <label className="workout-plan-label text-sm">Alternate {altIndex + 1}</label>
                <input
                  type="text"
                  value={alt.name}
                  onChange={(e) => updateAlternate(altIndex, 'name', e.target.value)}
                  className="workout-plan-input"
                  placeholder="Alternate exercise name"
                  required
                />
              </div>
              
              <div className="workout-plan-field">
                <label className="workout-plan-label text-sm">Sets</label>
                <input
                  type="number"
                  min="1"
                  value={alt.sets}
                  onChange={(e) => updateAlternate(altIndex, 'sets', parseInt(e.target.value, 10))}
                  className="workout-plan-input"
                  required
                />
              </div>
              
              <div className="workout-plan-field">
                <label className="workout-plan-label text-sm">Rep Range</label>
                <input
                  type="text"
                  value={alt.repRange}
                  onChange={(e) => updateAlternate(altIndex, 'repRange', e.target.value)}
                  className="workout-plan-input"
                  required
                />
              </div>
              
              <button 
                type="button" 
                onClick={() => removeAlternate(altIndex)}
                className="remove-btn btn-text-sm"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
        
        <button
          type="button"
          onClick={addAlternate}
          className="add-btn btn-text-sm"
        >
          + Add Alternate Exercise
        </button>
      </div>
    </div>
  );
};

export default ExerciseForm;
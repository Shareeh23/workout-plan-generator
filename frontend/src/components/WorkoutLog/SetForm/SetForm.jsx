import React, { useState } from "react";
import "./SetForm.css";
import { XMarkIcon } from "@heroicons/react/24/solid";

const SetForm = ({ exercise, onSave, onCancel }) => {
  const [sets, setSets] = useState([{ weight: 0, reps: 0 }]);

  const handleAddSet = () => {
    setSets([...sets, { weight: 0, reps: 0 }]);
  };

  const handleRemoveSet = (index) => {
    if (sets.length > 1) {
      const newSets = [...sets];
      newSets.splice(index, 1);
      setSets(newSets);
    }
  };

  const handleSetChange = (index, field, value) => {
    const newValue = field === 'reps' ? parseInt(value) || 0 : parseFloat(value) || 0;
    const newSets = [...sets];
    newSets[index] = { ...newSets[index], [field]: newValue };
    setSets(newSets);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Filter out empty sets and ensure proper number types
    const validSets = sets
      .filter(set => set.reps > 0 || set.weight > 0)
      .map(set => ({
        reps: parseInt(set.reps) || 0,
        weight: parseFloat(set.weight) || 0
      }));

    if (validSets.length === 0) {
      alert('Please add at least one valid set');
      return;
    }

    onSave({
      name: exercise.name,
      performedSets: validSets
    });
  };

  return (
    <div className="set-form-container">
      <div className="set-form-header">
        <h4 className="exercise-name">{exercise.name}</h4>
        <button
          type="button"
          onClick={onCancel}
          className="btn-fab-md"
          aria-label="Close form"
        >
          <XMarkIcon className="close-btn-icon" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="set-form">
        <div className="sets-list">
          {sets.map((set, index) => (
            <div key={index} className="set-row">
              <span className="set-number text-md">Set {index + 1}</span>
              <div className="input">
                <input
                  type="number"
                  min="0"
                  step="0.5"
                  id={`weight-${index}`}
                  className="text-sm"
                  value={set.weight}
                  placeholder="75"
                  onChange={(e) =>
                    handleSetChange(index, "weight", e.target.value)
                  }
                  required
                />
                <label htmlFor={`weight-${index}`} className="input-label text-md">
                  kg
                </label>
              </div>
              <div className="input">
                <input
                  type="number"
                  min="1"
                  step="1"
                  id={`reps-${index}`}
                  className="text-sm"
                  value={set.reps}
                  placeholder="12"
                  onChange={(e) =>
                    handleSetChange(index, "reps", e.target.value)
                  }
                  required
                />
                <label htmlFor={`reps-${index}`} className="input-label text-md">
                  reps
                </label>
              </div>
              {sets.length > 1 && (
                <button
                  type="button"
                  className="remove-btn btn-fab-sm"
                  onClick={() => handleRemoveSet(index)}
                  aria-label={`Remove set ${index + 1}`}
                >
                  <XMarkIcon className="remove-btn-icon" />
                </button>
              )}
            </div>
          ))}
        </div>

        <div className="button-groups">
          <button
            type="button"
            className="add-set-btn btn-secondary-md"
            onClick={handleAddSet}
          >
            <span className="plus-text text-md">+</span>
            <span className="add-text text-md">Add Set</span>
          </button>
          <button type="submit" className="save-set-btn btn-primary-md">
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default SetForm;

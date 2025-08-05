import React from "react";

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

const MuscleGroupSelector = ({ selected = [], onChange, label }) => {
  const toggleMuscle = (muscle) => {
    const newSelection = selected.includes(muscle)
      ? selected.filter((m) => m !== muscle)
      : [...selected, muscle];
    onChange(newSelection);
  };

  return (
    <div className="workout-plan-field">
      <label className="workout-plan-label text-md">{label}</label>
      <div className="muscle-group-tags">
        {MUSCLE_GROUPS.map((muscle) => (
          <span
            key={muscle}
            className={`muscle-tag text-md ${
              selected.includes(muscle) ? "selected" : ""
            }`}
            onClick={() => toggleMuscle(muscle)}
          >
            {muscle}
          </span>
        ))}
      </div>
    </div>
  );
};

export default MuscleGroupSelector;

import React, { useState } from "react";
import "./WorkoutPlanForm.css";
import SessionForm from "./Forms/SessionForm";
import MuscleGroupSelector from "./Forms/MuscleGroupSelector";

const INITIAL_SESSION = {
  name: "",
  focusAreas: [],
  exercises: [
    {
      name: "",
      sets: 3,
      repRange: "8-12",
      alternates: [],
    },
  ],
  notes: "",
};

const WorkoutPlanForm = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    planName: "",
    programTheme: "",
    trainingDays: 3,
    prioritizedMuscles: [],
    neutralPoints: [],
    weakPoints: [],
    sessions: [{ ...INITIAL_SESSION }],
  });
  const [activeTab, setActiveTab] = useState("basic");

  const updateFormData = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const updateSession = (sessionIndex, field, value) => {
    const updatedSessions = [...formData.sessions];
    updatedSessions[sessionIndex] = {
      ...updatedSessions[sessionIndex],
      [field]: value,
    };
    updateFormData("sessions", updatedSessions);
  };

  const addSession = () => {
    if (formData.sessions.length < 7) {
      updateFormData("sessions", [
        ...formData.sessions,
        { ...INITIAL_SESSION, name: `Session ${formData.sessions.length + 1}` },
      ]);
    }
  };

  const removeSession = (index) => {
    if (formData.sessions.length > 1) {
      const updatedSessions = formData.sessions.filter((_, i) => i !== index);
      updateFormData("sessions", updatedSessions);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const planData = {
        planName: formData.planName,
        programTheme: formData.programTheme,
        trainingDays: formData.trainingDays,
        prioritizedMuscles: formData.prioritizedMuscles,
        neutralPoints: formData.neutralPoints || [],
        weakPoints: formData.weakPoints || [],
        sessions: formData.sessions.map((session, index) => ({
          sessionOrder: index + 1,
          focusAreas: session.focusAreas || [],
          exercises: session.exercises.map((exercise) => ({
            name: exercise.name,
            sets: exercise.sets,
            repRange: exercise.repRange,
            alternates: (exercise.alternates || []).map((alt) => ({
              name: alt.name,
              sets: alt.sets,
              repRange: alt.repRange,
            })),
          })),
          notes: session.notes || "",
        })),
      };
  
      const isMultipart = formData.imageUrl instanceof File;
      let dataToSend = planData;
  
      if (isMultipart) {
        const formDataToSend = new FormData();
        formDataToSend.append('image', formData.imageUrl);
        formDataToSend.append('planData', JSON.stringify(planData));
        dataToSend = formDataToSend;
      }
  
      if (onSubmit) {
        await onSubmit(dataToSend, isMultipart);
      }
    } catch (error) {
      console.error("Error in form submission:", error);
    }
  };

  return (
    <form
      className="workout-plan-form"
      onSubmit={handleSubmit}
      encType="multipart/form-data"
    >
      <div className="form-tabs">
        <button
          type="button"
          className={`tab-btn btn-text-lg ${
            activeTab === "basic" ? "active" : ""
          }`}
          onClick={() => setActiveTab("basic")}
        >
          Basic Info
        </button>
        <button
          type="button"
          className={`tab-btn btn-text-lg ${
            activeTab === "sessions" ? "active" : ""
          }`}
          onClick={() => setActiveTab("sessions")}
        >
          Training Sessions
        </button>
      </div>

      <div className="tab-content">
        {activeTab === "basic" ? (
          <div className="basic-info">
            <div className="workout-plan-fields">
              <div className="workout-plan-field">
                <label className="workout-plan-label text-md">Plan Name</label>
                <input
                  type="text"
                  value={formData.planName}
                  onChange={(e) => updateFormData("planName", e.target.value)}
                  placeholder="e.g., Guts Workout Plan"
                  className="workout-plan-input"
                  required
                />
              </div>

              <div className="workout-plan-field">
                <label className="workout-plan-label text-md">
                  Program Theme
                </label>
                <input
                  type="text"
                  value={formData.programTheme}
                  onChange={(e) =>
                    updateFormData("programTheme", e.target.value)
                  }
                  placeholder="e.g., Guts From Berserk"
                  className="workout-plan-input"
                  required
                />
              </div>

              <div className="workout-plan-field">
                <label className="workout-plan-label text-md">
                  Training Days Per Week (3-6)
                </label>
                <input
                  type="number"
                  min="3"
                  max="6"
                  value={formData.trainingDays}
                  onChange={(e) =>
                    updateFormData("trainingDays", parseInt(e.target.value, 10))
                  }
                  className="workout-plan-input"
                  required
                />
              </div>

              <div className="workout-plan-field">
                <label className="workout-plan-label text-md">Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      updateFormData("imageUrl", e.target.files[0]);
                    }
                  }}
                  className="workout-plan-input"
                  required
                />
              </div>
            </div>
            <MuscleGroupSelector
              selected={formData.prioritizedMuscles}
              onChange={(value) => updateFormData("prioritizedMuscles", value)}
              label="Strong Points"
            />

            <MuscleGroupSelector
              selected={formData.neutralPoints}
              onChange={(value) => updateFormData("neutralPoints", value)}
              label="Neutral Points"
            />

            <MuscleGroupSelector
              selected={formData.weakPoints}
              onChange={(value) => updateFormData("weakPoints", value)}
              label="Weak Points"
            />
          </div>
        ) : (
          <div className="sessions-info">
            {formData.sessions.map((session, index) => (
              <SessionForm
                key={index}
                session={session}
                index={index}
                onChange={(field, value) => updateSession(index, field, value)}
                onRemove={() => removeSession(index)}
                isLast={index === formData.sessions.length - 1}
              />
            ))}

            {formData.sessions.length < 7 && (
              <button
                type="button"
                onClick={addSession}
                className="add-btn btn-text-lg"
              >
                + Add Training Session
              </button>
            )}
          </div>
        )}
      </div>

      <div className="form-actions">
        <button
          type="button"
          onClick={onCancel}
          className="cancel-btn btn-secondary-lg"
        >
          Cancel
        </button>
        <button type="submit" className="save-btn btn-primary-lg">
          Save Workout Plan
        </button>
      </div>
    </form>
  );
};

export default WorkoutPlanForm;

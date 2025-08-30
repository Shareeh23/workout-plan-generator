// frontend/src/components/NutritionProfileForm/NutritionProfileForm.jsx
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import "./NutritionProfileForm.css";
import "../../styles/config-form.css";

const GENDER_OPTIONS = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "other", label: "Other" },
];

const ACTIVITY_LEVELS = [
  { value: "sedentary", label: "Sedentary (little or no exercise)" },
  { value: "light", label: "Light (exercise 1-3 days/week)" },
  { value: "moderate", label: "Moderate (exercise 3-5 days/week)" },
  { value: "active", label: "Active (exercise 6-7 days/week)" },
  { value: "very_active", label: "Very Active (hard exercise 6-7 days/week)" },
];

const GOAL_OPTIONS = [
  { value: "lose", label: "Lose Weight" },
  { value: "maintain", label: "Maintain Weight" },
  { value: "gain", label: "Gain Weight" },
];

const MACRO_SPLITS = [
  { value: "40-30-30", label: "Balanced (40% C / 30% F / 30% P)" },
  { value: "50-25-25", label: "Higher Carb (50% C / 25% F / 25% P)" },
  { value: "60-20-20", label: "High Carb (60% C / 20% F / 20% P)" },
];

const NutritionProfileForm = ({
  initialData = {
    gender: "male",
    age: "",
    height: "",
    weight: "",
    activityLevel: "moderate",
    goal: "maintain",
    macroSplit: "40-30-30",
  },
  onSubmit,
  isSubmitting = false,
  hasProfile = false,
  onTabChange = () => {},
  activeTab = "basic",
}) => {
  const { register, handleSubmit, reset } = useForm({
    defaultValues: initialData,
  });

  // Reset form when initialData changes
  useEffect(() => {
    reset(initialData);
  }, [initialData, reset]);

  const handleFormSubmit = async (data) => {
    const profileData = {
      ...data,
      weight: parseFloat(data.weight),
      height: parseFloat(data.height),
      age: parseInt(data.age, 10),
    };

    await onSubmit(profileData, hasProfile);
  };

  return (
    <div className="nutrition-profile-form-container">
      <form
        onSubmit={handleSubmit(handleFormSubmit)}
        className="nutrition-profile-form"
      >
        {/* Tab Navigation */}
        <div className="tabs">
          <button
            className={`tab btn-text-lg ${
              activeTab === "basic" ? "active" : ""
            }`}
            type="button"
            onClick={() => onTabChange("basic")}
          >
            Basic Information
          </button>
          <button
            className={`tab btn-text-lg ${
              activeTab === "advanced" ? "active" : ""
            }`}
            type="button"
            onClick={() => onTabChange("advanced")}
          >
            Fitness Goals
          </button>
        </div>

        <div className="config-form-content">
          {isSubmitting ? (
            <div className="spinner-overlay">
              <span className="spinner"></span>
            </div>
          ) : (
            <>
              {/* Basic Information Tab */}
              {activeTab === "basic" && (
                <div className="tab-content active">
                  <div className="config-form-section">
                    <div className="config-input-group">
                      <label className="config-form-label text-md">
                        Gender
                      </label>
                      <select
                        className="config-form-select"
                        {...register("gender")}
                      >
                        {GENDER_OPTIONS.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="config-input-group">
                      <label className="config-form-label text-md">
                        Age (years)
                      </label>
                      <input
                        className="config-form-input"
                        type="number"
                        min="18"
                        max="80"
                        placeholder="25"
                        {...register("age", { valueAsNumber: true })}
                      />
                    </div>

                    <div className="config-input-group">
                      <label className="config-form-label text-sm">
                        Height (cm)
                      </label>
                      <input
                        className="config-form-input"
                        type="number"
                        min="120"
                        max="230"
                        placeholder="180"
                        {...register("height", { valueAsNumber: true })}
                      />
                    </div>

                    <div className="config-input-group">
                      <label className="config-form-label text-md">
                        Weight (kg)
                      </label>
                      <input
                        className="config-form-input"
                        type="number"
                        step="1"
                        min="40"
                        max="250"
                        placeholder="85"
                        {...register("weight", { valueAsNumber: true })}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Fitness Goals Tab */}
              {activeTab === "advanced" && (
                <div className="tab-content active">
                  <div className="config-form-section">
                    <div className="config-input-group">
                      <label className="config-form-label text-md">
                        Activity Level
                      </label>
                      <select
                        className="config-form-select"
                        {...register("activityLevel", {
                          required: "Activity level is required",
                        })}
                      >
                        {ACTIVITY_LEVELS.map((level) => (
                          <option key={level.value} value={level.value}>
                            {level.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="config-input-group">
                      <label className="config-form-label text-md">Goal</label>
                      <select
                        className="config-form-select"
                        {...register("goal")}
                      >
                        {GOAL_OPTIONS.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="config-input-group">
                      <label className="config-form-label text-md">
                        Macro Split
                      </label>
                      <select
                        className="config-form-select"
                        {...register("macroSplit")}
                      >
                        {MACRO_SPLITS.map((split) => (
                          <option key={split.value} value={split.value}>
                            {split.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        <div className="config-form-actions">
          {activeTab === "advanced" && (
            <button
              type="submit"
              className="btn-primary-lg"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? "Saving..."
                : hasProfile
                ? "Update Profile"
                : "Create Profile"}
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default NutritionProfileForm;

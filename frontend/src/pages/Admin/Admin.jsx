import React, { useState, useEffect } from "react";
import UserTable from "../../components/Admin/UserTable/UserTable";
import WorkoutPlanForm from "../../components/Admin/WorkoutPlanForm/WorkoutPlanForm";
import { getUsers, createWorkoutPlan } from "../../services/adminService";
import { XMarkIcon } from "@heroicons/react/24/outline";
import "./Admin.css";

const Admin = () => {
  const [activeTab, setActiveTab] = useState("users");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [formResetKey, setFormResetKey] = useState(0);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await getUsers();
      setUsers(response || []);
      setMessage({ text: "", type: "" }); // Clear any previous messages
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Failed to load users";
      setMessage({ text: errorMessage, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "users") {
      fetchUsers();
    }
  }, [activeTab]);

  const handleSubmitWorkoutPlan = async (data, isMultipart = false) => {
    try {
      setSubmitting(true);
      setMessage({ text: "", type: "" }); // Clear previous messages
      const response = await createWorkoutPlan(data, isMultipart);
      setMessage({ 
        text: response.message || "Workout plan created successfully!", 
        type: "success" 
      });
      setFormResetKey((prev) => prev + 1);
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to create workout plan";
      setMessage({ text: errorMessage, type: "error" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancelWorkoutPlan = () => {
    // Reset form by changing the key
    setFormResetKey((prev) => prev + 1);
    setMessage({ text: "Form has been reset", type: "info" });
  };

  return (
    <div className="admin-container">
      {/* Toast Message */}
      {message.text && (
        <div
          className={`toast-message ${message.type}`}
          role="alert"
          aria-live="assertive"
          aria-atomic="true"
        >
          <span>{message.text}</span>
          <button
            onClick={() => setMessage({ text: "", type: "" })}
            aria-label="Close"
            className="toast-close-btn"
          >
            <XMarkIcon
              style={{
                color: message.type === "success" ? "#166534" : 
                       message.type === "error" ? "#b91c1c" : "#0369a1",
                width: "1.5rem",
                height: "1.5rem",
              }}
            />
          </button>
        </div>
      )}

      <div className="admin-content">
        <h1 className="admin-title">Admin Dashboard</h1>
        
        <div className="admin-tabs">
          <button
            className={`tab-btn btn-text-lg ${
              activeTab === "users" ? "active" : ""
            }`}
            onClick={() => setActiveTab("users")}
          >
            User Management
          </button>
          <button
            className={`tab-btn btn-text-lg ${
              activeTab === "workouts" ? "active" : ""
            }`}
            onClick={() => setActiveTab("workouts")}
          >
            Workout Plans
          </button>
        </div>

        <div className="tab-content">
          {activeTab === "users" && (
            <div className="users-tab">
              <div className="section-header">
                <h2 className="section-heading">User Management</h2>
              </div>
              <UserTable
                users={users}
                loading={loading}
                error={message.type === "error" ? message.text : null}
              />
            </div>
          )}
          {activeTab === "workouts" && (
            <div className="workouts-tab">
              <div className="section-header">
                <h2 className="section-heading">Create New Workout Plan</h2>
              </div>
              <WorkoutPlanForm
                key={formResetKey}
                onSubmit={handleSubmitWorkoutPlan}
                onCancel={handleCancelWorkoutPlan}
                submitting={submitting}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Admin;
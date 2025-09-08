import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import "../../styles/config-form.css";
import "./UserProfileForm.css";

const UserProfileForm = ({
  initialData = { name: "", email: "" },
  onSubmit,
  isSubmitting = false,
  onResetSuccess = () => {}
}) => {
  const [showPassword, setShowPassword] = useState({
    currentPassword: false,
    newPassword: false,
  });

  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      name: initialData.name || "",
      email: initialData.email || "",
      currentPassword: "",
      newPassword: ""
    }
  });

  const togglePasswordVisibility = (field) => {
    setShowPassword((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  // Prevent autofill for password fields
  const preventAutoFill = (e) => {
    e.target.setAttribute("readonly", "readonly");
    setTimeout(() => e.target.removeAttribute("readonly"), 100);
  };

  // Reset form when initialData changes
  useEffect(() => {
    reset({
      name: initialData.name || "",
      email: initialData.email || "",
      currentPassword: "",
      newPassword: ""
    });
  }, [initialData, reset]);

  const handleFormSubmit = async (data) => {
    // Only include password fields if they have values
    const submitData = {
      name: data.name,
      email: data.email,
      ...(data.currentPassword && { currentPassword: data.currentPassword }),
      ...(data.newPassword && { newPassword: data.newPassword })
    };
    
    const success = await onSubmit(submitData);
    
    // Clear password fields on successful submission
    if (success) {
      reset({
        name: data.name,
        email: data.email,
        currentPassword: "",
        newPassword: ""
      });
      onResetSuccess();
    }
  };

  if (isSubmitting) {
    return (
      <div className="user-profile-form-container">
        <div className="spinner-overlay">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="user-profile-form-container">
      <form onSubmit={handleSubmit(handleFormSubmit)} className="user-profile-form">
        <div className="config-form-section">
          <div className="config-input-group">
            <label htmlFor="name" className="config-form-label text-md">
              Name
            </label>
            <input
              id="name"
              type="text"
              className="config-form-input"
              placeholder="John Doe"
              {...register("name", { required: "Name is required" })}
            />
          </div>

          <div className="config-input-group">
            <label htmlFor="email" className="config-form-label text-md">
              Email
            </label>
            <input
              id="email"
              type="email"
              className="config-form-input"
              placeholder="johndoe@gmail.com"
              {...register("email")}
            />
          </div>

          <div className="config-input-group">
            <label
              htmlFor="currentPassword"
              className="config-form-label text-md"
            >
              Current Password
            </label>
            <div className="password-input-container">
              <input
                id="currentPassword"
                type={showPassword.currentPassword ? "text" : "password"}
                className="password-input"
                placeholder="********"
                autoComplete="new-password"
                onFocus={preventAutoFill}
                {...register("currentPassword")}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => togglePasswordVisibility("currentPassword")}
                aria-label={
                  showPassword.currentPassword
                    ? "Hide password"
                    : "Show password"
                }
              >
                {showPassword.currentPassword ? (
                  <EyeSlashIcon className="eye-icon" />
                ) : (
                  <EyeIcon className="eye-icon" />
                )}
              </button>
            </div>
          </div>

          <div className="config-input-group">
            <label htmlFor="newPassword" className="config-form-label text-md">
              New Password
            </label>
            <div className="password-input-container">
              <input
                id="newPassword"
                type={showPassword.newPassword ? "text" : "password"}
                className="password-input"
                placeholder="********"
                autoComplete="new-password"
                onFocus={preventAutoFill}
                {...register("newPassword")}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => togglePasswordVisibility("newPassword")}
                aria-label={
                  showPassword.newPassword ? "Hide password" : "Show password"
                }
              >
                {showPassword.newPassword ? (
                  <EyeSlashIcon className="eye-icon" />
                ) : (
                  <EyeIcon className="eye-icon" />
                )}
              </button>
            </div>
          </div>

          <div className="config-form-actions">
            <button
              type="submit"
              disabled={isSubmitting}
              className="config-save-btn btn-primary-lg"
            >
              {isSubmitting ? (
                <>
                  <span className="btn-spinner"></span>
                </>
              ) : (
                "Update Profile"
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default UserProfileForm;

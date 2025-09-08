import React from "react";
import { useNavigate } from "react-router-dom";
import PasswordResetForm from "../../components/auth/PasswordResetForm/PasswordResetForm";
import { toast } from "sonner";
import "./ResetPassword.css";

const ResetPassword = () => {
  const navigate = useNavigate();

  const handleSuccess = () => {
    toast.success("Password reset successful! Redirecting to login...");
    setTimeout(() => {
      navigate("/login");
    }, 2000);
  };

  return (
    <div className="reset-password-page">
      <div className="reset-password-container">
        <div className="reset-password-header">
          <h2>Reset Password</h2>
          <p className="header-desc-text text-lg">
            Enter your details to reset your password
          </p>
        </div>

        <PasswordResetForm onSuccess={handleSuccess} />
      </div>
    </div>
  );
};

export default ResetPassword;

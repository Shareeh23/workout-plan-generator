import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  forgotPassword,
  verifyResetOtp,
  resetPassword,
} from "../../../api/auth";
import { toast } from "sonner";
import {
  LockClosedIcon,
  LockOpenIcon,
  EnvelopeIcon,
  ArrowLeftIcon,
} from "@heroicons/react/24/outline";
import "./PasswordResetForm.css";

const PasswordResetForm = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { success, error, validationErrors, message } =
        await forgotPassword(email);
      if (success) {
        if (message) toast.success(message);
        setStep(2);
      } else if (error) {
        if (validationErrors?.length > 0) {
          validationErrors.forEach((err) => toast.error(err.msg || err));
        } else {
          toast.error(error);
        }
      }
    } catch (error) {
      toast.error(error?.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();

    setIsLoading(true);
    try {
      const { success, error, validationErrors, message } =
        await verifyResetOtp(email, otp);
      if (success) {
        if (message) toast.success(message);
        setStep(3);
      } else if (error) {
        if (validationErrors?.length > 0) {
          validationErrors.forEach((err) => toast.error(err.msg || err));
        } else {
          toast.error(error);
        }
      }
    } catch (error) {
      toast.error(error?.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    setIsLoading(true);
    try {
      const { success, error, validationErrors, message } = await resetPassword(
        email,
        newPassword
      );
      if (success) {
        if (message) toast.success(message);
        navigate("/login");
      } else if (error) {
        if (validationErrors?.length > 0) {
          validationErrors.forEach((err) => toast.error(err.msg || err));
        } else {
          toast.error(error);
        }
      }
    } catch (error) {
      toast.error(error?.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      className="reset-password-form"
      onSubmit={
        step === 1
          ? handleEmailSubmit
          : step === 2
          ? handleOtpSubmit
          : handlePasswordSubmit
      }
    >
      {step === 1 && (
        <div className="form-group">
          <div className="input-group">
            <label htmlFor="email" className="text-lg">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@example.com"
              disabled={isLoading}
            />
          </div>
          <div className="icon">
            <EnvelopeIcon />
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="form-group">
          <div className="input-group">
            <label htmlFor="otp" className="text-lg">
              Verification Code
            </label>
            <input
              type={showPassword ? "text" : "password"}
              id="otp"
              value={otp}
              onChange={(e) =>
                setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
              }
              placeholder="Enter 6-digit code"
              maxLength={6}
              disabled={isLoading}
            />
          </div>
          <div
            className="icon"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? "Hide OTP" : "Show OTP"}
          >
            {showPassword ? <LockOpenIcon /> : <LockClosedIcon />}
          </div>
        </div>
      )}

      {step === 3 && (
        <>
          <div className="form-group">
            <div className="input-group">
              <label htmlFor="email" className="text-lg">
                Email
              </label>
              <input
                type="text"
                id="email"
                value={email}
                placeholder="user@gmail.com"
                disabled={isLoading}
              />
            </div>
            <div className="icon">
              <EnvelopeIcon />
            </div>
          </div>

          <div className="form-group">
            <div className="input-group">
              <label
                htmlFor="newPassword"
                className="config-form-label text-lg"
              >
                New Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                disabled={isLoading}
              />
            </div>
            <div
              className="icon"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <LockOpenIcon /> : <LockClosedIcon />}
            </div>
          </div>
        </>
      )}

      <button type="submit" className="btn-primary-lg">
        {step === 1
          ? "Send Code"
          : step === 2
          ? "Verify Code"
          : "Reset Password"}
      </button>
    </form>
  );
};

export default PasswordResetForm;

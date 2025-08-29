import "./LoginForm.css";
import { login, googleAuth } from "../../../services/authService";
import { useState } from "react";
import {
  AtSymbolIcon,
  LockClosedIcon,
  LockOpenIcon,
} from "@heroicons/react/24/outline";
import { FcGoogle } from "react-icons/fc";
import { toast } from "sonner";

export default function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.target);
    const credentials = Object.fromEntries(formData);

    try {
      const response = await login(credentials);
      toast.success(response.message);

      const redirectUrl = new URL("/auth/callback", window.location.origin);
      redirectUrl.searchParams.set("token", response.token);
      redirectUrl.searchParams.set("isNewUser", String(response.isNewUser));
      redirectUrl.searchParams.set(
        "hasWorkoutPlan",
        String(response.hasWorkoutPlan)
      );
      redirectUrl.searchParams.set("isAdmin", String(response.isAdmin));

      // Redirect to auth callback with all parameters
      window.location.href = redirectUrl.toString();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleAuth = () => {
    googleAuth();
  };

  return (
    <form className="login-form" onSubmit={handleSubmit}>
      <div className="form-fields">
        <div className="form-group">
          <div className="input-group">
            <label htmlFor="email" className="text-lg">
              Email
            </label>
            <input
              type="text"
              id="email"
              name="email"
              placeholder="user@example.com"
            />
          </div>
          <div className="icon">
            <AtSymbolIcon />
          </div>
        </div>
        <div className="form-group">
          <div className="input-group">
            <label htmlFor="password" className="text-lg">
              Password
            </label>
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              name="password"
              placeholder="MyPass!123"
              autoComplete="new-password"
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
      </div>
      <button
        type="submit"
        disabled={isLoading}
        className="login-btn btn-primary-md"
      >
        {isLoading ? "Logging in..." : "Login"}
      </button>
      <button
        type="button"
        className="google-btn btn-secondary-md"
        onClick={handleGoogleAuth}
      >
        <FcGoogle /> Continue with Google
      </button>
    </form>
  );
}

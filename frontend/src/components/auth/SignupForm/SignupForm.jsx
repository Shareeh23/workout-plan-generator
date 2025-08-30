import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import "./SignupForm.css";
import { signup } from "../../../api/auth";
import { googleAuth } from "../../../services/authService";
import {
  AtSymbolIcon,
  LockClosedIcon,
  LockOpenIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import { toast } from "sonner";

export default function SignupForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { success, data, error, validationErrors, message } = await signup(
        formData
      );

      if (success) {
        if (data?.token) {
          localStorage.setItem("token", data.token);
        }
        toast.success(message);
        setTimeout(() => {
          window.location.href = "/select-plan";
        }, 1500);
      } else {
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

  const handleGoogleAuth = () => {
    googleAuth();
  };

  return (
    <form className="signup-form" onSubmit={handleSubmit}>
      <div className="form-fields">
        <div className="form-group">
          <div className="input-group">
            <label htmlFor="name" className="text-lg">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="John Doe"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
          </div>
          <div className="icon">
            <UserIcon />
          </div>
        </div>

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
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
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
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              placeholder="MyPass!123"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
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
        {isLoading ? "Creating account..." : "Sign Up"}
      </button>

      <button
        type="button"
        className="google-btn btn-secondary-md"
        onClick={handleGoogleAuth}
      >
        <FcGoogle /> Continue with Google
      </button>

      <div className="login-link text-md">
        Already have an account?{" "}
        <a href="/login" className="text-md">
          Login
        </a>
      </div>
    </form>
  );
}

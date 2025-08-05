import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import "./SignupForm.css";
import { googleAuth } from "../../../services/authService";
import { 
  AtSymbolIcon, 
  LockClosedIcon, 
  UserIcon 
} from "@heroicons/react/24/outline";
import { signup } from "../../../services/authService";
import "./SignupForm.css";

export default function SignupForm({ setMessage }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await signup(formData);
      if (response.token) {
        localStorage.setItem("token", response.token);
      }
      setMessage({
        text: response.message || "Account created successfully!",
        type: "success",
      });
      setTimeout(() => {
        window.location.href = "/workout-generation";
      }, 1500);
    } catch (error) {
      setMessage({
        text: error.message || "Signup failed. Please try again.",
        type: "error",
      });
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
              type="text"
              id="password"
              name="password"
              placeholder="MyPass!123"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />
          </div>
          <div className="icon">
            <LockClosedIcon />
          </div>
        </div>
      </div>

      <button type="submit" disabled={isLoading} className="btn-primary-md">
        {isLoading ? "Creating account..." : "Sign Up"}
      </button>

      <button
        type="button"
        className="btn-secondary-md"
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

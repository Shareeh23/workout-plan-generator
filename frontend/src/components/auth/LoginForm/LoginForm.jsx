import "./LoginForm.css";
import { login, googleAuth } from "../../../services/authService";
import { useState } from "react";
import { AtSymbolIcon, LockClosedIcon } from "@heroicons/react/24/outline";
import { FcGoogle } from "react-icons/fc";
import { toast } from "sonner";

export default function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.target);
    const credentials = Object.fromEntries(formData);

    try {
      const response = await login(credentials);
      toast.success(response.message)

      /* FIXME: Redirection happens so fast, can't see the success message, adding a promise or a timeout for the redirection didn't resolve the issue */ 

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
      toast.error(err.message)
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
              type="text"
              id="password"
              name="password"
              placeholder="MyPass!123"
            />
          </div>
          <div className="icon">
            <LockClosedIcon />
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

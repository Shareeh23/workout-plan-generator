import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./AuthCallback.css";

export default function AuthCallback() {
  const navigate = useNavigate();
  const location = useLocation();
  const [message, setMessage] = useState("Authenticating...");

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");
    const isNewUser = params.get("isNewUser") === "true";
    const hasWorkoutPlan = params.get("hasWorkoutPlan") === "true";
    const isAdmin = params.get("isAdmin") === "true";

    console.log('AuthCallback Params:', {
      token,
      isNewUser,
      hasWorkoutPlan,
      isAdmin
    });

    if (token) {
      localStorage.setItem("token", token);
      if (isAdmin) {
        localStorage.setItem("isAdmin", "true");
      }
      setMessage("Authentication successful! Redirecting...");

      setTimeout(() => {
        if (isAdmin) {
          navigate("/admin");
        } else {
          navigate(isNewUser || !hasWorkoutPlan ? "/workout-generation" : "/");
        }
      }, 3000);
    } else {
      setMessage("Authentication failed. Redirecting to signup...");
      setTimeout(() => navigate("/signup"), 3000);
    }
  }, [navigate, location]);

  return (
      <div className="auth-callback-container">
        <span className="loader"></span>
        <h2>{message}</h2>
      </div>
  );
}
  
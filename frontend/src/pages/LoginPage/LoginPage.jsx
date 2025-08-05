import { useState } from "react";
import LoginForm from "../../components/auth/LoginForm/LoginForm";
import { XMarkIcon } from "@heroicons/react/24/outline";
import "./LoginPage.css";

export default function LoginPage() {
  const [message, setMessage] = useState({ text: "", type: "" });

  return (
    <div className="login-page">
      <div className="login-container">
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
                  color: "var(--indigo-100)",
                  width: "1.5rem",
                  height: "1.5rem",
                }}
              />
            </button>
          </div>
        )}
        <div className="login-content">
          <div className="login-header">
            <h1>Welcome Back</h1>
            <h3 className="text-lg">Please enter your credentials</h3>
          </div>
          <LoginForm setMessage={setMessage} />
          <div className="auth-links">
            <a href="/signup" className="text-lg">
              Don't have an account? Sign up
            </a>
            <a href="/forgot-password" className="text-lg">
              Forgot password?
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

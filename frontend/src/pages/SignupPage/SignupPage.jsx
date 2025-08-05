import { useState } from "react";
import "./SignupPage.css";
import SignupForm from "../../components/auth/SignupForm/SignupForm";
import signupHeroImage from "../../assets/images/Tokita_Ohma.png";
import { XMarkIcon } from "@heroicons/react/24/outline";

export default function SignupPage() {
  const [message, setMessage] = useState({ text: "", type: "" });

  return (
    <div className="signup-page">
      <div className="signup-container">
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
        <div className="signup-hero">
          <div className="signup-image-container">
            <img
              src={signupHeroImage}
              alt="Workout illustration"
              className="signup-hero-image"
            />
          </div>
          <div className="signup-hero-text">
            <p>
              Sculpt your ideal physique
              <br />
              chisel by chisel
            </p>
          </div>
        </div>

        <div className="signup-form-container">
          <div className="signup-header">
            <h1>Get Started</h1>
            <p className="text-lg">Welcome to scultp. Let's get started.</p>
            <div className="divider"></div>
          </div>
          <SignupForm setMessage={setMessage} />
        </div>
      </div>
    </div>
  );
}

import "./SignupPage.css";
import SignupForm from "../../components/auth/SignupForm/SignupForm";
import signupHeroImage from "../../assets/images/Tokita_Ohma.png";

export default function SignupPage() {
  return (
    <div className="signup-page">
      <div className="signup-container">
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
          <SignupForm />
        </div>
      </div>
    </div>
  );
}

import LoginForm from "../../components/auth/LoginForm/LoginForm";
import "./LoginPage.css";

export default function LoginPage() {

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-content">
          <div className="login-header">
            <h1>Welcome Back</h1>
            <h3 className="text-lg">Please enter your credentials</h3>
          </div>
          <LoginForm />
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

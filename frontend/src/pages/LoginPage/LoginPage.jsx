import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import "./LoginPage.css";
import LoginForm from "../../components/auth/LoginForm/LoginForm";


export default function LoginPage() {
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const showLogoutMessage = searchParams.get('logout') === 'success';
    if (showLogoutMessage) {
      const timer = setTimeout(() => {
        toast.success('You have been logged out successfully');
        window.history.replaceState({}, document.title, window.location.pathname);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [searchParams]);

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
            <a href="/reset-password" className="text-lg">
              Forgot password?
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

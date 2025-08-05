import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import WarningIcon from "../../assets/svgs/warning.svg";
import "./AuthFailure.css";

export default function AuthFailure() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const message = searchParams.get("message") || "Authentication failed";

  return (
    <div className="auth-failure-page">
      <div className="auth-failure-container">
        <div className="svg-container">
          <img src={WarningIcon} alt="Warning" className="auth-warning-icon" />
        </div>
        <div className="auth-failure-content">
          <h1>{message}</h1>

          <div className="action-buttons">
            <Link to="/login" className="btn-primary-md">
              Try Login Again
            </Link>
            <Link to="/signup" className="btn-secondary-md">
              Try Signup Again
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

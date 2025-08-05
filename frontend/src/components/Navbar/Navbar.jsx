import React, { useEffect, useState } from "react";
import "./Navbar.css";
import { Link, useLocation } from "react-router-dom";
import { fetchUserProfile } from "../../services/authService";
import {
  BellIcon,
  InformationCircleIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [showNavbar, setShowNavbar] = useState(false);
  const location = useLocation();

  // Fetch user profile when component mounts
  useEffect(() => {
    // Show navbar on all protected routes, hide on auth pages
    const authPages = ["/login", "/signup", "/auth/callback", "/auth-failure"];
    setShowNavbar(!authPages.includes(location.pathname));

    const loadUser = async () => {
      try {
        const userData = await fetchUserProfile();
        if (userData) {
          setUser({
            name: userData.name || "User",
            image: userData.profilePicture || UserCircleIcon,
          });
        }
      } catch (error) {
        console.error("Error loading user profile:", error);
      }
    };
    
    // Only load user data if we should show the navbar
    if (!authPages.includes(location.pathname)) {
      loadUser();
    }
  }, [location.pathname]);

  if (!showNavbar) {
    return null;
  }

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/">
          <span className="logo-text">sculpt.</span>
        </Link>
      </div>

      <div className="navbar-links">
        <Link to="/" className="nav-link text-lg">
          Home
        </Link>
        <Link to="/workout-log" className="nav-link text-lg">
          Workout Log
        </Link>
        <Link to="/stats" className="nav-link text-lg">
          Stats
        </Link>
        <Link to="/library" className="nav-link text-lg">
          Library
        </Link>
        <Link to="/settings" className="nav-link text-lg">
          Settings
        </Link>
      </div>

      <div className="utility-icons">
        <BellIcon className="bell-icon" />
        <InformationCircleIcon className="info-icon" />
      </div>

      {user && (
        <div className="profile">
          <div className="profile-image">
            {user.image && typeof user.image === "string" ? (
              <img
                src={user.image}
                alt={user.name}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.style.display = "none";
                  // Optionally, you can set a state here to display the icon instead
                }}
              />
            ) : (
              <UserCircleIcon className="user-icon" />
            )}
          </div>
          <div className="profile-welcome text-lg">Welcome, {user.name}</div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

import React from "react";
import "./Navbar.css";
import { NavLink } from "react-router-dom";
import {
  ArrowRightStartOnRectangleIcon,
  InformationCircleIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import apiClient from "../../api/apiClient";

const Navbar = ({ user }) => {
  const handleLogout = () => {
    const itemsToRemove = ["token", "isAdmin", "nutritionProfileCache"];

    itemsToRemove.forEach((item) => localStorage.removeItem(item));
    delete apiClient.defaults.headers.common["Authorization"];
    window.location.href = "/login?logout=success";
  };
  const navLinkClass = ({ isActive }) =>
    `nav-link text-lg${isActive ? " active" : ""}`;

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/">
          <span className="logo-text">sculpt.</span>
        </Link>
      </div>

      <div className="navbar-links">
        <NavLink to="/" className={navLinkClass}>
          Home
        </NavLink>
        <NavLink to="/workout-log" className={navLinkClass}>
          Workout Log
        </NavLink>
        <NavLink to="/profile" className={navLinkClass}>
          Profile
        </NavLink>
        <NavLink to="/analysis" className={navLinkClass}>
          Analysis
        </NavLink>
        <NavLink to="/library" className={navLinkClass}>
          Library
        </NavLink>
        <NavLink to="/config" className={navLinkClass}>
          Config
        </NavLink>
      </div>

      <div className="utility-icons">
        <ArrowRightStartOnRectangleIcon
          onClick={handleLogout}
          className="navbar-icon"
          aria-label="Logout"
        />

        <InformationCircleIcon className="navbar-icon" />
      </div>

      {user && (
        <div className="profile">
          <div className="profile-image">
            {user.profilePicture ? (
              <img
                src={`http://localhost:3000${user.profilePicture}`}
                alt={user.name}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.style.display = "hidden";
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

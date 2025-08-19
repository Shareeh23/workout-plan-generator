import React from "react";
import "./Navbar.css";
import { NavLink } from "react-router-dom";
import {
  BellIcon,
  InformationCircleIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";

const Navbar = ({ user }) => {
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
        <NavLink to="/stats" className={navLinkClass}>
          Stats
        </NavLink>
        <NavLink to="/library" className={navLinkClass}>
          Library
        </NavLink>
        <NavLink to="/config" className={navLinkClass}>
          Config
        </NavLink>
      </div>

      <div className="utility-icons">
        <BellIcon className="bell-icon" />
        <InformationCircleIcon className="info-icon" />
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
import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { getCurrentUser } from "./api/auth";
import { Toaster } from 'sonner';
import LoginPage from "./pages/LoginPage/LoginPage";
import SignupPage from "./pages/SignupPage/SignupPage";
import AuthCallback from "./pages/AuthCallback/AuthCallback";
import AuthFailure from "./pages/AuthFailure/AuthFailure";
import WorkoutPlan from "./pages/WorkoutPlan/WorkoutPlan";
import PlanSelection from "./pages/PlanSelection/PlanSelection";
import Admin from "./pages/Admin/Admin";
import Home from "./pages/Home/Home";
import Library from "./pages/Library/Library";
import Profile from "./pages/Profile/Profile";
import Analysis from "./pages/Analysis/Analysis";
import WorkoutLog from "./pages/WorkoutLog/WorkoutLog";
import ConfigPage from "./pages/ConfigPage/ConfigPage";

// Protected Route Component
const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const token = localStorage.getItem("token");
  const isAdmin = localStorage.getItem("isAdmin") === "true";

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (requireAdmin && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
};

function App() {
  const [user, setUser] = useState(null);

  const handleUserUpdate = (updatedUserData) => {
    setUser((prevUser) => ({
      ...prevUser,
      ...updatedUserData,
    }));
  };

  // Handle profile picture updates
  const handleProfilePictureUpdate = (profilePictureData) => {
    const profilePicture =
      typeof profilePictureData === "string"
        ? profilePictureData
        : profilePictureData?.profilePicture;

    if (profilePicture) {
      handleUserUpdate({ profilePicture });
    }
  };

  useEffect(() => {
    const loadUser = async () => {
      try {
        const { success, data, error } = await getCurrentUser();
        if (success) {
          setUser(data.user || data);
        } else {
          console.error("Failed to load user:", error);
        }
      } catch (error) {
        console.error("Error loading user profile:", error);
      } 
    };

    loadUser();
  }, []);

  return (
    <Router>
      <Toaster 
      position="top-right"
      richColors
      expand={true}
      closeButton
    />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="/auth-failure" element={<AuthFailure />} />
        <Route path="/select-plan" element={<PlanSelection user={user} />} />
        <Route
          path="/workout-generation"
          element={
            <ProtectedRoute>
              <WorkoutPlan user={user} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home user={user} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/workout-log"
          element={
            <ProtectedRoute>
              <WorkoutLog user={user} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile user={user} />
            </ProtectedRoute>
          }
        ></Route>
        <Route
          path="/analysis"
          element={
            <ProtectedRoute>
              <Analysis user={user} />
            </ProtectedRoute>
          }
        ></Route>
        <Route
          path="/library"
          element={
            <ProtectedRoute>
              <Library user={user} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/config"
          element={
            <ProtectedRoute>
              <ConfigPage
                user={user}
                onProfilePictureUpdate={handleProfilePictureUpdate}
              />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute requireAdmin={true}>
              <Admin user={user} />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;

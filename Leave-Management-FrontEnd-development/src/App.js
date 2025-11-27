import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoginPage from "./components/LoginPage";
import StudentDashboard from "./components/students/StudentDashboard";
import WeekendApplication from "./components/students/WeekendApplication";
import GeneralApplication from "./components/students/GeneralApplication";
import { AuthProvider } from "./context/AuthContext";
import { Toaster } from "react-hot-toast";
import ProtectedRoute from "./components/ProtectedRoute"; // Import the updated ProtectedRoute
import Mentor from "./components/mentor/Mentor";
import Warden from "./components/warden/Warden";
import UrgentApplication from "./components/urgent/UrgentApplication";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedPrivileges={["student", "admin"]}>
                <StudentDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/Mentordashboard"
            element={
              <ProtectedRoute allowedPrivileges={["mentor", "admin"]}>
                <Mentor />
              </ProtectedRoute>
            }
          />
          <Route
            path="/Wardendashboard"
            element={
              <ProtectedRoute allowedPrivileges={["warden", "admin"]}>
                <Warden />
              </ProtectedRoute>
            }
          />
          <Route
            path="/WeekendApplication"
            element={
              <ProtectedRoute allowedPrivileges={["student", "admin"]}>
                <WeekendApplication />
              </ProtectedRoute>
            }
          />
          <Route
            path="/GeneralApplication"
            element={
              <ProtectedRoute allowedPrivileges={["student", "admin"]}>
                <GeneralApplication />
              </ProtectedRoute>
            }
          />
          <Route
            path="/UrgentApplication"
            element={
              <ProtectedRoute allowedPrivileges={["student", "admin"]}>
                <UrgentApplication />
              </ProtectedRoute>
            }
          />
        </Routes>
        <Toaster toastOptions={{ className: "react-hot-toast" }} />
      </AuthProvider>
    </Router>
  );
}

export default App;

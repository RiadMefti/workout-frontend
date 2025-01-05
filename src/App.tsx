import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import "./App.css";
import AuthPage from "./pages/AuthPage";
import { Providers } from "./hooks/Provider";
import WorkoutCreationPage from "./pages/WorkoutCreationPage";
import WorkoutListPage from "./pages/WorkoutListPage";
import NextWorkoutPage from "./pages/RecordWorkoutPage";
import DashboardPage from "./pages/DashboardPage";
import HomePage from "./pages/HomePage";
import AppLayout from "./components/AppLayout";
import UserProfilePage from "./pages/UserProfilePage";
import { PublicRoute } from "./routes/PublicRoute";
import { ProtectedRoute } from "./routes/ProtectedRoute";

function App() {
  return (
    <Providers>
      <BrowserRouter>
        <Routes>
          {/* Public Routes - Redirect to dashboard if authenticated */}
          <Route
            path="/auth/:mode"
            element={
              <PublicRoute>
                <AuthPage />
              </PublicRoute>
            }
          />
          <Route
            path="/auth"
            element={
              <PublicRoute>
                <AuthPage />
              </PublicRoute>
            }
          />
          <Route
            path="/"
            element={
              <PublicRoute>
                <HomePage />
              </PublicRoute>
            }
          />

          {/* Protected Routes - Redirect to auth if not authenticated */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <DashboardPage />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <UserProfilePage />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/create-workout"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <WorkoutCreationPage />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/workouts"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <WorkoutListPage />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/next-workout"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <NextWorkoutPage />
                </AppLayout>
              </ProtectedRoute>
            }
          />

          {/* Catch all route - Redirect to appropriate page based on auth status */}
          <Route
            path="*"
            element={
              <ProtectedRoute>
                <Navigate to="/dashboard" replace />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </Providers>
  );
}

export default App;

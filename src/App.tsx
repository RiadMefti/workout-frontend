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
import { Toaster } from "./components/ui/toaster";
import StatsPage from "./pages/StatsPage";
import ConnectionsCalendarPage from "./pages/ConnectionsCalendarPage";

//The App component is the root component of the application.
//It contains the routing configuration for the application.
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

          <Route
            path="/stats"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <StatsPage />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/connections-calendar"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <ConnectionsCalendarPage />
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
      <Toaster />
    </Providers>
  );
}

export default App;

import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import AuthPage from "./pages/AuthPage";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Providers } from "./hooks/Provider";
import WorkoutCreationPage from "./pages/WorkoutCreationPage";
import WorkoutListPage from "./pages/WorkoutListPage";
import NextWorkoutPage from "./pages/RecordWorkoutPage";
import DashboardPage from "./pages/DashboardPage";
import HomePage from "./pages/HomePage";
import AppLayout from "./components/AppLayout";

function App() {
  return (
    <Providers>
      <BrowserRouter>
        <Routes>
          <Route path="/auth/:mode" element={<AuthPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/" element={<HomePage />} />

          {/* Protected Routes with Layout */}
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
        </Routes>
      </BrowserRouter>
    </Providers>
  );
}

export default App;

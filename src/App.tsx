// src/App.tsx
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import AuthPage from "./pages/AuthPage";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Button } from "./components/ui/button";
import { useEffect, useState } from "react";
import { useAuth } from "./hooks/auth/AuthContext";
import { profileClient } from "./api/ProfileApi";
import { useUser } from "./hooks/user/UserContext";
import { Providers } from "./hooks/Provider";

const Home = () => {
  const { logout } = useAuth();
  const { user } = useUser();
  const [profile, setProfile] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await profileClient.getProfile();
        if (response.success) {
          setProfile(response.data);
        } else {
          setError(response.error);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load profile");
      }
    };

    fetchProfile();
  }, []);

  return (
    <div className="p-8">
      <div className="max-w-md mx-auto space-y-4">
        <h1 className="text-2xl font-bold mb-4">Welcome to Home!</h1>

        {error && (
          <div className="p-3 text-sm bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        {profile && (
          <div className="p-4 bg-white shadow rounded">
            <h2 className="text-lg font-semibold mb-2">Profile Data:</h2>
            <p>
              {profile} - {user?.name} - {user?.email}
            </p>
          </div>
        )}

        <Button onClick={logout} variant="destructive" className="w-full">
          Logout
        </Button>
      </div>
    </div>
  );
};

function App() {
  return (
    <Providers>
      <BrowserRouter>
        <Routes>
          <Route path="/auth/:mode" element={<AuthPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </Providers>
  );
}

export default App;

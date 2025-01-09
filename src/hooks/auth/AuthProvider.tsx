import { useState } from "react";
import { AuthContext } from "./AuthContext";


//The AuthProvider component provides the AuthContext to the rest of the application.
//It manages the authentication state of the user, including the authentication token.
//It provides a logout method to clear the authentication token from local storage.
//The AuthProvider component wraps the rest of the application in the AuthContext.Provider.
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );

  const isAuthenticated = !!token;

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ token, setToken, isAuthenticated, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

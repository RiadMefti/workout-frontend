import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { AuthContext } from "./AuthContext";
import { UserContext } from "../user/UserContext";
import { UserDTO } from "@/type";
interface DecodedToken extends UserDTO {
  exp: number;
  iat: number;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );
  const [user, setUser] = useState<UserDTO | null>(null);

  useEffect(() => {
    if (token) {
      const decoded = jwtDecode<DecodedToken>(token);
      setUser({
        _id: decoded._id,
        name: decoded.name,
        email: decoded.email,
        profile_picture: decoded.profile_picture,
        next_workout: decoded.next_workout,
      });
    } else {
      setUser(null);
    }
  }, [token]);

  const isAuthenticated = !!token;

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ token, setToken, isAuthenticated, logout }}>
      <UserContext.Provider value={{ user, setUser }}>
        {children}
      </UserContext.Provider>
    </AuthContext.Provider>
  );
}

import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { useAuth } from "../auth/AuthContext";
import { UserContext } from "./UserContext";
import { UserDTO } from "@/type";

interface DecodedToken extends UserDTO {
  exp: number;
  iat: number;
}

export function UserProvider({ children }: { children: React.ReactNode }) {
  const { token } = useAuth();
  const [user, setUser] = useState<UserDTO | null>(null);

  useEffect(() => {
    if (token) {
      const decoded = jwtDecode<DecodedToken>(token);
      setUser({
        _id: decoded._id,
        name: decoded.name,
        email: decoded.email,
        profile_picture: decoded.profile_picture,
        active_split: decoded.active_split,
      });
    } else {
      setUser(null);
    }
  }, [token]);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}

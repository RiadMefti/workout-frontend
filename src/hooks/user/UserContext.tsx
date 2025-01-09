import { createContext, useContext } from "react";
import { UserDTO } from "@/type";

interface UserContextType {
  user: UserDTO | null;
  setUser: (user: UserDTO | null) => void;
}

export const UserContext = createContext<UserContextType | null>(null);

//The useUser hook provides access to the UserContext.
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
import { ReactNode } from "react";
import { AuthProvider } from "./auth/AuthProvider";
import { UserProvider } from "./user/UserProvider";

interface ProvidersProps {
  children: ReactNode;
}

//The Providers component wraps the AuthProvider and UserProvider components to provide the authentication and user context to the rest of the application.
export function Providers({ children }: ProvidersProps) {
  return (
    <AuthProvider>
      <UserProvider>{children}</UserProvider>
    </AuthProvider>
  );
}

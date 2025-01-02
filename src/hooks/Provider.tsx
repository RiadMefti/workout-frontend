import { ReactNode } from "react";
import { AuthProvider } from "./auth/AuthProvider";
import { UserProvider } from "./user/UserProvider";

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <AuthProvider>
      <UserProvider>{children}</UserProvider>
    </AuthProvider>
  );
}

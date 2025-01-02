import Login from "@/components/auth/Login";
import Register from "@/components/auth/Register";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const { mode } = useParams();
  const navigate = useNavigate();
  useEffect(() => {
    if (mode === "login") setIsLogin(true);
    else if (mode === "register") setIsLogin(false);
  }, [mode]);
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md md:max-w-lg lg:max-w-xl">
        <CardHeader>
          <CardTitle className="text-center text-xl md:text-2xl lg:text-3xl">
            {isLogin ? "Login" : "Register"}
          </CardTitle>
          <CardDescription className="text-center text-sm md:text-base lg:text-lg">
            {isLogin
              ? "Welcome back! Please login to your account."
              : "Create a new account to get started."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLogin ? <Login /> : <Register />}
          <div className="mt-4 text-center">
            <Button
              variant="link"
              onClick={() =>
                navigate(isLogin ? "/auth/register" : "/auth/login")
              }
              className="text-sm md:text-base lg:text-lg"
            >
              {isLogin
                ? "Don't have an account? Register"
                : "Already have an account? Login"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
export default AuthPage;

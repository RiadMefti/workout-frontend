import { Label } from "@radix-ui/react-label";
import { User, Mail, Lock } from "lucide-react";
import React, { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useNavigate } from "react-router-dom";
import { authClient } from "../../api/AuthApi";
import { useAuth } from "../../hooks/auth/AuthContext";

//The Register component is a form that allows users to register a new account.
//It uses the authClient to make a request to the API to register the user.
//If the registration is successful, it stores the authentication token in local storage and redirects the user to the home page.
//If there is an error during registration, it displays an error message to the user.

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { setToken } = useAuth();
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await authClient.register({ name, email, password });

      if (!response.success) {
        throw new Error(response.error);
      }

      localStorage.setItem("token", response.data.token);
      setToken(response.data.token);
      navigate("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleRegister} className="space-y-4">
      {error && (
        <div className="p-3 text-sm bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <div className="relative flex align-middle">
          <User className="absolute left-2 top-3 h-4 w-4 text-gray-500" />
          <Input
            id="name"
            type="text"
            placeholder="Enter your name"
            className="pl-8"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            disabled={isLoading}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <div className="relative">
          <Mail className="absolute left-2 top-3 h-4 w-4 text-gray-500" />
          <Input
            id="email"
            type="email"
            placeholder="Enter your email"
            className="pl-8"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isLoading}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <Lock className="absolute left-2 top-3 h-4 w-4 text-gray-500" />
          <Input
            id="password"
            type="password"
            placeholder="Enter your password"
            className="pl-8"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isLoading}
            minLength={6}
          />
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Registering..." : "Register"}
      </Button>
    </form>
  );
};

export default Register;

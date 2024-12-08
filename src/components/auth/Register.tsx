import { Label } from "@radix-ui/react-label";
import { User, Mail, Lock } from "lucide-react";
import React, { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    // Add registration logic here je dois call l api
    console.log("Register:", { name, email, password });
  };

  return (
    <form onSubmit={handleRegister} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Name : </Label>
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
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email :</Label>
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
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password :</Label>
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
          />
        </div>
      </div>
      <Button type="submit" className="w-full">
        Register
      </Button>
    </form>
  );
};
export default Register;

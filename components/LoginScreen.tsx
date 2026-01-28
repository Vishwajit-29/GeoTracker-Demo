import React, { useState } from "react";
import { User } from "../types";
import { GeoTrackerLogo } from "./icons/GeoTrackerLogo";

interface LoginScreenProps {
  users: User[];
  onLogin: (name: string, password: string) => boolean;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ users, onLogin }) => {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    // Find user based on full name, e.g., "Maria Garcia (Employee)"
    const userExists = users.find(
      (u) => u.name.toLowerCase() === name.toLowerCase(),
    );

    if (!userExists) {
      setError("Invalid username or password. Please try again.");
      return;
    }

    const success = onLogin(userExists.name, password);
    if (!success) {
      setError("Invalid username or password. Please try again.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-brand-primary to-blue-400 p-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl p-8 text-center space-y-6">
        <div className="mx-auto h-20 w-20 text-brand-primary">
          <GeoTrackerLogo />
        </div>
        <h1 className="text-3xl font-bold text-brand-dark">Welcome Back</h1>
        <p className="text-brand-secondary">
          Sign in to your GeoTracker account.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Username "
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary"
            required
            autoComplete="username"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary"
            required
            autoComplete="current-password"
          />
          {error && <p className="text-red-500 text-sm text-left">{error}</p>}
          <button
            type="submit"
            className="w-full py-3 px-6 bg-brand-primary text-white font-bold rounded-lg shadow-md hover:bg-blue-600 transition-transform transform hover:scale-105"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginScreen;

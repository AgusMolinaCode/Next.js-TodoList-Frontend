'use client';

import { useState } from "react";
import LoginForm from "@/components/login";
import { Button } from "@/components/ui/button";

export default function Home() {
  const [token, setToken] = useState<string | null>(null);

  const handleLogin = (token: string) => {
    setToken(token);
  };

  const handleLogout = () => {
    setToken(null);
  };

  return (
    <div>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-end pb-6">
          {token && (
            <Button variant="outline" onClick={handleLogout} className="ml-4">
              Logout
            </Button>
          )}
        </div>
        <h1 className="text-4xl font-bold text-center mb-4">
          TodoList con Golang y Next.js 15
        </h1>
        <p className="text-xl text-center text-muted-foreground mb-8">
          Utilizando Server Actions para una experiencia fluida
        </p>
        <div className="bg-card text-card-foreground rounded-lg shadow-lg p-6">
          {!token && (
            <LoginForm onLogin={handleLogin} />
          )}
        </div>
      </div>
    </div>
  );
}
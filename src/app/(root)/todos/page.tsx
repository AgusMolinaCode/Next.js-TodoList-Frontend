"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import GetTodosList from "@/components/GetTodos";
import AddTodoModal from "@/components/AddTodoModal";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/ModeToggle";
import { Todo } from "@/types/todo";
import { GetTodos } from "@/lib/actions";
import Loading from "@/app/loading";

export default function TodosPage() {
  const [token, setToken] = useState<string | null>(null);
  const [todos, setTodos] = useState<Todo[]>([]);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const tokenFromQuery = searchParams.get("token");
    if (tokenFromQuery) {
      setToken(tokenFromQuery);
    } else {
      router.push("/");
    }
  }, [searchParams, router]);

  useEffect(() => {
    const fetchTodos = async () => {
      if (token) {
        try {
          const fetchedTodos = await GetTodos(token);
          setTodos(fetchedTodos || []);
        } catch (error) {
          console.error("Error fetching todos:", error);
          setTodos([]);
        }
      }
    };

    fetchTodos();
  }, [token]);

  const handleLogout = () => {
    setToken(null);
    router.push("/"); // Redirect to login page
  };

  const handleTodoCreated = (fetchedTodos: Todo[]) => {
    setTodos(fetchedTodos);
  };

  return (
    <div>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between pb-6">
          <ModeToggle />

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
        <div className="flex justify-center mb-8">
          {token && (
            <AddTodoModal token={token} onTodoCreated={handleTodoCreated} />
          )}
        </div>
        <div className="bg-card text-card-foreground rounded-lg shadow-lg p-6">
          {token ? (
            <Suspense fallback={<Loading />}>
              <GetTodosList token={token} todos={todos} setTodos={setTodos} />
            </Suspense>
          ) : (
            <p className="text-center">Loading...</p>
          )}
        </div>
      </div>
    </div>
  );
}

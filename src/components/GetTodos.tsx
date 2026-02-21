import React, { useEffect } from "react";
import { Todo } from "@/types/todo";
import { format, isValid, parseISO } from "date-fns";
import DeleteButton from "./DeleteButton";
import EditTodoModal from "./EditTodoModal";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, CheckCircle2, XCircle } from 'lucide-react';
import { GetTodos } from "@/lib/actions";

interface GetTodosListProps {
  token: string;
  todos: Todo[];
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
}

/**
 * Formatea una fecha ISO a string legible
 * @param dateString - Fecha en formato ISO
 * @returns Fecha formateada o "Invalid Date" si no es válida
 */
function formatDate(dateString: string | undefined): string {
  if (!dateString) return "Invalid Date";
  const date = parseISO(dateString);
  return isValid(date) ? format(date, "MMM dd, HH:mm") : "Invalid Date";
}

/**
 * Verifica si un todo fue editado (createdAt != updatedAt)
 */
function isEdited(todo: Todo): boolean {
  if (!todo.created_at || !todo.updated_at) return false;
  const createdAt = parseISO(todo.created_at);
  const updatedAt = parseISO(todo.updated_at);
  return isValid(createdAt) && isValid(updatedAt) && createdAt.getTime() !== updatedAt.getTime();
}

const GetTodosList: React.FC<GetTodosListProps> = ({ token, todos, setTodos }) => {
  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const fetchedTodos = await GetTodos(token);
        setTodos(fetchedTodos || []);
      } catch (error) {
        console.error("Error fetching todos:", error);
        setTodos([]);
      }
    };

    fetchTodos();
  }, [token, setTodos]);

  return (
    <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      {todos && todos.length === 0 ? (
        <p className="text-center col-span-full">No todos found</p>
      ) : (
        todos && todos.map((todo) => (
          <Card key={todo.id} className="flex flex-col justify-between">
            <CardHeader>
              <CardTitle className="text-lg font-semibold truncate">{todo.title}</CardTitle>
              <Badge variant={todo.completed ? "default" : "destructive"} className="w-fit">
                {todo.completed ? (
                  <CheckCircle2 className="w-4 h-4 mr-1" />
                ) : (
                  <XCircle className="w-4 h-4 mr-1" />
                )}
                {todo.completed ? "Completed" : "Pending"}
              </Badge>
            </CardHeader>
            <CardContent className="text-sm space-y-2">
              <p className="flex items-center text-muted-foreground">
                <CalendarIcon className="w-4 h-4 mr-2" />
                Created: {formatDate(todo.created_at)}
              </p>
              {isEdited(todo) && (
                <p className="flex items-center text-muted-foreground">
                  <CalendarIcon className="w-4 h-4 mr-2" />
                  Updated: {formatDate(todo.updated_at)}
                </p>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <EditTodoModal token={token} todo={todo} onTodoUpdated={setTodos} />
              <DeleteButton id={todo.id} token={token} onTodoDeleted={setTodos} />
            </CardFooter>
          </Card>
        ))
      )}
    </div>
  );
};

export default GetTodosList;
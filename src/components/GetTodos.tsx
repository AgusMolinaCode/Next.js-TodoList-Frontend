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
        todos && todos.map((todo) => {
          const createdAt = todo.created_at ? parseISO(todo.created_at) : null;
          const updatedAt = todo.updated_at ? parseISO(todo.updated_at) : null;
          const isEdited = createdAt && updatedAt && createdAt.getTime() !== updatedAt.getTime();

          return (
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
                  Created: {createdAt && isValid(createdAt) ? format(createdAt, "MMM dd, HH:mm") : "Invalid Date"}
                </p>
                {isEdited && (
                  <p className="flex items-center text-muted-foreground">
                    <CalendarIcon className="w-4 h-4 mr-2" />
                    Updated: {updatedAt && isValid(updatedAt) ? format(updatedAt, "MMM dd, HH:mm") : "Invalid Date"}
                  </p>
                )}
              </CardContent>
              <CardFooter className="flex justify-between">
                <EditTodoModal token={token} todo={todo} onTodoUpdated={setTodos} />
                <DeleteButton id={todo.id} token={token} onTodoDeleted={setTodos} />
              </CardFooter>
            </Card>
          );
        })
      )}
    </div>
  );
};

export default GetTodosList;
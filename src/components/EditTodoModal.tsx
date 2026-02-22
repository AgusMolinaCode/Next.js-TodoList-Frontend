"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { updateTodo, GetTodos } from "@/lib/actions";
import { formSchema } from "@/lib/zodSchema";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Edit2Icon, AlertCircle } from "lucide-react";
import { Todo } from "@/types/todo";
import { TodoFormFields } from "./TodoFormFields";

interface EditTodoModalProps {
  token: string;
  todo: Todo;
  onTodoUpdated: (todos: Todo[]) => void;
}

const EditTodoModal: React.FC<EditTodoModalProps> = ({ token, todo, onTodoUpdated }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: todo.title,
      completed: todo.completed,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setError(null);
    try {
      const result = await updateTodo(token, todo.id, values);
      if (!result) {
        setError("Failed to update todo. Please try again.");
        return;
      }
      const fetchedTodos = await GetTodos(token);
      form.reset();
      setIsOpen(false);
      onTodoUpdated(fetchedTodos);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Edit2Icon className="w-4 h-4 mr-2" />
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Todo</DialogTitle>
          <DialogDescription>Edit your todo details</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded flex items-center gap-2">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                <span className="text-sm">{error}</span>
              </div>
            )}
            <TodoFormFields form={form} />
            <DialogFooter>
              <Button type="submit" className="w-full">
                <Edit2Icon className="mr-2 h-4 w-4" />
                Update Todo
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditTodoModal;
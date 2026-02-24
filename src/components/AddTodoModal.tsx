"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createTodo, GetTodos } from "@/lib/actions";
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
import { PlusCircle } from "lucide-react";
import { Todo } from "@/types/todo";
import { TodoFormFields } from "./TodoFormFields";
import { ErrorAlert } from "./ErrorAlert";

interface AddTodoModalProps {
  token: string;
  onTodoCreated: (todos: Todo[]) => void;
}

const AddTodoModal: React.FC<AddTodoModalProps> = ({ token, onTodoCreated }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      completed: false,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setError(null);
    try {
      const result = await createTodo(token, values);
      if (!result) {
        setError("Failed to create todo. Please try again.");
        return;
      }
      const fetchedTodos = await GetTodos(token);
      form.reset();
      setIsOpen(false);
      onTodoCreated(fetchedTodos);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Todo
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a New Todo</DialogTitle>
          <DialogDescription>Add a new task to your todo list</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {error && <ErrorAlert message={error} />}
            <TodoFormFields form={form} />
            <DialogFooter>
              <Button type="submit" className="w-full">
                <PlusCircle className="mr-2 h-4 w-4" />
                Create Todo
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddTodoModal;
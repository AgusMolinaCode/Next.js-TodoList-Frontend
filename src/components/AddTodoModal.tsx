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

interface AddTodoModalProps {
  token: string;
  onTodoCreated: (todos: Todo[]) => void;
}

const AddTodoModal: React.FC<AddTodoModalProps> = ({ token, onTodoCreated }) => {
  const [isOpen, setIsOpen] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      completed: false,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await createTodo(token, values);
      const fetchedTodos = await GetTodos(token);
      form.reset();
      setIsOpen(false); // Close the modal
      onTodoCreated(fetchedTodos); // Pass the fetched todos to the parent component
    } catch {
      console.log("Error creating todo");
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
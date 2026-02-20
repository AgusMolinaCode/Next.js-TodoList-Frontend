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
import { Edit2Icon } from "lucide-react";
import { Todo } from "@/types/todo";
import { TodoFormFields } from "./TodoFormFields";

interface EditTodoModalProps {
  token: string;
  todo: Todo;
  onTodoUpdated: (todos: Todo[]) => void;
}

const EditTodoModal: React.FC<EditTodoModalProps> = ({ token, todo, onTodoUpdated }) => {
  const [isOpen, setIsOpen] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: todo.title,
      completed: todo.completed,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await updateTodo(token, todo.id, values);
      const fetchedTodos = await GetTodos(token);
      form.reset();
      setIsOpen(false); // Close the modal
      onTodoUpdated(fetchedTodos); // Pass the fetched todos to the parent component
    } catch {
      console.log("Error updating todo");
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
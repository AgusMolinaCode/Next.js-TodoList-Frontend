"use client";

import React, { useState } from "react";
import { ButtonProps, Todo } from "@/types/todo";
import { DeleteTodoById, GetTodos } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Trash2 } from 'lucide-react';

interface DeleteButtonProps extends ButtonProps {
  token: string;
  onTodoDeleted: (todos: Todo[]) => void;
}

const DeleteButton: React.FC<DeleteButtonProps> = ({ id, token, onTodoDeleted }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleDelete = async () => {
    const formData = new FormData();
    formData.append("id", id);
    await DeleteTodoById(token, formData);
    const fetchedTodos = await GetTodos(token);
    setIsOpen(false);
    onTodoDeleted(fetchedTodos); // Pass the fetched todos to the parent component
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive" size="sm">
          <Trash2 className="h-4 w-4 mr-2" />
          Delete
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Confirm Deletion</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this todo? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteButton;
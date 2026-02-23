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
import { AlertCircle, Trash2 } from 'lucide-react';
import { Alert, AlertDescription } from "@/components/ui/alert";

interface DeleteButtonProps extends ButtonProps {
  token: string;
  onTodoDeleted: (todos: Todo[]) => void;
}

const DeleteButton: React.FC<DeleteButtonProps> = ({ id, token, onTodoDeleted }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    setIsDeleting(true);
    setError(null);
    
    try {
      const formData = new FormData();
      formData.append("id", id);
      
      const result = await DeleteTodoById(token, formData);
      
      if (!result) {
        throw new Error("Failed to delete todo");
      }
      
      const fetchedTodos = await GetTodos(token);
      setIsOpen(false);
      onTodoDeleted(fetchedTodos || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
    } finally {
      setIsDeleting(false);
    }
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
        {error && (
          <Alert variant="destructive" className="mt-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={() => setIsOpen(false)} disabled={isDeleting}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteButton;
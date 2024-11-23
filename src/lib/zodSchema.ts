import { z } from "zod";

export const formSchema = z.object({
    title: z.string().min(2).max(50),
    completed: z.boolean(),
  });

  export const loginSchema = z.object({
    username: z.string().min(1, "Username is required"),
    password: z.string().min(1, "Password is required"),
  });
  
  export const registerSchema = z.object({
    username: z.string().min(5, "min 5 characters").max(50, "max 50 characters"),
    password: z.string().min(5, "min 5 characters").max(50, "max 50 characters"),
  });
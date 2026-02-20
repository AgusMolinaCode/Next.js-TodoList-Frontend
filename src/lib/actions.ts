"use server";

import { revalidatePath } from "next/cache";

const BASE_URL = "https://golang-mongodb-production.up.railway.app";

// Tipos de respuesta
interface AuthResponse {
  token?: string;
  user?: {
    id: string;
    username: string;
  };
  success?: boolean;
  message?: string;
}

interface Todo {
  /** Unique identifier for the todo item */
  id: string;
  /** Title or description of the todo */
  title: string;
  /** Whether the todo is completed */
  completed: boolean;
  /** ID of the user who owns this todo */
  userId: string;
  /** ISO timestamp when the todo was created */
  createdAt: string;
  /** ISO timestamp when the todo was last updated */
  updatedAt: string;
}

interface ApiError {
  message: string;
  status?: number;
}

// Clase de error personalizada para la API
class ApiRequestError extends Error {
  status?: number;
  
  constructor(message: string, status?: number) {
    super(message);
    this.name = 'ApiRequestError';
    this.status = status;
  }
}

// Función helper para manejar errores de fetch
async function handleFetchResponse(response: Response): Promise<any> {
  if (!response.ok) {
    const errorText = await response.text();
    throw new ApiRequestError(
      errorText || `HTTP error! status: ${response.status}`,
      response.status
    );
  }
  return response.json();
}

export async function Login(values: { username: string; password: string }): Promise<AuthResponse> {
  try {
    const response = await fetch(`${BASE_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });
    
    const data = await handleFetchResponse(response);
    console.log("Login successful", data);
    return data;
  } catch (error) {
    console.error("Error logging in:", error);
    if (error instanceof ApiRequestError) {
      throw error;
    }
    throw new ApiRequestError("Failed to login");
  }
}

export async function Register(values: { username: string; password: string }): Promise<AuthResponse> {
  try {
    const response = await fetch(`${BASE_URL}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });
    
    const data = await handleFetchResponse(response);
    console.log("Registration successful", data);
    return { success: true, ...data };
  } catch (error) {
    console.error("Error registering:", error);
    if (error instanceof ApiRequestError) {
      throw error;
    }
    throw new ApiRequestError("Failed to register");
  }
}

async function fetchWithAuth<T>(
  url: string, 
  token: string, 
  options: RequestInit = {}
): Promise<T> {
  if (!token) {
    throw new ApiRequestError("Authentication token is required", 401);
  }
  
  const response = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${token}`,
    },
  });
  
  return handleFetchResponse(response);
}

export async function GetTodos(token: string): Promise<Todo[] | null> {
  try {
    const data = await fetchWithAuth<Todo[]>(`${BASE_URL}/todos`, token);
    return data;
  } catch (error) {
    console.error("Error fetching todos:", error);
    return null;
  }
}

export async function createTodo(
  token: string, 
  values: { title: string; completed: boolean }
): Promise<Todo | null> {
  try {
    const data = await fetchWithAuth<Todo>(`${BASE_URL}/todos`, token, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });
    return data;
  } catch (error) {
    console.error("Error creating todo:", error);
    return null;
  }
}

export async function DeleteTodoById(
  token: string, 
  formData: FormData
): Promise<{ success: boolean } | null> {
  const id = formData.get("id") as string;
  
  if (!id) {
    console.error("Todo ID is required");
    return null;
  }
  
  try {
    await fetchWithAuth<void>(`${BASE_URL}/todos/${id}`, token, {
      method: "DELETE",
    });
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Error deleting todo:", error);
    return null;
  }
}

export async function updateTodo(
  token: string, 
  id: string, 
  values: { title: string; completed: boolean }
): Promise<Todo | null> {
  if (!id) {
    console.error("Todo ID is required");
    return null;
  }
  
  try {
    const data = await fetchWithAuth<Todo>(`${BASE_URL}/todos/${id}`, token, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });
    revalidatePath("/");
    return data;
  } catch (error) {
    console.error("Error updating todo:", error);
    return null;
  }
}

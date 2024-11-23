"use server";

import { revalidatePath } from "next/cache";

export async function Login(values: { username: string; password: string }) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || "Failed to login");
    }
    const data = await response.json();
    console.log("Login successful", data);
    return data;
  } catch (error) {
    console.error("Error logging in:", error);
    throw error;
  }
}

export async function Register(values: { username: string; password: string }) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || "Failed to register");
    }
    const data = await response.json();
    console.log("Registration successful", data);
    return { success: true, ...data };
  } catch (error) {
    console.error("Error registering:", error);
    throw error;
  }
}

async function fetchWithAuth(url: string, token: string, options: RequestInit = {}) {
  if (token) {
    options.headers = {
      ...options.headers,
      Authorization: `Bearer ${token}`,
    };
  }
  const response = await fetch(url, options);
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
}

export async function GetTodos(token: string) {
  try {
    const data = await fetchWithAuth(`${process.env.NEXT_PUBLIC_URL}/todos`, token);
    return data;
  } catch (error) {
    console.error("Error fetching todos:", error);
  }
  
}

export async function createTodo(token: string, values: { title: string; completed: boolean }) {
  try {
    const data = await fetchWithAuth(`${process.env.NEXT_PUBLIC_URL}/todos`, token, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });
    return data;
  } catch (error) {
    console.error("Error creating todo:", error);
  }
}

export async function DeleteTodoById(token: string, formData: FormData) {
  const id = formData.get("id") as string;
  try {
    const data = await fetchWithAuth(`${process.env.NEXT_PUBLIC_URL}/todos/${id}`, token, {
      method: "DELETE",
    });
    revalidatePath("/");
    return data;
  } catch (error) {
    console.error("Error deleting todo:", error);
  }
}



export async function updateTodo(token: string, id: string, values: { title: string; completed: boolean }) {
  try {
    const data = await fetchWithAuth(`${process.env.NEXT_PUBLIC_URL}/todos/${id}`, token, {
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
  }
}
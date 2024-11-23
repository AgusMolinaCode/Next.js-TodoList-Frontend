"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Login, Register } from "@/lib/actions";
import { Card, CardHeader, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { loginSchema, registerSchema } from "@/lib/zodSchema";
import { useRouter } from "next/navigation";

interface LoginFormProps {
  onLogin: (token: string) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const router = useRouter();

  const form = useForm<z.infer<typeof loginSchema | typeof registerSchema>>({
    resolver: zodResolver(isLogin ? loginSchema : registerSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof loginSchema | typeof registerSchema>) {
    try {
      if (isLogin) {
        const token = await Login(values);
        if (token && token.token) {
          onLogin(token.token);
          setErrorMessage(null); // Clear any previous error messages
          router.push(`/todos?token=${token.token}`); // Redirect to /todos with token as query parameter
        } else {
          setErrorMessage("Invalid username or password");
          setTimeout(() => setErrorMessage(null), 5000); // Clear error message after 5 seconds
        }
      } else {
        const response = await Register(values);
        if (response && response.success) {
          setIsLogin(true); // Switch to login form after successful registration
          setErrorMessage(null); // Clear any previous error messages
          setSuccessMessage("User registered successfully");
          setTimeout(() => setSuccessMessage(null), 5000); // Clear success message after 5 seconds
        } else {
          setErrorMessage("Registration failed");
          setTimeout(() => setErrorMessage(null), 5000); // Clear error message after 5 seconds
        }
      }
      form.reset();
    } catch (error) {
      
      if (error instanceof Error) {
        setErrorMessage(error.message || "An error occurred");
      } else {
        setErrorMessage("An error occurred");
      }
      setTimeout(() => setErrorMessage(null), 5000); // Clear error message after 5 seconds
    }
  }

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle>{isLogin ? "Login" : "Register"}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {errorMessage && (
              <p className="text-red-500 text-sm">{errorMessage}</p>
            )}
            {successMessage && (
              <p className="text-green-500 text-sm">{successMessage}</p>
            )}
            <Button type="submit">{isLogin ? "Login" : "Register"}</Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter>
        <Button variant="link" onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? "Don't have an account? Register" : "Already have an account? Login"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default LoginForm;
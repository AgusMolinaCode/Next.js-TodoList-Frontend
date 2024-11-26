"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Login, Register } from "@/lib/actions";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
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

  async function onSubmit(
    values: z.infer<typeof loginSchema | typeof registerSchema>
  ) {
    try {
      if (isLogin) {
        const token = await Login(values);
        if (token && token.token) {
          onLogin(token.token);
          setErrorMessage(null);
          router.push(`/todos?token=${token.token}`);
        } else {
          setErrorMessage("Usuario o contraseña incorrecto");
          setTimeout(() => setErrorMessage(null), 3000);
        }
      } else {
        const response = await Register(values);
        if (response && response.success) {
          setIsLogin(true);
          setErrorMessage(null);
          setSuccessMessage("Usuario creado correctamente");
          setTimeout(() => setSuccessMessage(null), 3000);
        } else {
          setErrorMessage("Error al crear el usuario");
          setTimeout(() => setErrorMessage(null), 3000);
        }
      }
      form.reset();
    } catch {
      setErrorMessage("Ocurrió un error, por favor intenta nuevamente");
      setTimeout(() => setErrorMessage(null), 3000);
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
                    <Input type="text" {...field} />
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
          {isLogin
            ? "Don't have an account? Register"
            : "Already have an account? Login"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default LoginForm;

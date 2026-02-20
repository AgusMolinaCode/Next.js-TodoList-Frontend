"use client";

import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { formSchema } from "@/lib/zodSchema";

interface TodoFormFieldsProps {
  form: UseFormReturn<z.infer<typeof formSchema>>;
}

export function TodoFormFields({ form }: TodoFormFieldsProps) {
  return (
    <>
      <FormField
        control={form.control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Title</FormLabel>
            <FormControl>
              <Input placeholder="Enter your todo title" {...field} />
            </FormControl>
            <FormDescription>
              Your title must be between 2 and 50 characters.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="completed"
        render={({ field }) => (
          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
                name={field.name}
                ref={field.ref}
              />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel>Completed</FormLabel>
              <FormDescription>
                Mark this todo as already completed
              </FormDescription>
            </div>
          </FormItem>
        )}
      />
    </>
  );
}

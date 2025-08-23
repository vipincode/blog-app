"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface ForgotPasswordFormData {
  email: string;
}

export function ForgotPasswordForm() {
  const [isSubmitted, setIsSubmitted] = React.useState(false);
  const form = useForm<ForgotPasswordFormData>({
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = (data: ForgotPasswordFormData) => {
    console.log("Forgot password data:", data);
    // Handle forgot password logic here
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="mx-auto max-w-sm space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Check your email
          </h1>
          <p className="text-sm text-muted-foreground">
            We&nbsp;ve sent a password reset link to your email address.
          </p>
        </div>

        <div className="rounded-lg border bg-card p-6 text-center">
          <p className="text-sm text-muted-foreground mb-4">
            {
              "Didn&nbsp;t receive the email? Check your spam folder or try again."
            }
          </p>
          <Button
            variant="outline"
            onClick={() => setIsSubmitted(false)}
            className="w-full"
          >
            Try again
          </Button>
        </div>

        <div className="text-center text-sm">
          <Button variant="link" className="px-0 font-normal">
            Back to sign in
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-sm space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          Forgot your password?
        </h1>
        <p className="text-sm text-muted-foreground">
          Enter your email address and we&nbsp;ll send you a link to reset your
          password.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            rules={{
              required: "Email is required",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Invalid email address",
              },
            }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="Enter your email address"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  We&nbsp;ll send a password reset link to this email address.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full">
            Send reset link
          </Button>
        </form>
      </Form>

      <div className="text-center text-sm">
        Remember your password?{" "}
        <Button variant="link" className="px-0 font-normal">
          Back to sign in
        </Button>
      </div>
    </div>
  );
}

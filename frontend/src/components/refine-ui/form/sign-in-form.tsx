"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { useLogin, useRefineOptions } from "@refinedev/core";

export const SignInForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { title } = useRefineOptions();
  const { mutate: login } = useLogin();

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    login({
      email: username,
      password,
    });
  };

  const handleSignInWithGoogle = () => {
    login({
      providerName: "google",
    });
  };

  const handleSignInWithGitHub = () => {
    login({
      providerName: "github",
    });
  };

  return (
    <div
      className={cn(
        "flex",
        "flex-col",
        "items-center",
        "justify-center",
        "px-6",
        "py-8",
        "min-h-svh"
      )}
    >
      <div className={cn("flex", "items-center", "justify-center")}>
        {title.icon && (
          <div
            className={cn("text-foreground", "[&>svg]:w-12", "[&>svg]:h-12")}
          >
            {title.icon}
          </div>
        )}
      </div>

      <Card className={cn("sm:w-[456px]", "p-12", "mt-6")}>
        <CardHeader className={cn("px-0")}>
          <CardTitle
            className={cn(
              "text-blue-600",
              "dark:text-blue-400",
              "text-3xl",
              "font-semibold"
            )}
          >
            Sign in
          </CardTitle>
        </CardHeader>

        <Separator />

        <CardContent className={cn("px-0")}>
          <form onSubmit={handleSignIn}>
            <div className={cn("flex", "flex-col", "gap-2")}>
              <Input
                id="username"
                placeholder="Username"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <Button type="submit" size="lg" className={cn("w-full", "mt-6")}>
              Sign in
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

SignInForm.displayName = "SignInForm";

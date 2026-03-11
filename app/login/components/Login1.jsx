"use client";

import { Button, Input, Label } from "@relume_io/relume-ui";
import React, { useState } from "react";
import { BiLogoGoogle } from "react-icons/bi";
import { useRouter } from "next/navigation";
import { supabase } from "../../../lib/supabase";

export function Login1() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (!supabase) {
        setError(
          "Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local.",
        );
        return;
      }

      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        setError(signInError.message);
        return;
      }

      router.push("/dashboard");
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="relume" className="px-[5%]">
      <div className="relative flex min-h-svh flex-col justify-center overflow-auto py-24 lg:py-20">
        <div className="absolute left-0 right-0 top-0 flex h-16 w-full items-center justify-between md:h-18">
          <a href="#">
            <span className="text-2xl font-black tracking-tight text-white">MyBro</span>
          </a>
          <div className="inline-flex gap-x-1">
            <p className="hidden md:block">Join MyBro and start training</p>
          </div>
        </div>
        <div className="mx-auto w-full max-w-sm">
          <div className="rb-6 mb-6 text-center md:mb-8">
            <h1 className="mb-5 text-5xl font-bold md:mb-6 md:text-7xl lg:text-8xl">
              Login
            </h1>
            <p className="md:text-md">
              Pick up where you left off with your training
            </p>
          </div>
          <form className="grid grid-cols-1 gap-6" onSubmit={handleSubmit}>
            <div className="grid w-full items-center">
              <Label htmlFor="email" className="mb-2">
                Email
              </Label>
              <Input
                type="email"
                id="email"
                required={true}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="grid w-full items-center">
              <Label htmlFor="password" className="mb-2">
                Password
              </Label>
              <Input
                type="password"
                id="password"
                required={true}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {error && (
              <p className="text-sm text-red-600">
                {error}
              </p>
            )}
            <div className="grid grid-cols-1 gap-4">
              <Button
                type="submit"
                variant={undefined}
                size={undefined}
                iconLeft={undefined}
                iconRight={undefined}
                disabled={loading}
              >
                {loading ? "Signing in..." : "Sign in"}
              </Button>
              <Button
                variant="secondary"
                size={undefined}
                iconLeft={<BiLogoGoogle className="size-6" />}
                iconRight={undefined}
                className="gap-x-3"
              >
                Continue with Google
              </Button>
            </div>
          </form>
          <div className="mt-5 w-full text-center md:mt-6">
            <a href="/register" className="underline">
              New here? Create an account
            </a>
          </div>
        </div>
        <footer className="absolute bottom-0 left-0 right-0 flex h-16 w-full items-center justify-center md:h-18">
          <p className="text-sm">© 2024 MyBro</p>
        </footer>
      </div>
    </section>
  );
}

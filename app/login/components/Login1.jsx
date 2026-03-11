"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "../../../lib/supabase";

export function Login1() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email) { setError("Email is required."); return; }
    if (!password) { setError("Password is required."); return; }

    setLoading(true);
    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
      if (signInError) { setError(signInError.message); return; }
      router.push("/dashboard");
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm text-white placeholder-zinc-600 focus:border-white focus:outline-none transition-colors";
  const labelClass = "mb-1.5 block text-xs font-semibold uppercase tracking-widest text-zinc-500";

  return (
    <section className="min-h-screen bg-zinc-950 text-white px-[5%]">
      <div className="relative flex min-h-screen flex-col justify-center py-24">

        {/* Top bar */}
        <div className="absolute left-0 right-0 top-0 flex h-16 w-full items-center justify-between px-[5%]">
          <Link href="/home" className="text-xl font-black tracking-tight text-white">MyBro</Link>
          <p className="hidden text-sm text-zinc-500 md:block">Don't have an account?{" "}
            <Link href="/register" className="font-bold text-white underline hover:text-zinc-300">Sign up</Link>
          </p>
        </div>

        {/* Form */}
        <div className="mx-auto w-full max-w-sm">
          <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-zinc-500">Welcome back</p>
          <h1 className="mb-2 text-4xl font-black leading-tight md:text-5xl">Log in</h1>
          <p className="mb-8 text-sm text-zinc-400">Pick up where you left off with your training.</p>

          <form onSubmit={handleSubmit} className="grid gap-4">
            <div>
              <label className={labelClass}>Email</label>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Password</label>
              <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
                placeholder="Your password" className={inputClass} />
            </div>
            {error && <p className="text-sm font-semibold text-red-400">{error}</p>}
            <button type="submit" disabled={loading}
              className="mt-2 bg-white px-6 py-3 text-sm font-black text-black hover:bg-zinc-200 transition-colors disabled:opacity-50">
              {loading ? "Signing in..." : "Sign in →"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-zinc-500">
            New here?{" "}
            <Link href="/register" className="font-bold text-white underline hover:text-zinc-300">Create an account</Link>
          </p>
        </div>

        {/* Footer */}
        <footer className="absolute bottom-0 left-0 right-0 flex h-16 w-full items-center justify-center">
          <p className="text-xs text-zinc-600">© 2025 MyBro. All rights reserved.</p>
        </footer>

      </div>
    </section>
  );
}
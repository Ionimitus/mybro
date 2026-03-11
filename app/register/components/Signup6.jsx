"use client";

import React, { useState, useEffect } from "react";
import { BiSolidStar } from "react-icons/bi";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "../../../lib/supabase";

const QUOTES = [
  { text: "The only bad workout is the one that didn't happen.", author: "Every Lifter Ever", sub: "Consistency beats perfection" },
  { text: "You don't have to be great to start, but you have to start to be great.", author: "Zig Ziglar", sub: "We can make it" },
  { text: "Strength does not come from the body. It comes from the will.", author: "Amadeus Wolfgang Mozart", sub: "Mind over matter" },
  { text: "Your body can stand almost anything. It's your mind you have to convince.", author: "Sir Clyde", sub: "Consistency is the best policy" },
  { text: "Train insane or remain the same.", author: "Fitness Mantra", sub: "No shortcuts lil bro" },
];

function QuoteCarousel() {
  const [idx, setIdx] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setVisible(false);
      setTimeout(() => { setIdx((i) => (i + 1) % QUOTES.length); setVisible(true); }, 400);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const q = QUOTES[idx];

  return (
    <div className="flex flex-col items-center justify-center h-full px-10 py-16 text-center">
      <div className="flex gap-1 mb-8">
        {[...Array(5)].map((_, i) => <BiSolidStar key={i} className="size-5 text-white" />)}
      </div>
      <blockquote className="text-2xl font-black leading-snug md:text-3xl transition-opacity duration-300"
        style={{ opacity: visible ? 1 : 0 }}>
        "{q.text}"
      </blockquote>
      <div className="mt-8 border-t border-zinc-700 pt-6 w-full max-w-xs">
        <p className="font-bold text-sm">{q.author}</p>
        <p className="text-xs text-zinc-500 mt-0.5">{q.sub}</p>
      </div>
      <div className="flex gap-2 mt-8">
        {QUOTES.map((_, i) => (
          <button key={i} onClick={() => setIdx(i)}
            className={"h-1.5 rounded-full transition-all duration-300 " + (i === idx ? "w-6 bg-white" : "w-1.5 bg-zinc-600")} />
        ))}
      </div>
    </div>
  );
}

export function Signup6() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordErrors, setPasswordErrors] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePasswordChange = (e) => {
    const val = e.target.value;
    setPassword(val);
    const errs = [];
    if (val.length < 6) errs.push("At least 6 characters");
    if (!/[0-9]/.test(val)) errs.push("At least one number");
    if (!/[A-Z]/.test(val)) errs.push("At least one uppercase letter");
    setPasswordErrors(errs);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError("Please enter a valid email address."); return; }
    if (password.length < 6) { setError("Password must be at least 6 characters."); return; }
    if (!/[0-9]/.test(password)) { setError("Password must contain at least one number."); return; }
    if (!/[A-Z]/.test(password)) { setError("Password must contain at least one uppercase letter."); return; }
    if (password !== confirmPassword) { setError("Passwords do not match."); return; }
    setLoading(true);
    try {
      const { error: signUpError } = await supabase.auth.signUp({ email, password });
      if (signUpError) { setError(signUpError.message); return; }
      router.push("/dashboard");
    } catch { setError("An unexpected error occurred. Please try again."); }
    finally { setLoading(false); }
  };

  const inputClass = "w-full border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm text-white placeholder-zinc-600 focus:border-white focus:outline-none transition-colors";
  const labelClass = "mb-1.5 block text-xs font-semibold uppercase tracking-widest text-zinc-500";

  return (
    <section className="min-h-screen bg-zinc-950 text-white">
      <div className="grid min-h-screen lg:grid-cols-2">

        {/* Left: Form */}
        <div className="flex flex-col justify-center px-8 py-16 md:px-16">
          <Link href="/home" className="mb-12 text-xl font-black tracking-tight text-white">MyBro</Link>
          <div className="mx-auto w-full max-w-sm">
            <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-zinc-500">Get started</p>
            <h1 className="mb-2 text-4xl font-black leading-tight md:text-5xl">Create your account</h1>
            <p className="mb-8 text-sm text-zinc-400">Join MyBro and start training smarter.</p>

            <form onSubmit={handleSubmit} className="grid gap-4">
              <div>
                <label className={labelClass}>Email</label>
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Password</label>
                <input type="password" required value={password} onChange={handlePasswordChange}
                  placeholder="Min 6 chars, 1 number, 1 uppercase" className={inputClass} />
                {password && (
                  <ul className="mt-2 grid gap-1">
                    {["At least 6 characters", "At least one number", "At least one uppercase letter"].map((rule) => {
                      const passing = !passwordErrors.includes(rule);
                      return (
                        <li key={rule} className={"text-xs flex items-center gap-1.5 " + (passing ? "text-green-400" : "text-zinc-500")}>
                          <span>{passing ? "✓" : "○"}</span> {rule}
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
              <div>
                <label className={labelClass}>Confirm Password</label>
                <input type="password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter your password" className={inputClass} />
                {confirmPassword && password !== confirmPassword && <p className="mt-1 text-xs text-red-400">Passwords do not match</p>}
                {confirmPassword && password === confirmPassword && confirmPassword.length > 0 && <p className="mt-1 text-xs text-green-400">✓ Passwords match</p>}
              </div>
              {error && <p className="text-sm font-semibold text-red-400">{error}</p>}
              <button type="submit" disabled={loading}
                className="mt-2 bg-white px-6 py-3 text-sm font-black text-black hover:bg-zinc-200 transition-colors disabled:opacity-50">
                {loading ? "Creating account..." : "Create account →"}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-zinc-500">
              Already have an account?{" "}
              <Link href="/login" className="font-bold text-white underline hover:text-zinc-300">Log in</Link>
            </p>
          </div>
        </div>

        {/* Right: Motivational Quotes */}
        <div className="hidden lg:flex flex-col bg-zinc-900 border-l border-zinc-800">
          <QuoteCarousel />
        </div>

      </div>
    </section>
  );
}
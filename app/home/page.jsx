"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { Navbar1 } from "./components/Navbar1";
import { Contact17 } from "./components/Contact17";

const TICKER_ITEMS = [
  "Grow Stronger", "Train Smarter", "Own Your Schedule",
  "Log Every Rep", "Beat Yesterday", "AI-Powered",
  "No Excuses", "Stay Consistent",
];

const FEATURES = [
  {
    num: "01",
    label: "AI Scheduler",
    heading: "Your Bro plans your week",
    body: "Tell it your program — PPL, Upper/Lower, Full Body, whatever. It reads your calendar, finds the gaps, and fills them with workouts. No conflicts, no guesswork.",
    stat: "3–5x", statLabel: "sessions/week, automatically",
  },
  {
    num: "02",
    label: "Workout Log",
    heading: "Every set. Every rep. Tracked.",
    body: "Log exercises in seconds, filter by muscle group, and build a training history the dashboard actually learns from. Watch your PRs stack up over time.",
    stat: "100+", statLabel: "exercises in the database",
  },
  {
    num: "03",
    label: "Smart Calendar",
    heading: "Block life. Schedule gains.",
    body: "Add your busy blocks — school, work, whatever — and the AI routes around them. Your workouts live right on the same calendar so nothing clashes.",
    stat: "0", statLabel: "scheduling conflicts",
  },
  {
    num: "04",
    label: "Dashboard",
    heading: "See what you've built",
    body: "Live stats from your actual logs. Consistency rate, muscle groups hit, heaviest lifts, weekly frequency. Real numbers, not motivation poster fluff.",
    stat: "Consistent", statLabel: "summarized progress",
  },
];

function Ticker() {
  return (
    <div className="overflow-hidden border-y border-zinc-800 bg-zinc-950 py-4">
      <div className="flex animate-[marquee_20s_linear_infinite] whitespace-nowrap">
        {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
          <span key={i} className="mx-8 text-sm font-black uppercase tracking-widest text-zinc-500">
            {item} <span className="text-zinc-700">✦</span>
          </span>
        ))}
      </div>
      <style>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}

function FeatureRow({ feat, index }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="grid grid-cols-1 gap-8 border-b border-zinc-800 py-12 md:grid-cols-[5rem_1fr_1fr] md:gap-12 md:py-16"
    >
      <div className="flex items-start gap-4 md:flex-col md:gap-2">
        <span className="text-xs font-black text-zinc-600">{feat.num}</span>
        <span className="text-xs font-semibold uppercase tracking-widest text-zinc-500">{feat.label}</span>
      </div>
      <div>
        <h3 className="mb-3 text-3xl font-black leading-tight md:text-4xl">{feat.heading}</h3>
        <p className="text-sm leading-relaxed text-zinc-400">{feat.body}</p>
      </div>
      <div className="flex items-center gap-6 border border-zinc-800 bg-zinc-900 px-6 py-5 md:items-start md:flex-col md:justify-center">
        <p className="text-5xl font-black leading-none">{feat.stat}</p>
        <p className="text-xs text-zinc-500">{feat.statLabel}</p>
      </div>
    </motion.div>
  );
}

export default function Page() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <Navbar1 />

      {/* ── Hero ── */}
      <section className="relative flex min-h-screen flex-col justify-between overflow-hidden px-[5%] pb-16 pt-24">
        {/* Background grid */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: "linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)", backgroundSize: "80px 80px" }} />

        {/* Big heading */}
        <div className="relative z-10 flex-1 flex flex-col justify-center">
          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={mounted ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="mb-4 text-xs font-semibold uppercase tracking-widest text-zinc-500">
            AI-Integrated Fitness Scheduling
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 30 }} animate={mounted ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-[13vw] font-black leading-[0.9] tracking-tight md:text-[10vw]">
            MY<br /><span className="text-zinc-500">BRO</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }} animate={mounted ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-8 max-w-md text-base text-zinc-400 md:text-lg">
            The AI that fits your workouts around your life — not the other way around.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }} animate={mounted ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="mt-10 flex flex-wrap gap-4">
            <Link href="/register"
              className="bg-white px-8 py-4 text-sm font-black text-black hover:bg-zinc-200 transition-colors">
              Start for free →
            </Link>
            <Link href="/login"
              className="border border-zinc-700 px-8 py-4 text-sm font-bold text-zinc-400 hover:border-white hover:text-white transition-colors">
              Log in
            </Link>
          </motion.div>
        </div>

        {/* Bottom stats bar */}
        <motion.div
          initial={{ opacity: 0 }} animate={mounted ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="relative z-10 mt-16 grid grid-cols-2 gap-px border border-zinc-800 bg-zinc-800 md:grid-cols-4">
          {[
            { val: "PPL", label: "& more programs" },
            { val: "AI", label: "conflict-free scheduling" },
            { val: "100+", label: "exercises tracked" },
            { val: "ZERO EXCUSES", label: "NO SLACKING" },
          ].map(({ val, label }) => (
            <div key={label} className="bg-zinc-950 px-6 py-5">
              <p className="text-2xl font-black">{val}</p>
              <p className="mt-0.5 text-xs text-zinc-500">{label}</p>
            </div>
          ))}
        </motion.div>
      </section>

      {/* ── Ticker ── */}
      <Ticker />

      {/* ── About Us ── */}
      <section id="about" className="px-[5%] py-16 md:py-24">
        <div className="container">
          <div className="grid gap-12 md:grid-cols-2 md:gap-20 md:items-center">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-zinc-500">About Us</p>
              <h2 className="mb-6 text-4xl font-black leading-tight md:text-5xl">
                Built by lifters,<br />for lifters
              </h2>
              <p className="mb-4 text-sm leading-relaxed text-zinc-400">
                MyBro was born out of a simple frustration — great training programs exist, but life keeps getting in the way. Work, school, errands. The gym ends up skipped not because you don't want to go, but because nobody helped you fit it in.
              </p>
              <p className="mb-4 text-sm leading-relaxed text-zinc-400">
                We built MyBro to solve exactly that. An AI that doesn't just hand you a generic program, but actually looks at your week, sees the gaps, and slots your workouts in. No clashes. No rescheduling. Just show up and lift.
              </p>
              <p className="text-sm leading-relaxed text-zinc-400">
                Whether you're running PPL six days a week or squeezing in three full-body sessions around a packed schedule — MyBro keeps you consistent.
              </p>
            </div>
            <div className="grid gap-4">
              {[
                { val: "2026", label: "Founded" },
                { val: "30+", label: "Exercises in the database" },
                { val: "6", label: "Training programs supported" },
                { val: "ZERO EXCUSES!!", label: "NO SLACKING" },
              ].map(({ val, label }) => (
                <div key={label} className="flex items-center justify-between border border-zinc-800 bg-zinc-900 px-6 py-4">
                  <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500">{label}</p>
                  <p className="text-2xl font-black">{val}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" className="px-[5%] py-16 md:py-24">
        <div className="container">
          <div className="mb-4 flex items-end justify-between border-b border-zinc-800 pb-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500">What it does</p>
              <h2 className="mt-2 text-4xl font-black md:text-5xl">Everything in one place</h2>
            </div>
            <Link href="/register" className="hidden text-xs font-bold text-zinc-500 underline hover:text-white md:block">
              Get started →
            </Link>
          </div>
          {FEATURES.map((feat, i) => <FeatureRow key={i} feat={feat} index={i} />)}
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="border-y border-zinc-800 bg-zinc-900 px-[5%] py-16 md:py-24">
        <div className="container">
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-zinc-500">Process</p>
          <h2 className="mb-12 text-4xl font-black md:text-5xl">Up and running in minutes</h2>
          <div className="grid gap-px bg-zinc-800 md:grid-cols-3">
            {[
              { step: "01", title: "Create your account", body: "Sign up, set your fitness level and goal. Takes 30 seconds." },
              { step: "02", title: "Set your schedule", body: "Add when you're free to train and block out your busy times — school, work, life." },
              { step: "03", title: "Let your Bro handle it", body: "Pick a program, hit generate. The AI builds your week, you just show up and lift." },
            ].map(({ step, title, body }) => (
              <div key={step} className="bg-zinc-900 px-8 py-10">
                <p className="mb-6 text-5xl font-black text-zinc-800">{step}</p>
                <h3 className="mb-3 text-xl font-black">{title}</h3>
                <p className="text-sm text-zinc-500">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="px-[5%] py-16 md:py-24">
        <div className="container max-w-3xl">
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-zinc-500">FAQ</p>
          <h2 className="mb-10 text-4xl font-black md:text-5xl">Common questions</h2>
          <div className="grid gap-px bg-zinc-800">
            {[
              { q: "Do I need a membership?", a: "Yes — MyBro is a member-only platform. Create a free account to access the workout log, AI scheduler, exercise database, and dashboard." },
              { q: "How does the AI scheduler work?", a: "You set your weekly availability and block out busy times. Pick a training program (PPL, Upper/Lower, etc.) and the AI generates a conflict-free schedule fitted exactly to your calendar." },
              { q: "What programs are supported?", a: "PPL (Push/Pull/Legs), Upper/Lower, Full Body, Bro Split, 5/3/1, and a custom AI-decided option. More coming." },
              { q: "Can I log custom exercises?", a: "The exercise database has 100+ movements. You can log any exercise against any muscle group from your workout log." },
              { q: "Is my data private?", a: "Yes. Your schedule, workouts, and profile are only accessible to your account via Supabase row-level security." },
            ].map(({ q, a }, i) => (
              <details key={i} className="group bg-zinc-950">
                <summary className="flex cursor-pointer items-center justify-between gap-4 px-6 py-5 font-bold hover:bg-zinc-900 transition-colors list-none">
                  {q}
                  <span className="text-zinc-600 transition-transform group-open:rotate-45 shrink-0 text-xl">+</span>
                </summary>
                <p className="border-t border-zinc-800 px-6 py-4 text-sm text-zinc-400">{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── Contact Us ── */}
      <section id="contact" className="border-y border-zinc-800 px-[5%] py-16 md:py-24">
        <div className="container">
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-zinc-500">Contact Us</p>
          <h2 className="mb-12 text-4xl font-black leading-tight md:text-5xl">Get in touch</h2>
          <Contact17 />
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="px-[5%] py-24">
        <div className="container">
          <div className="relative overflow-hidden border border-zinc-800 bg-zinc-900 px-8 py-20 text-center md:px-16 md:py-28">
            {/* Background grid */}
            <div className="pointer-events-none absolute inset-0 opacity-[0.03]"
              style={{ backgroundImage: "linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)", backgroundSize: "60px 60px" }} />
            <p className="relative mb-4 text-xs font-semibold uppercase tracking-widest text-zinc-500">Ready?</p>
            <h2 className="relative mb-6 text-5xl font-black leading-tight md:text-7xl">
              Train smarter.<br />Start today.
            </h2>
            <p className="relative mx-auto mb-10 max-w-md text-zinc-400">
              Join MyBro. Built for people who take their training seriously but still have a life outside the gym.
            </p>
            <div className="relative flex flex-wrap justify-center gap-4">
              <Link href="/register"
                className="bg-white px-10 py-4 text-sm font-black text-black hover:bg-zinc-200 transition-colors">
                Create free account →
              </Link>
              <Link href="/login"
                className="border border-zinc-700 px-10 py-4 text-sm font-bold text-zinc-400 hover:border-white hover:text-white transition-colors">
                Already a member
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-zinc-800 px-[5%] py-8">
        <div className="container flex flex-wrap items-center justify-between gap-4 text-xs text-zinc-600">
          <p className="font-black text-sm text-white">MyBro</p>
          <p>© 2026 MyBro. Built for lifters who refuse to settle.</p>
          <div className="flex gap-6">
            <Link href="/login" className="hover:text-zinc-400 transition-colors">Login</Link>
            <Link href="/register" className="hover:text-zinc-400 transition-colors">Register</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

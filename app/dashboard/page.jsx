"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { supabase } from "../../lib/supabase";
import { Navbar1 } from "./components/Navbar1";
import { Footer4 } from "./components/Footer4";
import CalendarView from "../components/calendar";

// ── Weekly Volume Bar Chart ─────────────────────────────────────────────────
function WeeklyChart({ logs }) {
  const days = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
  const now = new Date();
  // Build Mon–Sun of current week
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - ((now.getDay() + 6) % 7));
  weekStart.setHours(0, 0, 0, 0);

  const buckets = days.map((label, i) => {
    const day = new Date(weekStart);
    day.setDate(weekStart.getDate() + i);
    const dayStr = day.toDateString();
    const sets = logs.filter((l) => new Date(l.logged_at).toDateString() === dayStr).length;
    const isToday = day.toDateString() === now.toDateString();
    return { label, sets, isToday };
  });

  const maxSets = Math.max(...buckets.map((b) => b.sets), 1);

  return (
    <div className="border border-zinc-800 bg-zinc-900">
      <div className="border-b border-zinc-800 px-6 py-4 flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400">Weekly volume</p>
        <p className="text-xs text-zinc-600">Sets logged per day</p>
      </div>
      <div className="px-6 py-6">
        <div className="flex items-end justify-between gap-2 h-32">
          {buckets.map(({ label, sets, isToday }) => (
            <div key={label} className="flex flex-1 flex-col items-center gap-2">
              <p className="text-xs font-black text-zinc-400">{sets > 0 ? sets : ""}</p>
              <div className="w-full flex flex-col justify-end" style={{ height: "80px" }}>
                <div
                  className={"w-full transition-all duration-500 " + (isToday ? "bg-white" : sets > 0 ? "bg-zinc-500" : "bg-zinc-800")}
                  style={{ height: sets > 0 ? `${Math.max(8, (sets / maxSets) * 80)}px` : "4px" }}
                />
              </div>
              <p className={"text-xs font-semibold " + (isToday ? "text-white" : "text-zinc-600")}>{label}</p>
            </div>
          ))}
        </div>
        {buckets.every((b) => b.sets === 0) && (
          <p className="mt-3 text-center text-xs text-zinc-600">No sets logged this week yet</p>
        )}
      </div>
    </div>
  );
}

// ── Muscle Group Breakdown ──────────────────────────────────────────────────
function MuscleBreakdown({ logs }) {
  const MUSCLES = ["Chest","Back","Shoulders","Legs","Biceps","Triceps","Abs"];
  const sevenDaysAgo = new Date(); sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const recent = logs.filter((l) => new Date(l.logged_at) >= sevenDaysAgo);
  const counts = Object.fromEntries(MUSCLES.map((m) => [m, 0]));
  recent.forEach((l) => { if (l.muscle_group && counts[l.muscle_group] !== undefined) counts[l.muscle_group]++; });
  const max = Math.max(...Object.values(counts), 1);

  return (
    <div className="border border-zinc-800 bg-zinc-900">
      <div className="border-b border-zinc-800 px-6 py-4">
        <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400">Muscle groups this week</p>
      </div>
      <div className="grid grid-cols-7 gap-px bg-zinc-800">
        {MUSCLES.map((m) => {
          const count = counts[m];
          const intensity = count === 0 ? "bg-zinc-900" : count / max > 0.6 ? "bg-white" : count / max > 0.3 ? "bg-zinc-400" : "bg-zinc-600";
          return (
            <div key={m} className={"flex flex-col items-center gap-2 py-4 " + intensity.replace("bg-", "bg-").split(" ")[0]}>
              <div className={"h-8 w-8 " + intensity} style={{ opacity: count === 0 ? 0.15 : 1 }} />
              <p className={"text-center text-xs font-bold " + (count > 0 ? "text-white" : "text-zinc-700")} style={{ fontSize: "0.6rem" }}>{m}</p>
              {count > 0 && <p className="text-xs font-black text-zinc-400">{count}</p>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function StatCard({ label, value, sub, accent, loading }) {
  return (
    <div className="relative overflow-hidden border border-zinc-800 bg-zinc-900 p-6">
      {accent && <div className="absolute right-0 top-0 h-1 w-full" style={{ background: accent }} />}
      <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-zinc-500">{label}</p>
      <p className="mb-1 text-4xl font-black text-white">{loading ? "—" : value}</p>
      {sub && <p className="text-xs text-zinc-500">{sub}</p>}
    </div>
  );
}

export default function Page() {
  const [uid, setUid] = useState(null);
  const [stats, setStats] = useState(null);
  const [userName, setUserName] = useState("");
  const [allLogs, setAllLogs] = useState([]);
  const [recentLogs, setRecentLogs] = useState([]);
  const [upcomingWorkouts, setUpcomingWorkouts] = useState([]);
  const [calendarKey, setCalendarKey] = useState(0);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async (userId) => {
    const thirtyDaysAgo = new Date(); thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const sevenDaysAgo = new Date(); sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const [profileRes, logsRes, scheduledRes, upcomingRes, recentRes] = await Promise.all([
      supabase.from("profiles").select("first_name, program, fitness_level").eq("user_id", userId).single(),
      supabase.from("workout_logs").select("id, muscle_group, weight_kg, logged_at").eq("user_id", userId),
      supabase.from("schedules").select("id, start_at").eq("user_id", userId).gte("start_at", thirtyDaysAgo.toISOString()),
      supabase.from("schedules").select("id, title, start_at, end_at").eq("user_id", userId)
        .gte("start_at", new Date().toISOString()).order("start_at").limit(4),
      supabase.from("workout_logs").select("id, exercise_name, muscle_group, sets, reps, weight_kg, logged_at")
        .eq("user_id", userId).order("logged_at", { ascending: false }).limit(6),
    ]);

    const logs = logsRes.data ?? [];
    const scheduled = scheduledRes.data ?? [];
    const totalWorkouts = logs.length;
    const muscleGroups = new Set(logs.map((l) => l.muscle_group).filter(Boolean)).size;
    const heaviestLift = logs.reduce((max, l) => (l.weight_kg > max ? l.weight_kg : max), 0);
    const loggedDays = new Set(logs.filter((l) => new Date(l.logged_at) >= thirtyDaysAgo).map((l) => new Date(l.logged_at).toDateString())).size;
    const consistency = Math.min(100, scheduled.length ? Math.round((loggedDays / scheduled.length) * 100) : 0);
    const weeklyDays = new Set(logs.filter((l) => new Date(l.logged_at) >= sevenDaysAgo).map((l) => new Date(l.logged_at).toDateString())).size;

    setUserName(profileRes.data?.first_name || "");
    setStats({ totalWorkouts, muscleGroups, heaviestLift, consistency, weeklyDays, program: profileRes.data?.program || "No program set" });
    setAllLogs(logs);
    setRecentLogs(recentRes.data ?? []);
    setUpcomingWorkouts(upcomingRes.data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user?.id) { setLoading(false); return; }
      setUid(session.user.id);
      await loadData(session.user.id);
    })();
  }, [loadData]);

  const deleteLog = async (id) => {
    if (!confirm("Remove this log entry?")) return;
    await supabase.from("workout_logs").delete().eq("id", id);
    await loadData(uid);
  };

  const deleteSchedule = async (id) => {
    if (!confirm("Remove this scheduled workout?")) return;
    await supabase.from("schedules").delete().eq("id", id);
    setUpcomingWorkouts((prev) => prev.filter((w) => w.id !== id));
    setCalendarKey((k) => k + 1);
  };

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  };



  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <Navbar1 />

      {/* Hero greeting */}
      <section className="border-b border-zinc-800 px-[5%] py-14">
        <div className="container">
          <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-zinc-500">
            {greeting()}{userName ? `, ${userName}` : ""}
          </p>
          <h1 className="text-6xl font-black leading-none tracking-tight text-white md:text-8xl lg:text-9xl">
            {loading ? "Loading..." : stats?.totalWorkouts > 0 ? "Keep\npushing." : "Let's\nget started."}
          </h1>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/workout-log" className="border border-white bg-white px-6 py-3 text-sm font-bold text-black transition-colors hover:bg-zinc-200">
              Log Workout
            </Link>
            <Link href="/schedule#ai-scheduler" className="border border-yellow-400 px-6 py-3 text-sm font-bold text-yellow-400 transition-colors hover:bg-yellow-400 hover:text-black">
              ✦ AI Scheduler
            </Link>
            <Link href="/schedule" className="border border-zinc-700 px-6 py-3 text-sm font-bold text-zinc-400 transition-colors hover:border-white hover:text-white">
              View Schedule
            </Link>
          </div>
        </div>
      </section>

      {/* Stats grid */}
      <section className="px-[5%] py-12">
        <div className="container">
          <p className="mb-6 text-xs font-semibold uppercase tracking-widest text-zinc-500">Your stats</p>
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
            <StatCard label="Total workouts" value={stats?.totalWorkouts ?? 0} sub="Sessions logged all time" accent="#facc15" />
            <StatCard label="This week" value={stats?.weeklyDays ? `${stats.weeklyDays}x` : "0x"} sub="Training days in last 7 days" accent="#facc15" />
            <StatCard label="Muscle groups" value={stats?.muscleGroups ?? 0} sub="Unique groups trained" accent="#eab308" />
            <StatCard label="Heaviest lift" value={stats?.heaviestLift ? `${stats.heaviestLift}kg` : "—"} sub="Top logged weight" accent="#fde047" />
            <StatCard label="Consistency" value={stats?.consistency !== undefined ? `${stats.consistency}%` : "—"} sub="Workouts vs scheduled this month" accent="#facc15" />
            <StatCard label="Program" value={stats?.program ?? "—"} sub="Your current split" accent="#eab308" />
          </div>
        </div>
      </section>

      {/* Charts row */}
      <section className="px-[5%] pb-12">
        <div className="container grid gap-6 lg:grid-cols-2">
          {!loading && <WeeklyChart logs={allLogs} />}
          {!loading && <MuscleBreakdown logs={allLogs} />}
        </div>
      </section>

      {/* Upcoming + Recent */}
      <section className="px-[5%] pb-12">
        <div className="container grid gap-6 lg:grid-cols-2">

          {/* Upcoming workouts */}
          <div className="border border-zinc-800 bg-zinc-900">
            <div className="border-b border-zinc-800 px-6 py-4 flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400">Upcoming workouts</p>
              <Link href="/schedule" className="text-xs text-zinc-500 underline hover:text-white">See all</Link>
            </div>
            {loading ? (
              <p className="px-6 py-8 text-sm text-zinc-500">Loading...</p>
            ) : upcomingWorkouts.length === 0 ? (
              <div className="px-6 py-8">
                <p className="text-sm text-zinc-500">No workouts scheduled yet.</p>
                <Link href="/schedule" className="mt-3 inline-block text-sm text-white underline">Generate with AI →</Link>
              </div>
            ) : (
              upcomingWorkouts.map((w) => {
                const d = new Date(w.start_at);
                return (
                  <div key={w.id} className="flex items-center gap-4 border-b border-zinc-800 px-6 py-4 last:border-0">
                    <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center border border-zinc-700 text-center">
                      <span className="text-xs text-zinc-500">{d.toLocaleDateString([], { weekday: "short" })}</span>
                      <span className="text-lg font-black">{d.getDate()}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold truncate">{w.title}</p>
                      <p className="text-xs text-zinc-500">
                        {d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} · {Math.round((new Date(w.end_at) - d) / 60000)} min
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      <Link href="/workout-log" className="border border-zinc-700 px-3 py-1.5 text-xs font-semibold hover:border-white transition-colors">
                        Start →
                      </Link>
                      <button onClick={() => deleteSchedule(w.id)}
                        className="border border-zinc-800 px-2 py-1.5 text-xs text-zinc-600 hover:border-red-500 hover:text-red-400 transition-colors">
                        ✕
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Recent logs */}
          <div className="border border-zinc-800 bg-zinc-900">
            <div className="border-b border-zinc-800 px-6 py-4 flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400">Recent activity</p>
              <Link href="/workout-log" className="text-xs text-zinc-500 underline hover:text-white">Log workout</Link>
            </div>
            {loading ? (
              <p className="px-6 py-8 text-sm text-zinc-500">Loading...</p>
            ) : recentLogs.length === 0 ? (
              <div className="px-6 py-8">
                <p className="text-sm text-zinc-500">No workouts logged yet.</p>
                <Link href="/workout-log" className="mt-3 inline-block text-sm text-white underline">Log your first workout →</Link>
              </div>
            ) : (
              recentLogs.map((log) => (
                <div key={log.id} className="flex items-center justify-between border-b border-zinc-800 px-6 py-4 last:border-0">
                  <div className="min-w-0 flex-1">
                    <p className="font-bold truncate">{log.exercise_name}</p>
                    <p className="text-xs text-zinc-500">{log.muscle_group} · {new Date(log.logged_at).toLocaleDateString()}</p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <div className="flex gap-2 text-sm text-zinc-400">
                      {log.reps && <span>{log.reps} reps</span>}
                      {log.weight_kg && <span className="font-semibold text-white">{log.weight_kg}kg</span>}
                    </div>
                    <button onClick={() => deleteLog(log.id)}
                      className="border border-zinc-800 px-2 py-1 text-xs text-zinc-600 hover:border-red-500 hover:text-red-400 transition-colors">
                      ✕
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Calendar */}
      <section className="px-[5%] pb-16">
        <div className="container">
          <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-zinc-500">This week</p>
          <div className="border border-zinc-800 bg-zinc-900 p-4 overflow-hidden">
            <style>{`
              .fc { color: #e4e4e7; }
              .fc .fc-toolbar-title { color: #fff; font-weight: 900; font-size: 1.1rem; }
              .fc .fc-button { background: #27272a; border-color: #3f3f46; color: #e4e4e7; }
              .fc .fc-button:hover { background: #3f3f46; }
              .fc .fc-button-primary:not(:disabled).fc-button-active { background: #fff; color: #000; border-color: #fff; }
              .fc .fc-col-header-cell { background: #18181b; border-color: #3f3f46; }
              .fc .fc-col-header-cell-cushion { color: #a1a1aa; font-size: 0.7rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; }
              .fc td, .fc th { border-color: #27272a !important; }
              .fc .fc-timegrid-slot { border-color: #27272a !important; }
              .fc .fc-timegrid-slot-label { color: #52525b; font-size: 0.7rem; }
              .fc .fc-scrollgrid { border-color: #27272a; }
              .fc-theme-standard .fc-scrollgrid { border: none; }
              .fc .fc-daygrid-day-number { color: #a1a1aa; }
              .fc .fc-day-today { background: rgba(255,255,255,0.03) !important; }
              .fc .fc-event { border-radius: 0; font-size: 0.75rem; font-weight: 700; }
            `}</style>
            <CalendarView dark refreshKey={calendarKey} />
          </div>
        </div>
      </section>

      <Footer4 />
    </div>
  );
}
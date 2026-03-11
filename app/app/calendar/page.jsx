"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "../../lib/supabase";
import CalendarView from "../components/calendar";

// reuse navbar from schedule (same component)
import dynamic from "next/dynamic";

export default function Page() {
  const [counts, setCounts] = useState({ busy: 0, scheduled: 0 });
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user?.id) { setLoading(false); return; }
      const uid = session.user.id;
      const [busyRes, schedRes] = await Promise.all([
        supabase.from("events").select("id", { count: "exact" }).eq("user_id", uid).gte("start_at", new Date().toISOString()),
        supabase.from("schedules").select("id", { count: "exact" }).eq("user_id", uid).gte("start_at", new Date().toISOString()),
      ]);
      setCounts({ busy: busyRes.count ?? 0, scheduled: schedRes.count ?? 0 });
      setLoading(false);
    })();
  }, []);

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Minimal nav */}
      <nav className="flex items-center justify-between border-b border-zinc-800 px-[5%] py-4">
        <Link href="/home" className="text-lg font-black tracking-tight">MyBro</Link>
        <div className="flex gap-6 text-sm text-zinc-400">
          <Link href="/dashboard" className="hover:text-white transition-colors">Dashboard</Link>
          <Link href="/schedule" className="hover:text-white transition-colors">Schedule</Link>
          <Link href="/workout-log" className="hover:text-white transition-colors">Log</Link>
          <Link href="/profile" className="hover:text-white transition-colors">Profile</Link>
        </div>
      </nav>

      {/* Header */}
      <section className="border-b border-zinc-800 px-[5%] py-14">
        <div className="container flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-zinc-500">Overview</p>
            <h1 className="text-6xl font-black leading-none tracking-tight md:text-8xl">
              Your<br /><span className="text-zinc-500">Calendar</span>
            </h1>
          </div>

          <div className="flex gap-4">
            <div className="border border-zinc-800 bg-zinc-900 px-6 py-4 text-center min-w-24">
              <div className="mb-1 flex items-center justify-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-white inline-block" />
                <p className="text-xs text-zinc-500 uppercase tracking-wider">Workouts</p>
              </div>
              <p className="text-2xl font-black">{loading ? "—" : counts.scheduled}</p>
              <p className="text-xs text-zinc-600">upcoming</p>
            </div>
            <div className="border border-zinc-800 bg-zinc-900 px-6 py-4 text-center min-w-24">
              <div className="mb-1 flex items-center justify-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-red-500 inline-block" />
                <p className="text-xs text-zinc-500 uppercase tracking-wider">Busy</p>
              </div>
              <p className="text-2xl font-black">{loading ? "—" : counts.busy}</p>
              <p className="text-xs text-zinc-600">blocks</p>
            </div>
          </div>
        </div>
      </section>

      {/* Legend */}
      <section className="border-b border-zinc-800 px-[5%] py-4">
        <div className="container flex flex-wrap items-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 bg-white inline-block" />
            <span className="text-zinc-400">Scheduled workout</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 bg-red-500 inline-block" />
            <span className="text-zinc-400">Busy / blocked</span>
          </div>
          <div className="ml-auto flex gap-3">
            <Link href="/schedule" className="text-xs border border-zinc-700 px-4 py-2 hover:border-white transition-colors">
              + Add availability
            </Link>
            <Link href="/schedule" className="text-xs bg-white text-black px-4 py-2 font-bold hover:bg-zinc-200 transition-colors">
              Generate AI schedule
            </Link>
          </div>
        </div>
      </section>

      {/* Calendar */}
      <section className="px-[5%] py-10">
        <div className="container">
          <style>{`
            .fc { color: #e4e4e7; font-family: inherit; }
            .fc .fc-toolbar-title { color: #fff; font-weight: 900; font-size: 1.2rem; letter-spacing: -0.02em; }
            .fc .fc-button {
              background: #27272a !important;
              border-color: #3f3f46 !important;
              color: #e4e4e7 !important;
              border-radius: 0 !important;
              font-size: 0.75rem !important;
              font-weight: 700 !important;
              text-transform: uppercase !important;
              letter-spacing: 0.05em !important;
              padding: 0.4rem 0.9rem !important;
            }
            .fc .fc-button:hover { background: #3f3f46 !important; }
            .fc .fc-button-primary:not(:disabled).fc-button-active,
            .fc .fc-button-primary:not(:disabled):active {
              background: #fff !important;
              color: #000 !important;
              border-color: #fff !important;
            }
            .fc .fc-col-header-cell { background: #18181b; border-color: #27272a !important; }
            .fc .fc-col-header-cell-cushion {
              color: #71717a;
              font-size: 0.65rem;
              font-weight: 700;
              text-transform: uppercase;
              letter-spacing: 0.12em;
              padding: 8px 4px;
            }
            .fc td, .fc th { border-color: #27272a !important; }
            .fc .fc-timegrid-slot { border-color: #27272a !important; min-height: 2rem; }
            .fc .fc-timegrid-slot-label { color: #52525b; font-size: 0.65rem; letter-spacing: 0.05em; }
            .fc .fc-scrollgrid { border: 1px solid #27272a !important; }
            .fc .fc-day-today { background: rgba(255,255,255,0.02) !important; }
            .fc .fc-day-today .fc-col-header-cell-cushion { color: #fff !important; }
            .fc .fc-event {
              border-radius: 0 !important;
              font-size: 0.72rem !important;
              font-weight: 700 !important;
              padding: 2px 5px !important;
            }
            .fc .fc-daygrid-day-number { color: #71717a; font-size: 0.8rem; }
            .fc .fc-daygrid-day.fc-day-today .fc-daygrid-day-number { color: #fff; }
            .fc-theme-standard td, .fc-theme-standard th { border-color: #27272a; }
            .fc .fc-highlight { background: rgba(255,255,255,0.05); }
            .fc .fc-timegrid-now-indicator-line { border-color: #22c55e; }
            .fc .fc-timegrid-now-indicator-arrow { border-top-color: #22c55e; border-bottom-color: #22c55e; }
          `}</style>
          <CalendarView dark refreshKey={refreshKey} />
        </div>
      </section>

      <footer className="border-t border-zinc-800 px-[5%] py-8">
        <div className="container flex items-center justify-between text-xs text-zinc-600">
          <p>© 2024 MyBro</p>
          <Link href="/dashboard" className="hover:text-zinc-400 transition-colors">Back to dashboard</Link>
        </div>
      </footer>
    </div>
  );
}

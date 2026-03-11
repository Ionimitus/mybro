"use client";

import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";

export default function CalendarView({ dark = false, refreshKey = 0 }) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user?.id) { setLoading(false); return; }
    const uid = session.user.id;

    const [busyRes, scheduledRes] = await Promise.all([
      supabase.from("events").select("title, start_at, end_at").eq("user_id", uid),
      supabase.from("schedules").select("title, start_at, end_at, completed").eq("user_id", uid),
    ]);

    setEvents([
      ...(busyRes.data ?? []).map((e) => ({
        title: "🚫 " + e.title,
        start: e.start_at, end: e.end_at,
        backgroundColor: "#ef4444", borderColor: "#ef4444", textColor: "#fff",
      })),
      ...(scheduledRes.data ?? []).map((e) => e.completed ? ({
        title: "✓ " + e.title,
        start: e.start_at, end: e.end_at,
        backgroundColor: "#16a34a", borderColor: "#15803d", textColor: "#fff",
      }) : ({
        title: "💪 " + e.title,
        start: e.start_at, end: e.end_at,
        backgroundColor: dark ? "#ffffff" : "#111111",
        borderColor: dark ? "#e4e4e7" : "#111111",
        textColor: dark ? "#000000" : "#ffffff",
      })),
    ]);
    setLoading(false);
  }, [dark]);

  // Refetch whenever refreshKey changes
  useEffect(() => { fetchEvents(); }, [fetchEvents, refreshKey]);

  // Refetch when tab regains focus (user comes back from workout log)
  useEffect(() => {
    const onFocus = () => fetchEvents();
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, [fetchEvents]);

  if (loading) return <p className={`py-8 text-sm ${dark ? "text-zinc-500" : "text-text-secondary"}`}>Loading calendar...</p>;

  return (
    <div>
      <div className="mb-2 flex justify-end">
        <button
          onClick={fetchEvents}
          className="border border-zinc-700 bg-zinc-900 px-3 py-1.5 text-xs font-semibold text-zinc-400 hover:border-white hover:text-white transition-colors"
          title="Refresh calendar"
        >
          ↻ Refresh
        </button>
      </div>
      <FullCalendar
        plugins={[timeGridPlugin, dayGridPlugin, interactionPlugin]}
        initialView="timeGridWeek"
        timeZone="local"
        height="auto"
        events={events}
        headerToolbar={{ left: "prev,next today", center: "title", right: "dayGridMonth,timeGridWeek,timeGridDay" }}
      />
    </div>
  );
}
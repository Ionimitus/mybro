"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";
import CalendarView from "../../components/calendar";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const PROGRAMS = [
  {
    id: "ppl",
    label: "PPL",
    full: "Push / Pull / Legs",
    desc: "Push, Pull, and Leg days cycling 6x/week. Great for intermediate lifters.",
    days: 6,
  },
  {
    id: "ul",
    label: "Upper / Lower",
    full: "Upper Lower Split",
    desc: "Alternates upper and lower body 4x/week. Balanced and efficient.",
    days: 4,
  },
  {
    id: "fullbody",
    label: "Full Body",
    full: "Full Body 3x",
    desc: "Hit every muscle group 3x/week. Best for beginners or busy schedules.",
    days: 3,
  },
  {
    id: "brosplit",
    label: "Bro Split",
    full: "Classic Bro Split",
    desc: "One muscle group per day. Chest Mon, Back Tue, etc. 5x/week.",
    days: 5,
  },
  {
    id: "531",
    label: "5/3/1",
    full: "Wendler 5/3/1",
    desc: "Strength-focused, 4 main lifts over 4 days. Built around progressive overload.",
    days: 4,
  },
  {
    id: "custom",
    label: "Custom",
    full: "Let AI Decide",
    desc: "AI picks the best split based on your availability and workout history.",
    days: null,
  },
];

const inputClass = "w-full border border-zinc-700 bg-zinc-800 px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:border-white focus:outline-none transition-colors";
const selectClass = "w-full border border-zinc-700 bg-zinc-800 px-4 py-2.5 text-sm text-white focus:border-white focus:outline-none transition-colors";
const labelClass = "block text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-2";

export function ScheduleManager() {
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [calendarKey, setCalendarKey] = useState(0);

  // Busy events
  const [busyTitle, setBusyTitle] = useState("");
  const [busyStart, setBusyStart] = useState("");
  const [busyEnd, setBusyEnd] = useState("");
  const [busyEvents, setBusyEvents] = useState([]);
  const [busySaving, setBusySaving] = useState(false);
  const [busyMsg, setBusyMsg] = useState({ text: "", error: false });

  // Availability
  const [availDay, setAvailDay] = useState("Monday");
  const [availStart, setAvailStart] = useState("");
  const [availEnd, setAvailEnd] = useState("");
  const [availability, setAvailability] = useState([]);
  const [availSaving, setAvailSaving] = useState(false);
  const [availMsg, setAvailMsg] = useState({ text: "", error: false });

  useEffect(() => {
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user?.id) { setLoading(false); return; }
      setUserId(session.user.id);
      await loadAll(session.user.id);
      setLoading(false);
    })();
  }, []);

  const loadAll = async (uid) => {
    const [evRes, avRes] = await Promise.all([
      supabase.from("events").select("id, title, start_at, end_at").eq("user_id", uid).order("start_at"),
      supabase.from("availability").select("id, day_of_week, start_time, end_time").eq("user_id", uid),
    ]);
    setBusyEvents(evRes.data ?? []);
    setAvailability(avRes.data ?? []);
  };

  const handleAddBusy = async (e) => {
    e.preventDefault();
    if (!busyTitle.trim()) return setBusyMsg({ text: "Add a title (e.g. School, Work)", error: true });
    if (!busyStart || !busyEnd) return setBusyMsg({ text: "Set start and end time", error: true });
    if (busyStart >= busyEnd) return setBusyMsg({ text: "End must be after start", error: true });
    setBusySaving(true); setBusyMsg({ text: "", error: false });
    const { error } = await supabase.from("events").insert({
      user_id: userId, title: busyTitle.trim(),
      start_at: new Date(busyStart).toISOString(),
      end_at: new Date(busyEnd).toISOString(),
      event_type: "busy",
    });
    setBusySaving(false);
    if (error) return setBusyMsg({ text: error.message, error: true });
    setBusyTitle(""); setBusyStart(""); setBusyEnd("");
    setBusyMsg({ text: "✓ Busy block added", error: false });
    await loadAll(userId);
    setCalendarKey((k) => k + 1);
    setTimeout(() => setBusyMsg({ text: "", error: false }), 3000);
  };

  const handleDeleteBusy = async (id) => {
    await supabase.from("events").delete().eq("id", id);
    await loadAll(userId);
    setCalendarKey((k) => k + 1);
  };

  const handleAddAvail = async (e) => {
    e.preventDefault();
    if (!availStart || !availEnd) return setAvailMsg({ text: "Set start and end time", error: true });
    if (availStart >= availEnd) return setAvailMsg({ text: "End must be after start", error: true });
    setAvailSaving(true); setAvailMsg({ text: "", error: false });
    const { error } = await supabase.from("availability").insert({
      user_id: userId, day_of_week: availDay, start_time: availStart, end_time: availEnd,
    });
    setAvailSaving(false);
    if (error) return setAvailMsg({ text: error.message, error: true });
    setAvailStart(""); setAvailEnd("");
    setAvailMsg({ text: "✓ Availability saved", error: false });
    await loadAll(userId);
    setTimeout(() => setAvailMsg({ text: "", error: false }), 3000);
  };

  const handleDeleteAvail = async (id) => {
    await supabase.from("availability").delete().eq("id", id);
    await loadAll(userId);
  };

  const [freeWeekSaving, setFreeWeekSaving] = useState(false);
  const [freeWeekMsg, setFreeWeekMsg] = useState({ text: "", error: false });

  const handleFreeWholeWeek = async () => {
    if (!userId) return;
    setFreeWeekSaving(true); setFreeWeekMsg({ text: "", error: false });
    // Remove existing availability first to avoid duplicates
    await supabase.from("availability").delete().eq("user_id", userId);
    const rows = DAYS.map((day) => ({
      user_id: userId, day_of_week: day, start_time: "06:00", end_time: "22:00",
    }));
    const { error } = await supabase.from("availability").insert(rows);
    setFreeWeekSaving(false);
    if (error) return setFreeWeekMsg({ text: error.message, error: true });
    setFreeWeekMsg({ text: "✓ Whole week set as free (6am–10pm every day)", error: false });
    await loadAll(userId);
    setTimeout(() => setFreeWeekMsg({ text: "", error: false }), 3000);
  };

  return (
    <>
      {/* Header */}
      <section className="border-b border-zinc-800 px-[5%] py-14">
        <div className="container">
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-zinc-500">Planning</p>
          <h1 className="text-6xl font-black leading-none tracking-tight md:text-8xl">
            Own your<br /><span className="text-zinc-500">Schedule</span>
          </h1>
          <p className="mt-4 max-w-md text-sm text-zinc-400">
            Block out busy time, set when you're free to train, then let the AI fill in your workouts.
          </p>
        </div>
      </section>

      {/* Calendar */}
      <section className="border-b border-zinc-800 px-[5%] py-10">
        <div className="container">
          <div className="mb-5 flex flex-wrap items-center gap-6">
            <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500">Your calendar</p>
            <div className="flex gap-4 text-xs text-zinc-500">
              <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 bg-white inline-block" />Workouts</span>
              <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 bg-red-500 inline-block" />Busy blocks</span>
            </div>
          </div>
          <div className="border border-zinc-800 bg-zinc-900 p-4">
            <style>{`
              .fc { color: #e4e4e7; font-family: inherit; }
              .fc .fc-toolbar-title { color: #fff; font-weight: 900; font-size: 1.1rem; letter-spacing: -0.02em; }
              .fc .fc-button { background: #27272a !important; border-color: #3f3f46 !important; color: #e4e4e7 !important; border-radius: 0 !important; font-size: 0.72rem !important; font-weight: 700 !important; text-transform: uppercase !important; letter-spacing: 0.05em !important; padding: 0.35rem 0.8rem !important; }
              .fc .fc-button:hover { background: #3f3f46 !important; }
              .fc .fc-button-primary:not(:disabled).fc-button-active, .fc .fc-button-primary:not(:disabled):active { background: #fff !important; color: #000 !important; border-color: #fff !important; }
              .fc .fc-col-header-cell { background: #18181b; border-color: #27272a !important; }
              .fc .fc-col-header-cell-cushion { color: #71717a; font-size: 0.65rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.12em; padding: 8px 4px; }
              .fc td, .fc th { border-color: #27272a !important; }
              .fc .fc-timegrid-slot { border-color: #27272a !important; }
              .fc .fc-timegrid-slot-label { color: #52525b; font-size: 0.65rem; }
              .fc .fc-scrollgrid { border: 1px solid #27272a !important; }
              .fc .fc-day-today { background: rgba(255,255,255,0.02) !important; }
              .fc .fc-day-today .fc-col-header-cell-cushion { color: #fff !important; }
              .fc .fc-event { border-radius: 0 !important; font-size: 0.72rem !important; font-weight: 700 !important; padding: 2px 5px !important; }
              .fc .fc-timegrid-now-indicator-line { border-color: #22c55e; }
              .fc .fc-timegrid-now-indicator-arrow { border-top-color: #22c55e; border-bottom-color: #22c55e; }
              .fc .fc-daygrid-day-number { color: #71717a; font-size: 0.8rem; }
            `}</style>
            <CalendarView key={calendarKey} dark />
          </div>
        </div>
      </section>

      {/* Busy + Availability forms */}
      <section className="border-b border-zinc-800 px-[5%] py-12">
        <div className="container grid gap-6 lg:grid-cols-2">
          {/* Block busy time */}
          <div className="border border-zinc-800 bg-zinc-900">
            <div className="border-b border-zinc-800 px-6 py-4">
              <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500">Block busy time</p>
              <h2 className="mt-1 text-xl font-black">When are you unavailable?</h2>
              <p className="mt-1 text-xs text-zinc-500">School, work, classes — anything that takes up your time.</p>
            </div>
            <div className="p-6">
              <form onSubmit={handleAddBusy} className="grid gap-4">
                <div>
                  <label className={labelClass}>Title</label>
                  <input className={inputClass} type="text" placeholder="e.g. School, Work, Doctor" value={busyTitle} onChange={(e) => setBusyTitle(e.target.value)} disabled={busySaving} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelClass}>Start</label>
                    <input className={inputClass} type="datetime-local" value={busyStart} onChange={(e) => setBusyStart(e.target.value)} disabled={busySaving} />
                  </div>
                  <div>
                    <label className={labelClass}>End</label>
                    <input className={inputClass} type="datetime-local" value={busyEnd} onChange={(e) => setBusyEnd(e.target.value)} disabled={busySaving} />
                  </div>
                </div>
                {busyMsg.text && <p className={"text-xs font-semibold " + (busyMsg.error ? "text-red-400" : "text-green-400")}>{busyMsg.text}</p>}
                <button type="submit" disabled={busySaving || !userId} className="bg-white px-6 py-3 text-sm font-black text-black hover:bg-zinc-200 transition-colors disabled:opacity-50">
                  {busySaving ? "Saving..." : "Add busy block"}
                </button>
              </form>
              {busyEvents.length > 0 && (
                <div className="mt-6 border-t border-zinc-800 pt-5">
                  <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-zinc-500">Saved blocks</p>
                  <div className="grid gap-2 max-h-48 overflow-y-auto">
                    {busyEvents.map((ev) => {
                      const s = new Date(ev.start_at); const en = new Date(ev.end_at);
                      return (
                        <div key={ev.id} className="flex items-center justify-between gap-3 border border-zinc-800 px-4 py-3">
                          <div>
                            <p className="text-sm font-bold">{ev.title}</p>
                            <p className="text-xs text-zinc-500">{s.toLocaleDateString([], { weekday: "short", month: "short", day: "numeric" })} · {s.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}–{en.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</p>
                          </div>
                          <button onClick={() => handleDeleteBusy(ev.id)} className="text-xs text-zinc-600 hover:text-red-400 transition-colors shrink-0">Remove</button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Set availability */}
          <div className="border border-zinc-800 bg-zinc-900">
            <div className="border-b border-zinc-800 px-6 py-4">
              <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500">Free windows</p>
              <h2 className="mt-1 text-xl font-black">When can you train?</h2>
              <p className="mt-1 text-xs text-zinc-500">Set recurring weekly windows — the AI schedules workouts inside these.</p>
            </div>
            <div className="p-6">
              {/* Quick-fill: free whole week */}
              <div className="mb-5 border border-zinc-700 bg-zinc-800 p-4">
                <p className="mb-1 text-xs font-bold uppercase tracking-widest text-zinc-400">Quick fill</p>
                <p className="mb-3 text-xs text-zinc-500">Set every day as free from 6am–10pm in one click. Replaces existing availability.</p>
                <button type="button" onClick={handleFreeWholeWeek} disabled={freeWeekSaving || !userId}
                  className="w-full border border-white bg-white px-4 py-2.5 text-sm font-black text-black hover:bg-zinc-200 transition-colors disabled:opacity-50">
                  {freeWeekSaving ? "Saving..." : "✓ I'm free all week"}
                </button>
                {freeWeekMsg.text && (
                  <p className={"mt-2 text-xs font-semibold " + (freeWeekMsg.error ? "text-red-400" : "text-green-400")}>
                    {freeWeekMsg.text}
                  </p>
                )}
              </div>
              <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-zinc-600">— or add specific windows —</p>
              <form onSubmit={handleAddAvail} className="grid gap-4">
                <div>
                  <label className={labelClass}>Day of week</label>
                  <select className={selectClass} value={availDay} onChange={(e) => setAvailDay(e.target.value)} disabled={availSaving}>
                    {DAYS.map((d) => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelClass}>From</label>
                    <input className={inputClass} type="time" value={availStart} onChange={(e) => setAvailStart(e.target.value)} disabled={availSaving} />
                  </div>
                  <div>
                    <label className={labelClass}>To</label>
                    <input className={inputClass} type="time" value={availEnd} onChange={(e) => setAvailEnd(e.target.value)} disabled={availSaving} />
                  </div>
                </div>
                {availMsg.text && <p className={"text-xs font-semibold " + (availMsg.error ? "text-red-400" : "text-green-400")}>{availMsg.text}</p>}
                <button type="submit" disabled={availSaving || !userId} className="bg-white px-6 py-3 text-sm font-black text-black hover:bg-zinc-200 transition-colors disabled:opacity-50">
                  {availSaving ? "Saving..." : "Save availability"}
                </button>
              </form>
              {availability.length > 0 && (
                <div className="mt-6 border-t border-zinc-800 pt-5">
                  <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-zinc-500">Your free windows</p>
                  <div className="grid gap-2 max-h-48 overflow-y-auto">
                    {availability.map((av) => (
                      <div key={av.id} className="flex items-center justify-between gap-3 border border-zinc-800 px-4 py-3">
                        <div>
                          <p className="text-sm font-bold">{av.day_of_week}</p>
                          <p className="text-xs text-zinc-500">{av.start_time.slice(0, 5)} – {av.end_time.slice(0, 5)}</p>
                        </div>
                        <button onClick={() => handleDeleteAvail(av.id)} className="text-xs text-zinc-600 hover:text-red-400 transition-colors shrink-0">Remove</button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Scheduled Workouts */}
      <ScheduledWorkoutsList userId={userId} calendarKey={calendarKey} onDelete={() => setCalendarKey((k) => k + 1)} />

      {/* AI Scheduler */}
      <AISchedulerSection userId={userId} availability={availability} busyEvents={busyEvents} onScheduled={() => setCalendarKey((k) => k + 1)} />
    </>
  );
}

// ── Scheduled Workouts List ─────────────────────────────────────────────────

function ScheduledWorkoutsList({ userId, calendarKey, onDelete }) {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    const { data } = await supabase.from("schedules")
      .select("id, title, start_at, end_at, completed, ai_generated")
      .eq("user_id", userId)
      .order("start_at", { ascending: true })
      .limit(20);
    setSchedules(data ?? []);
    setLoading(false);
  };

  useEffect(() => { if (userId) load(); }, [userId, calendarKey]);

  const handleDelete = async (id) => {
    if (!confirm("Remove this scheduled workout?")) return;
    await supabase.from("schedules").delete().eq("id", id);
    setSchedules((prev) => prev.filter((s) => s.id !== id));
    onDelete?.();
  };

  if (loading || schedules.length === 0) return null;

  const upcoming = schedules.filter((s) => !s.completed);
  const completed = schedules.filter((s) => s.completed);

  return (
    <section className="border-b border-zinc-800 px-[5%] py-12">
      <div className="container">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500">Scheduled workouts</p>
            <h2 className="mt-1 text-xl font-black">{upcoming.length} upcoming · {completed.length} completed</h2>
          </div>
        </div>
        <div className="grid gap-2 max-h-96 overflow-y-auto">
          {schedules.map((s) => {
            const start = new Date(s.start_at);
            const end = new Date(s.end_at);
            return (
              <div key={s.id} className={"flex items-center gap-4 border px-5 py-3 " + (s.completed ? "border-green-900 bg-green-950/30" : "border-zinc-800 bg-zinc-900")}>
                <div className="flex shrink-0 flex-col items-center border border-zinc-700 px-2 py-1.5 text-center text-xs w-12">
                  <span className="text-zinc-500">{start.toLocaleDateString([], { weekday: "short" })}</span>
                  <span className="text-lg font-black">{start.getDate()}</span>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-bold truncate">{s.title}</p>
                    {s.completed && <span className="shrink-0 text-xs font-bold text-green-400">✓ Done</span>}
                    {s.ai_generated && <span className="shrink-0 text-xs text-zinc-600">AI</span>}
                  </div>
                  <p className="text-xs text-zinc-500">
                    {start.toLocaleDateString([], { month: "short", day: "numeric" })} · {start.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} – {end.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
                <button onClick={() => handleDelete(s.id)}
                  className="shrink-0 border border-zinc-800 px-2 py-1.5 text-xs text-zinc-600 hover:border-red-500 hover:text-red-400 transition-colors">
                  ✕
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ── AI Scheduler Section ────────────────────────────────────────────────────

function AISchedulerSection({ userId, availability, busyEvents, onScheduled }) {
  const STEP = { PROMPT: "prompt", PROGRAM: "program", GENERATING: "generating", REVIEW: "review" };

  const [step, setStep] = useState(STEP.PROMPT);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [weeksAhead, setWeeksAhead] = useState(1);
  const [suggestions, setSuggestions] = useState([]);
  const [accepted, setAccepted] = useState(new Set());
  const [recentWorkouts, setRecentWorkouts] = useState([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!userId) return;
    (async () => {
      const twoWeeksAgo = new Date();
      twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
      const { data } = await supabase.from("workout_logs").select("*").eq("user_id", userId).gte("logged_at", twoWeeksAgo.toISOString());
      setRecentWorkouts(data ?? []);
    })();
  }, [userId]);

  const fmt = (d) => d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  const handleGenerate = async () => {
    setStep(STEP.GENERATING);
    setError("");

    try {
      const now = new Date();
      const windowEnd = new Date(now);
      windowEnd.setDate(windowEnd.getDate() + weeksAhead * 7);
      const prog = PROGRAMS.find((p) => p.id === selectedProgram);

      const availText = availability.length
        ? availability.map((a) => `  ${a.day_of_week}: ${a.start_time.slice(0,5)}–${a.end_time.slice(0,5)}`).join("\n")
        : "  (none — use 6am-9pm on all days as default)";

      const busyText = busyEvents.length
        ? busyEvents.map((e) => { const s = new Date(e.start_at); const en = new Date(e.end_at); return `  ${s.toDateString()} ${fmt(s)}–${fmt(en)}: ${e.title}`; }).join("\n")
        : "  (none)";

      const recentText = recentWorkouts.length
        ? recentWorkouts.slice(0,10).map((w) => `  ${w.muscle_group ?? "General"}: ${w.exercise_name}`).join("\n")
        : "  (no history)";

      const programInstructions = selectedProgram === "ppl"
        ? "Use a PPL split: Push Day (chest/shoulders/triceps), Pull Day (back/biceps), Leg Day. Cycle these across 6 days."
        : selectedProgram === "ul"
        ? "Use Upper/Lower split: Upper Body (chest/back/shoulders/arms) and Lower Body (quads/hamstrings/glutes/calves) alternating across 4 days."
        : selectedProgram === "fullbody"
        ? "Use Full Body sessions 3x per week, hitting all major muscle groups each session."
        : selectedProgram === "brosplit"
        ? "Use a Bro Split: Chest Day, Back Day, Leg Day, Shoulder Day, Arms Day — one muscle group per session across 5 days."
        : selectedProgram === "531"
        ? "Use Wendler 5/3/1: 4 sessions — Squat, Bench, Deadlift, Overhead Press. One main lift per session."
        : "Pick the best split based on the user's availability and workout history.";

      const prompt = `You are MyBro AI fitness coach. Schedule ${prog?.full ?? "a custom workout plan"} for the next ${weeksAhead} week(s) from ${now.toDateString()} to ${windowEnd.toDateString()}.

PROGRAM: ${prog?.full ?? "AI decides best split"}
${programInstructions}

WEEKLY AVAILABILITY (only schedule inside these windows):
${availText}

BUSY/BLOCKED EVENTS (never schedule during these):
${busyText}

RECENT WORKOUT HISTORY:
${recentText}

RULES:
1. Only schedule during available windows. Never overlap busy events.
2. Target ${prog?.days ?? "3-5"} sessions/week. Each session 45-90 minutes.
3. Follow the program structure strictly.
4. Session title should reflect the day type (e.g. "Push Day", "Pull Day", "Leg Day", "Upper Body", "Lower Body", "Full Body", "Chest Day").

Respond with ONLY a valid JSON array, no markdown, no explanation:
[{"title":"Push Day","start":"2025-01-20T09:00:00","end":"2025-01-20T10:30:00","notes":"Chest, shoulders, triceps — bench press, OHP, lateral raises"}]`;

      const groqKey = process.env.NEXT_PUBLIC_GROQ_API_KEY;
      const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${groqKey}`,
        },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant",
          messages: [{ role: "user", content: prompt }],
          temperature: 0.7,
        }),
      });

      if (!res.ok) throw new Error("API error " + res.status);
      const data = await res.json();
      const raw = data.choices?.[0]?.message?.content ?? "";
      const parsed = JSON.parse(raw.replace(/```json|```/g, "").trim());
      const valid = parsed.filter((s) => s.title && s.start && s.end);
      if (!valid.length) throw new Error("No sessions returned. Try adding more availability first.");
      setSuggestions(valid);
      setAccepted(new Set(valid.map((_, i) => i)));
      setStep(STEP.REVIEW);
    } catch (e) {
      setError(e.message ?? "Failed to generate.");
      setStep(STEP.PROGRAM);
    }
  };

  const handleSave = async () => {
    if (!userId || !accepted.size) return;
    setSaving(true); setError(""); setSuccess("");
    try {
      const rows = [...accepted].map((i) => ({
        user_id: userId,
        workout_name: suggestions[i].title,
        scheduled_day: new Date(suggestions[i].start).toLocaleDateString([], { weekday: "long" }),
        scheduled_time: new Date(suggestions[i].start).toTimeString().slice(0, 5),
        title: suggestions[i].title,
        start_at: suggestions[i].start,
        end_at: suggestions[i].end,
        notes: suggestions[i].notes ?? null,
        ai_generated: true,
      }));
      const { error: err } = await supabase.from("schedules").insert(rows);
      if (err) throw err;
      setSuccess(`${rows.length} workout${rows.length !== 1 ? "s" : ""} added to your calendar!`);
      setSuggestions([]); setAccepted(new Set());
      setStep(STEP.PROMPT);
      onScheduled?.();
    } catch (e) {
      setError(e.message ?? "Failed to save.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="px-[5%] py-16">
      <div className="container max-w-3xl">

        {/* ── STEP 1: Prompt ── */}
        {step === STEP.PROMPT && (
          <div className="border border-zinc-800 bg-zinc-900">
            <div className="border-b border-zinc-800 px-8 py-6">
              <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500">AI Scheduler</p>
              <h2 className="mt-1 text-3xl font-black md:text-4xl">Want your Bro to plan your week?</h2>
              <p className="mt-2 text-sm text-zinc-400">Based on your availability and busy blocks, the AI will build a full workout schedule for you.</p>
            </div>
            <div className="flex flex-col gap-4 px-8 py-6 sm:flex-row sm:items-center">
              {availability.length === 0 && (
                <p className="mb-2 w-full border border-yellow-700 bg-yellow-950 px-4 py-2.5 text-xs font-semibold text-yellow-400">
                  ⚠ Set your free windows above first so the AI knows when to schedule you.
                </p>
              )}
              <button onClick={() => setStep(STEP.PROGRAM)}
                className="bg-white px-8 py-4 text-sm font-black text-black hover:bg-zinc-200 transition-colors">
                Yes, build my schedule ✦
              </button>
              <p className="text-xs text-zinc-600">Takes about 10 seconds</p>
            </div>
          </div>
        )}

        {/* ── STEP 2: Pick program ── */}
        {step === STEP.PROGRAM && (
          <div>
            <div className="mb-8">
              <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500">Step 1 of 2</p>
              <h2 className="mt-1 text-3xl font-black md:text-4xl">Which program do you want?</h2>
              <p className="mt-2 text-sm text-zinc-400">Pick a split and the AI will schedule the right days around your calendar.</p>
            </div>

            <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {PROGRAMS.map((prog) => (
                <button key={prog.id} onClick={() => setSelectedProgram(prog.id)}
                  className={"border p-5 text-left transition-colors " + (selectedProgram === prog.id ? "border-white bg-zinc-800" : "border-zinc-800 bg-zinc-900 hover:border-zinc-600")}>
                  <div className="mb-2 flex items-start justify-between gap-2">
                    <p className="text-base font-black">{prog.label}</p>
                    {prog.days && <span className="text-xs text-zinc-500 shrink-0">{prog.days}x/wk</span>}
                  </div>
                  <p className="text-xs font-semibold text-zinc-400">{prog.full}</p>
                  <p className="mt-1.5 text-xs text-zinc-600">{prog.desc}</p>
                  {selectedProgram === prog.id && (
                    <div className="mt-3 flex items-center gap-1.5">
                      <div className="h-1.5 w-1.5 bg-white rounded-full" />
                      <span className="text-xs font-bold text-white">Selected</span>
                    </div>
                  )}
                </button>
              ))}
            </div>

            <div className="mb-6 flex items-center gap-4">
              <label className="text-xs font-semibold uppercase tracking-widest text-zinc-500">Schedule ahead</label>
              <select className="border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-white focus:outline-none"
                value={weeksAhead} onChange={(e) => setWeeksAhead(Number(e.target.value))}>
                <option value={1}>1 week</option>
                <option value={2}>2 weeks</option>
                <option value={3}>3 weeks</option>
              </select>
            </div>

            {error && <p className="mb-4 text-xs font-semibold text-red-400">{error}</p>}

            <div className="flex gap-3">
              <button onClick={() => { setStep(STEP.PROMPT); setSelectedProgram(null); setError(""); }}
                className="border border-zinc-700 px-6 py-3 text-sm font-bold text-zinc-400 hover:border-white hover:text-white transition-colors">
                Back
              </button>
              <button onClick={handleGenerate} disabled={!selectedProgram}
                className="bg-white px-8 py-3 text-sm font-black text-black hover:bg-zinc-200 transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
                Generate schedule ✦
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 3: Generating ── */}
        {step === STEP.GENERATING && (
          <div className="border border-zinc-800 bg-zinc-900 px-8 py-16 text-center">
            <div className="mb-4 flex justify-center gap-1.5">
              {[0,1,2].map((i) => (
                <div key={i} className="h-2 w-2 bg-white rounded-full animate-bounce" style={{ animationDelay: i * 0.15 + "s" }} />
              ))}
            </div>
            <p className="text-lg font-black">Building your {PROGRAMS.find((p) => p.id === selectedProgram)?.full} schedule…</p>
            <p className="mt-2 text-sm text-zinc-500">Fitting sessions around your availability and busy blocks</p>
          </div>
        )}

        {/* ── STEP 4: Review ── */}
        {step === STEP.REVIEW && (
          <div>
            <div className="mb-6">
              <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500">Step 2 of 2 — Review</p>
              <h2 className="mt-1 text-3xl font-black">{suggestions.length} sessions planned</h2>
              <p className="mt-1 text-sm text-zinc-400">Deselect anything you don't want, then add to your calendar.</p>
            </div>

            <div className="mb-4 flex justify-end gap-3 text-xs">
              <button className="text-zinc-500 underline hover:text-white" onClick={() => setAccepted(new Set(suggestions.map((_, i) => i)))}>Select all</button>
              <button className="text-zinc-500 underline hover:text-white" onClick={() => setAccepted(new Set())}>Clear all</button>
            </div>

            <div className="mb-6 grid gap-2">
              {suggestions.map((s, i) => {
                const start = new Date(s.start);
                const end = new Date(s.end);
                const on = accepted.has(i);
                return (
                  <div key={i}
                    onClick={() => setAccepted((p) => { const n = new Set(p); n.has(i) ? n.delete(i) : n.add(i); return n; })}
                    className={"flex cursor-pointer items-center gap-4 border px-5 py-4 transition-colors " + (on ? "border-white bg-zinc-800" : "border-zinc-800 bg-zinc-900 opacity-40")}>
                    <div className={"flex h-4 w-4 shrink-0 items-center justify-center border " + (on ? "border-white bg-white" : "border-zinc-600")}>
                      {on && <svg className="h-2.5 w-2.5 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
                    </div>
                    <div className="flex min-w-16 flex-col items-center border border-zinc-700 px-2 py-1.5 text-center text-xs shrink-0">
                      <span className="text-zinc-500">{start.toLocaleDateString([], { weekday: "short" })}</span>
                      <span className="text-xl font-black">{start.getDate()}</span>
                      <span className="text-zinc-500">{start.toLocaleDateString([], { month: "short" })}</span>
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold">{s.title}</p>
                      <p className="text-xs text-zinc-500">{fmt(start)} – {fmt(end)} · {Math.round((end - start) / 60000)} min</p>
                      {s.notes && <p className="mt-0.5 text-xs text-zinc-600 truncate">{s.notes}</p>}
                    </div>
                  </div>
                );
              })}
            </div>

            {error && <p className="mb-4 text-xs font-semibold text-red-400">{error}</p>}
            {success && <p className="mb-4 text-xs font-semibold text-green-400">{success}</p>}

            <div className="flex gap-3">
              <button onClick={() => { setStep(STEP.PROGRAM); setSuggestions([]); }}
                className="border border-zinc-700 px-6 py-3 text-sm font-bold text-zinc-400 hover:border-white hover:text-white transition-colors">
                Regenerate
              </button>
              <button onClick={handleSave} disabled={saving || !accepted.size}
                className="bg-white px-8 py-3 text-sm font-black text-black hover:bg-zinc-200 transition-colors disabled:opacity-50">
                {saving ? "Saving…" : `Add ${accepted.size} workout${accepted.size !== 1 ? "s" : ""} to calendar`}
              </button>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
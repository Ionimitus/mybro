"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@relume_io/relume-ui";
import { supabase } from "../../../lib/supabase";

function fmt(date) {
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function buildPrompt({ availability, busyEvents, recentWorkouts, weeksAhead }) {
  const now = new Date();
  const windowEnd = new Date(now);
  windowEnd.setDate(windowEnd.getDate() + weeksAhead * 7);

  const availText = availability.length
    ? availability.map((a) => "  " + a.day_of_week + ": " + a.start_time.slice(0, 5) + "–" + a.end_time.slice(0, 5)).join("\n")
    : "  (none set — use 6am-8pm on weekdays as default)";

  const busyText = busyEvents.length
    ? busyEvents.map((e) => {
        const s = new Date(e.start_at);
        const en = new Date(e.end_at);
        return "  " + s.toDateString() + " " + fmt(s) + "–" + fmt(en) + ": " + e.title;
      }).join("\n")
    : "  (none)";

  const recentText = recentWorkouts.length
    ? recentWorkouts.slice(0, 10).map((w) => "  " + (w.muscle_group ?? "General") + ": " + w.exercise_name).join("\n")
    : "  (no history — create a beginner balanced schedule)";

  return `You are MyBro AI fitness coach. Schedule workouts for the next ${weeksAhead} week(s) from ${now.toDateString()} to ${windowEnd.toDateString()}.

WEEKLY AVAILABILITY:
${availText}

BUSY/BLOCKED EVENTS (never schedule during these):
${busyText}

RECENT WORKOUT HISTORY:
${recentText}

RULES:
1. Only schedule during available windows, never overlap busy events.
2. Aim for 3-5 sessions/week. Each session 45-90 minutes.
3. No same muscle group two days in a row.
4. Use short labels: "Push Day", "Pull Day", "Leg Day", "Full Body", "Upper Body", "Lower Body".

Respond with ONLY a JSON array, no markdown:
[{"title":"Push Day","start":"2025-01-20T09:00:00","end":"2025-01-20T10:30:00","notes":"Chest, shoulders, triceps"}]`;
}

export function AIWorkoutScheduler() {
  const [userId, setUserId] = useState(null);
  const [availability, setAvailability] = useState([]);
  const [busyEvents, setBusyEvents] = useState([]);
  const [recentWorkouts, setRecentWorkouts] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [accepted, setAccepted] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [weeksAhead, setWeeksAhead] = useState(1);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user?.id) { setError("Please log in to use the AI scheduler."); setLoading(false); return; }
        const uid = session.user.id;
        if (mounted) setUserId(uid);

        const twoWeeksAgo = new Date();
        twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);

        const [avail, events, logs] = await Promise.all([
          supabase.from("availability").select("*").eq("user_id", uid),
          supabase.from("events").select("*").eq("user_id", uid).gte("start_at", new Date().toISOString()),
          supabase.from("workout_logs").select("*").eq("user_id", uid)
            .gte("logged_at", twoWeeksAgo.toISOString()).order("logged_at", { ascending: false }),
        ]);

        if (mounted) {
          setAvailability(avail.data ?? []);
          setBusyEvents(events.data ?? []);
          setRecentWorkouts(logs.data ?? []);
        }
      } catch (e) {
        if (mounted) setError(e.message ?? "Failed to load data.");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const handleGenerate = async () => {
    setError(""); setSuccess(""); setSuggestions([]); setAccepted(new Set());
    setGenerating(true);
    try {
      const prompt = buildPrompt({ availability, busyEvents, recentWorkouts, weeksAhead });
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [{ role: "user", content: prompt }],
        }),
      });

      if (!response.ok) throw new Error("API error " + response.status);
      const data = await response.json();
      const raw = data.content?.map((b) => b.text ?? "").join("") ?? "";
      const clean = raw.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);
      const valid = parsed.filter((s) => s.title && s.start && s.end);
      if (!valid.length) throw new Error("AI returned no schedulable workouts. Try adding more availability.");
      setSuggestions(valid);
      setAccepted(new Set(valid.map((_, i) => i)));
    } catch (e) {
      setError(e.message ?? "Failed to generate schedule.");
    } finally {
      setGenerating(false);
    }
  };

  const handleSave = async () => {
    if (!userId || accepted.size === 0) return;
    setSaving(true); setError(""); setSuccess("");
    try {
      const rows = [...accepted].map((i) => ({
        user_id: userId,
        title: suggestions[i].title,
        start_at: suggestions[i].start,
        end_at: suggestions[i].end,
        notes: suggestions[i].notes ?? null,
        ai_generated: true,
      }));

      const { error: insertErr } = await supabase.from("schedules").insert(rows);
      if (insertErr) throw insertErr;
      setSuccess(rows.length + " workout" + (rows.length !== 1 ? "s" : "") + " added to your calendar!");
      setSuggestions([]); setAccepted(new Set());
    } catch (e) {
      setError(e.message ?? "Failed to save workouts.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <section className="px-[5%] py-16"><p className="text-text-secondary">Loading your data...</p></section>;

  return (
    <section className="px-[5%] py-16 md:py-24 lg:py-28">
      <div className="container">
        <div className="mb-12 max-w-lg">
          <p className="mb-3 font-semibold md:mb-4">AI Powered</p>
          <h2 className="mb-5 text-5xl font-bold md:mb-6 md:text-7xl lg:text-8xl">Let your Bro plan for you</h2>
          <p className="md:text-md">Your availability, busy events, and workout history are analyzed to generate a conflict-free training schedule.</p>
        </div>

        {/* Context cards */}
        <div className="mb-10 grid gap-4 border border-border-primary p-6 md:grid-cols-3 md:p-8">
          <div>
            <p className="mb-1 text-sm font-semibold uppercase tracking-wide text-text-secondary">Available windows</p>
            <p className="text-2xl font-bold">{availability.length}</p>
            <p className="text-sm text-text-secondary">recurring slots set</p>
          </div>
          <div>
            <p className="mb-1 text-sm font-semibold uppercase tracking-wide text-text-secondary">Upcoming busy blocks</p>
            <p className="text-2xl font-bold">{busyEvents.length}</p>
            <p className="text-sm text-text-secondary">events to work around</p>
          </div>
          <div>
            <p className="mb-1 text-sm font-semibold uppercase tracking-wide text-text-secondary">Recent workouts</p>
            <p className="text-2xl font-bold">{recentWorkouts.length}</p>
            <p className="text-sm text-text-secondary">logged in last 2 weeks</p>
          </div>
        </div>

        {availability.length === 0 && (
          <div className="mb-8 border border-yellow-400 bg-yellow-50 p-4 text-sm text-yellow-800">
            ⚠️ No availability set — add your free windows above so the AI knows when to schedule you.
          </div>
        )}

        {/* Controls */}
        <div className="mb-8 flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-3">
            <label className="text-sm font-semibold" htmlFor="weeks">Schedule ahead:</label>
            <select id="weeks"
              className="min-h-9 border border-border-primary bg-background-primary px-3 py-1.5 text-sm"
              value={weeksAhead} onChange={(e) => setWeeksAhead(Number(e.target.value))} disabled={generating}>
              <option value={1}>1 week</option>
              <option value={2}>2 weeks</option>
              <option value={3}>3 weeks</option>
            </select>
          </div>
          <Button onClick={handleGenerate} disabled={generating || saving} variant="primary">
            {generating ? "Generating schedule…" : "✦ Generate AI Schedule"}
          </Button>
        </div>

        {error && <p className="mb-6 text-sm font-medium text-red-600">{error}</p>}
        {success && <p className="mb-6 text-sm font-medium text-green-700">{success}</p>}

        {suggestions.length > 0 && (
          <>
            <div className="mb-4 flex items-center justify-between">
              <p className="font-semibold">
                {suggestions.length} suggested session{suggestions.length !== 1 ? "s" : ""} —{" "}
                <span className="font-normal text-text-secondary">deselect any you don't want</span>
              </p>
              <div className="flex gap-2 text-sm">
                <button className="underline" onClick={() => setAccepted(new Set(suggestions.map((_, i) => i)))}>Select all</button>
                <span className="text-text-secondary">·</span>
                <button className="underline" onClick={() => setAccepted(new Set())}>Clear all</button>
              </div>
            </div>

            <div className="mb-8 grid gap-3">
              {suggestions.map((s, i) => {
                const start = new Date(s.start);
                const end = new Date(s.end);
                const isAccepted = accepted.has(i);
                return (
                  <div key={i} onClick={() => {
                    setAccepted((prev) => { const n = new Set(prev); n.has(i) ? n.delete(i) : n.add(i); return n; });
                  }}
                    className={"flex cursor-pointer flex-col gap-2 border p-5 transition-colors md:flex-row md:items-center md:justify-between " +
                      (isAccepted ? "border-black bg-background-secondary" : "border-border-primary opacity-50")}>
                    <div className="flex items-center gap-4">
                      <div className={"flex h-5 w-5 shrink-0 items-center justify-center border-2 " + (isAccepted ? "border-black bg-black" : "border-border-primary")}>
                        {isAccepted && (
                          <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                      <div className="flex min-w-24 flex-col items-center border border-border-primary bg-background-primary px-2 py-2 text-center text-sm">
                        <span className="text-xs text-text-secondary">{start.toLocaleDateString([], { weekday: "short" })}</span>
                        <span className="text-xl font-bold">{start.getDate()}</span>
                        <span className="text-xs text-text-secondary">{start.toLocaleDateString([], { month: "short" })}</span>
                      </div>
                      <div>
                        <h3 className="text-lg font-bold">{s.title}</h3>
                        <p className="text-sm text-text-secondary">
                          {fmt(start)} – {fmt(end)} · {Math.round((end - start) / 60000)} min
                        </p>
                        {s.notes && <p className="mt-1 text-xs text-text-secondary">{s.notes}</p>}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <Button onClick={handleSave} disabled={saving || accepted.size === 0} variant="primary">
              {saving ? "Saving…" : "Add " + accepted.size + " workout" + (accepted.size !== 1 ? "s" : "") + " to calendar"}
            </Button>
          </>
        )}
      </div>
    </section>
  );
}
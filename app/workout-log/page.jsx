"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { exercises } from "../data/exercises";
import { Navbar1 } from "./components/Navbar1";
import { Footer4 } from "./components/Footer4";

const PROGRAM_MUSCLES = {
  "Push Day":       ["Chest", "Shoulders", "Triceps"],
  "Pull Day":       ["Back", "Biceps"],
  "Leg Day":        ["Legs", "Abs"],
  "Upper Body":     ["Chest", "Back", "Shoulders", "Biceps", "Triceps"],
  "Lower Body":     ["Legs", "Abs"],
  "Full Body":      ["Chest", "Back", "Shoulders", "Legs", "Biceps", "Triceps", "Abs"],
  "Chest Day":      ["Chest"],
  "Back Day":       ["Back"],
  "Shoulder Day":   ["Shoulders"],
  "Arms Day":       ["Biceps", "Triceps"],
  "Squat":          ["Legs"],
  "Bench":          ["Chest", "Triceps"],
  "Deadlift":       ["Back", "Legs"],
  "Overhead Press": ["Shoulders", "Triceps"],
};

const ALL_GROUPS = ["Chest","Back","Shoulders","Legs","Biceps","Triceps","Abs"];

function musclesForTitle(title) {
  if (!title) return ALL_GROUPS;
  for (const [key, muscles] of Object.entries(PROGRAM_MUSCLES)) {
    if (title.toLowerCase().includes(key.toLowerCase())) return muscles;
  }
  return ALL_GROUPS;
}

function toDateInputValue(date) {
  return date.toISOString().split("T")[0];
}

// ── PHASE: pick session ─────────────────────────────────────────────────────
function PhaseStart({ userId, onStart }) {
  const [upcoming, setUpcoming] = useState([]);
  const [loading, setLoading] = useState(true);

  // Date picker state
  const [whenOption, setWhenOption] = useState("today");
  const [customDate, setCustomDate] = useState(toDateInputValue(new Date()));
  const [customTime, setCustomTime] = useState(() => {
    const now = new Date();
    return `${now.getHours().toString().padStart(2,"0")}:${now.getMinutes().toString().padStart(2,"0")}`;
  });

  useEffect(() => {
    (async () => {
      const now = new Date();
      const tomorrow = new Date(); tomorrow.setDate(tomorrow.getDate() + 1);
      const { data } = await supabase.from("schedules")
        .select("id, title, start_at, end_at, notes, completed")
        .eq("user_id", userId)
        .gte("start_at", now.toISOString())
        .lte("start_at", tomorrow.toISOString())
        .order("start_at").limit(5);
      setUpcoming((data ?? []).filter((s) => !s.completed));
      setLoading(false);
    })();
  }, [userId]);

  const resolveDate = () => {
    const [hours, minutes] = customTime.split(":").map(Number);
    if (whenOption === "today") {
      const d = new Date(); d.setHours(hours, minutes, 0, 0); return d;
    }
    if (whenOption === "yesterday") {
      const d = new Date(); d.setDate(d.getDate() - 1); d.setHours(hours, minutes, 0, 0); return d;
    }
    return new Date(customDate + `T${customTime}:00`);
  };

  const isRetroactive = whenOption !== "today";

  const startFromSchedule = (sched) => {
    onStart({ title: sched.title, scheduleId: sched.id, notes: sched.notes, date: resolveDate() });
  };

  const startCustom = (title) => {
    onStart({ title, scheduleId: null, notes: null, date: resolveDate() });
  };

  return (
    <div className="container max-w-2xl py-16">
      <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-zinc-500">Workout Log</p>
      <h1 className="mb-10 text-5xl font-black leading-none md:text-6xl">
        What are we<br /><span className="text-zinc-500">training?</span>
      </h1>

      {/* ── When did you train? ── */}
      <div className="mb-10 border border-zinc-800 bg-zinc-900 p-6">
        <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-zinc-500">When did you train?</p>
        <div className="flex flex-wrap gap-3 mb-4">
          {[
            { val: "today", label: "Today" },
            { val: "yesterday", label: "Yesterday" },
            { val: "custom", label: "Another day" },
          ].map(({ val, label }) => (
            <button key={val} onClick={() => setWhenOption(val)}
              className={"border px-5 py-2.5 text-sm font-bold transition-colors " +
                (whenOption === val ? "border-white bg-white text-black" : "border-zinc-700 text-zinc-400 hover:border-zinc-500")}>
              {label}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-3 items-center">
          {whenOption === "custom" && (
            <input type="date" value={customDate}
              onChange={(e) => setCustomDate(e.target.value)}
              className="border border-zinc-700 bg-zinc-800 px-4 py-2.5 text-sm text-white focus:border-white focus:outline-none" />
          )}
          <div className="flex items-center gap-2">
            <label className="text-xs text-zinc-500">At</label>
            <input type="time" value={customTime}
              onChange={(e) => setCustomTime(e.target.value)}
              className="border border-zinc-700 bg-zinc-800 px-4 py-2.5 text-sm text-white focus:border-white focus:outline-none" />
          </div>
        </div>
        {isRetroactive && (
          <p className="mt-3 text-xs text-zinc-500">
            ✓ Will show on calendar for {whenOption === "yesterday" ? "yesterday" : customDate} at {customTime}
          </p>
        )}
      </div>

      {/* ── Today's scheduled workouts ── */}
      {!loading && upcoming.length > 0 && whenOption === "today" && (
        <div className="mb-10">
          <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-zinc-500">Scheduled for today</p>
          <div className="grid gap-3">
            {upcoming.map((s) => {
              const start = new Date(s.start_at);
              const muscles = musclesForTitle(s.title);
              return (
                <button key={s.id} onClick={() => startFromSchedule(s)}
                  className="group flex items-center justify-between gap-4 border border-zinc-700 bg-zinc-900 px-6 py-5 text-left hover:border-white transition-colors">
                  <div>
                    <p className="text-lg font-black">{s.title}</p>
                    <p className="mt-1 text-xs text-zinc-500">
                      {start.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} · {muscles.join(", ")}
                    </p>
                    {s.notes && <p className="mt-1 text-xs text-zinc-600 truncate max-w-xs">{s.notes}</p>}
                  </div>
                  <div className="shrink-0 border border-zinc-700 px-4 py-2 text-xs font-black group-hover:border-white group-hover:bg-white group-hover:text-black transition-colors">
                    Start →
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Quick start ── */}
      <div className="mb-6">
        <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-zinc-500">
          {upcoming.length > 0 && whenOption === "today" ? "Or start a different session" : "Choose a session type"}
        </p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {["Push Day","Pull Day","Leg Day","Upper Body","Lower Body","Full Body"].map((type) => (
            <button key={type} onClick={() => startCustom(type)}
              className="border border-zinc-800 bg-zinc-900 px-4 py-4 text-left hover:border-zinc-600 transition-colors">
              <p className="font-black">{type}</p>
              <p className="mt-1 text-xs text-zinc-600">{musclesForTitle(type).join(", ")}</p>
            </button>
          ))}
        </div>
      </div>

      <CustomSessionInput onStart={startCustom} />
    </div>
  );
}

function CustomSessionInput({ onStart }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  if (!open) return (
    <button onClick={() => setOpen(true)} className="text-xs text-zinc-600 underline hover:text-zinc-400 transition-colors">
      + Start a custom named session
    </button>
  );
  return (
    <div className="flex gap-3 mt-2">
      <input className="flex-1 border border-zinc-700 bg-zinc-800 px-4 py-3 text-sm text-white placeholder-zinc-500 focus:border-white focus:outline-none"
        placeholder="e.g. Chest Day, Arms, Cardio..." value={name}
        onChange={(e) => setName(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && name.trim() && onStart(name.trim())}
        autoFocus />
      <button onClick={() => name.trim() && onStart(name.trim())}
        className="bg-white px-6 py-3 text-sm font-black text-black hover:bg-zinc-200 transition-colors disabled:opacity-40"
        disabled={!name.trim()}>
        Go
      </button>
    </div>
  );
}

// ── Muscle Panel ─────────────────────────────────────────────────────────────
const MUSCLE_COLORS = {
  Chest:"#facc15", Back:"#eab308", Shoulders:"#fde047",
  Legs:"#ca8a04", Biceps:"#facc15", Triceps:"#fde047", Abs:"#eab308",
};

function MusclePanel({ sessionMuscles, logs, sessionExercises }) {
  const setsPerMuscle = {};
  sessionMuscles.forEach((m) => { setsPerMuscle[m] = 0; });
  Object.keys(logs).forEach((id) => {
    const ex = sessionExercises.find((e) => e.id === parseInt(id));
    if (ex) setsPerMuscle[ex.muscleGroup] = (setsPerMuscle[ex.muscleGroup] ?? 0) + logs[id].filter((s) => s.saved).length;
  });
  const maxSets = Math.max(...Object.values(setsPerMuscle), 1);
  const totalSets = Object.values(setsPerMuscle).reduce((a, b) => a + b, 0);

  return (
    <div className="sticky top-6 grid gap-4">
      <div className="border border-zinc-800 bg-zinc-900 p-5">
        <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-zinc-500">Target muscles</p>
        <div className="grid gap-3">
          {sessionMuscles.map((m) => {
            const sets = setsPerMuscle[m] ?? 0;
            const color = MUSCLE_COLORS[m] ?? "#fff";
            return (
              <div key={m}>
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-sm font-bold">{m}</span>
                  <span className="text-xs font-black" style={{ color: sets > 0 ? color : "#52525b" }}>
                    {sets > 0 ? `${sets} sets` : "—"}
                  </span>
                </div>
                <div className="h-1.5 w-full bg-zinc-800 rounded-full">
                  <div className="h-full rounded-full transition-all duration-500"
                    style={{ width: sets > 0 ? `${Math.round((sets/maxSets)*100)}%` : "0%", background: color }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="border border-zinc-800 bg-zinc-900 p-5 text-center">
        <p className="text-5xl font-black">{totalSets}</p>
        <p className="mt-1 text-xs text-zinc-500">sets logged</p>
        {totalSets >= 15 && <p className="mt-3 text-xs font-bold text-yellow-400">💪 Great volume!</p>}
        {totalSets >= 5 && totalSets < 15 && <p className="mt-3 text-xs text-zinc-400">Keep pushing →</p>}
        {totalSets === 0 && <p className="mt-3 text-xs text-zinc-600">Log your first set</p>}
      </div>

      <div className="border border-zinc-800 bg-zinc-900 p-5">
        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-zinc-500">Quick tips</p>
        <div className="grid gap-2 text-xs text-zinc-400">
          {sessionMuscles.includes("Chest") && <p>🫁 Chest — 3–5 sets of 6–12 reps for hypertrophy</p>}
          {sessionMuscles.includes("Back") && <p>🔙 Back — focus on full range of motion</p>}
          {sessionMuscles.includes("Legs") && <p>🦵 Legs — biggest muscle group, don't skip</p>}
          {sessionMuscles.includes("Shoulders") && <p>💪 Shoulders — warm up rotator cuff first</p>}
          {sessionMuscles.includes("Abs") && <p>⚡ Abs — best trained at end of session</p>}
          {(sessionMuscles.includes("Biceps") || sessionMuscles.includes("Triceps")) && <p>💪 Arms — compounds first, isolation after</p>}
        </div>
      </div>
    </div>
  );
}

// ── PHASE: active session ───────────────────────────────────────────────────
function PhaseSession({ userId, session, onFinish }) {
  const muscles = musclesForTitle(session.title);
  const sessionExercises = exercises.filter((e) => muscles.includes(e.muscleGroup));

  const [logs, setLogs] = useState({});
  const [elapsed, setElapsed] = useState(0);
  const [finishing, setFinishing] = useState(false);
  const [activeExercise, setActiveExercise] = useState(null);

  useEffect(() => {
    const t = setInterval(() => setElapsed((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, []);

  const fmtTime = (s) => {
    const m = Math.floor(s / 60).toString().padStart(2, "0");
    const sec = (s % 60).toString().padStart(2, "0");
    return `${m}:${sec}`;
  };

  const addSet = (exId) => {
    setLogs((prev) => ({ ...prev, [exId]: [...(prev[exId] ?? []), { weight: "", reps: "", saved: false }] }));
    setActiveExercise(exId);
  };

  const updateSet = (exId, idx, field, val) => {
    setLogs((prev) => {
      const sets = [...(prev[exId] ?? [])];
      sets[idx] = { ...sets[idx], [field]: val };
      return { ...prev, [exId]: sets };
    });
  };

  const [setErrMsg, setSetErrMsg] = useState("");

  const saveSet = (exId, idx) => {
    const set = (logs[exId] ?? [])[idx];
    setSetErrMsg("");

    // Validate reps
    if (!set?.reps || set.reps === "") { setSetErrMsg("Reps are required."); return; }
    const repsNum = parseInt(set.reps);
    if (isNaN(repsNum) || repsNum < 1 || repsNum > 999) { setSetErrMsg("Reps must be between 1 and 999."); return; }

    // Validate weight (optional but if entered must be valid)
    if (set?.weight !== "" && set?.weight !== undefined) {
      const wNum = parseFloat(set.weight);
      if (isNaN(wNum) || wNum < 0 || wNum > 1000) { setSetErrMsg("Weight must be between 0 and 1000 kg."); return; }
    }

    setLogs((prev) => {
      const sets = [...(prev[exId] ?? [])];
      sets[idx] = { ...sets[idx], saved: true };
      return { ...prev, [exId]: sets };
    });
    setTimeout(() => setSetErrMsg(""), 2000);
  };

  const totalSets = Object.values(logs).reduce((sum, sets) => sum + sets.filter((s) => s.saved).length, 0);
  const exercisesDone = Object.keys(logs).filter((id) => logs[id].some((s) => s.saved)).length;

  const handleFinish = async () => {
    setFinishing(true);

    const workoutDate = session.date;

    // 1. Save all sets to workout_logs
    const rows = [];
    for (const [exIdStr, sets] of Object.entries(logs)) {
      const ex = exercises.find((e) => e.id === parseInt(exIdStr));
      if (!ex) continue;
      sets.filter((s) => s.saved).forEach((s) => {
        rows.push({
          user_id: userId,
          session_id: session.id,
          exercise_name: ex.name,
          muscle_group: ex.muscleGroup,
          sets: 1,
          reps: s.reps ? parseInt(s.reps) : null,
          weight_kg: s.weight ? parseFloat(s.weight) : null,
          logged_at: workoutDate.toISOString(),
        });
      });
    }
    if (rows.length > 0) await supabase.from("workout_logs").insert(rows);

    // 2. Mark session finished
    await supabase.from("workout_sessions")
      .update({ finished_at: new Date().toISOString() })
      .eq("id", session.id);

    // 3. If linked to a schedule → mark completed
    if (session.scheduleId) {
      await supabase.from("schedules")
        .update({ completed: true, completed_at: workoutDate.toISOString() })
        .eq("id", session.scheduleId);
    } else {
      // 4. Retroactive or custom → create a new completed schedule entry so it shows on calendar
      const startAt = new Date(workoutDate);
      // Use actual current time for today, noon for retroactive dates
      const isToday = workoutDate.toDateString() === new Date().toDateString();
      if (isToday) {
        const now = new Date();
        startAt.setHours(now.getHours(), now.getMinutes(), 0, 0);
      } else {
        startAt.setHours(12, 0, 0, 0);
      }
      const durationMs = Math.max(30 * 60 * 1000, elapsed * 1000); // at least 30 min
      const endAt = new Date(startAt.getTime() + durationMs);

      const dayName = startAt.toLocaleDateString([], { weekday: "long" });
      const timeStr = startAt.toTimeString().slice(0, 5);
      const { error: schedErr } = await supabase.from("schedules").insert({
        user_id: userId,
        workout_name: session.title,
        scheduled_day: dayName,
        scheduled_time: timeStr,
        title: session.title,
        start_at: startAt.toISOString(),
        end_at: endAt.toISOString(),
        notes: `Logged ${totalSets} sets across ${exercisesDone} exercises`,
        ai_generated: false,
        completed: true,
        completed_at: workoutDate.toISOString(),
      });
      if (schedErr) console.error("Calendar insert failed:", JSON.stringify(schedErr));
    }

    onFinish({ totalSets, exercisesDone, duration: elapsed, date: workoutDate });
  };

  return (
    <div className="mx-auto max-w-6xl py-10">
      <div className="grid gap-8 lg:grid-cols-[1fr_220px]">
      <div>
      {/* Header */}
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500">
            {session.date.toDateString() === new Date().toDateString()
              ? "Active Session"
              : `Logging for ${session.date.toLocaleDateString([], { weekday: "long", month: "short", day: "numeric" })}`}
          </p>
          <h1 className="mt-1 text-4xl font-black">{session.title}</h1>
          <p className="mt-1 text-sm text-zinc-500">{muscles.join(" · ")}</p>
        </div>
        <div className="shrink-0 border border-zinc-700 bg-zinc-900 px-5 py-3 text-center">
          <p className="text-2xl font-black tabular-nums">{fmtTime(elapsed)}</p>
          <p className="text-xs text-zinc-500">elapsed</p>
        </div>
      </div>

      {/* Stats bar */}
      <div className="mb-8 flex gap-6 border border-zinc-800 bg-zinc-900 px-6 py-4">
        <div><p className="text-xl font-black">{totalSets}</p><p className="text-xs text-zinc-500">sets logged</p></div>
        <div className="w-px bg-zinc-800" />
        <div><p className="text-xl font-black">{exercisesDone}</p><p className="text-xs text-zinc-500">exercises hit</p></div>
        <div className="w-px bg-zinc-800" />
        <div><p className="text-xl font-black">{sessionExercises.length}</p><p className="text-xs text-zinc-500">available</p></div>
      </div>

      {/* Exercise list */}
      <div className="mb-8 grid gap-3">
        {sessionExercises.map((ex) => {
          const exLogs = logs[ex.id] ?? [];
          const isActive = activeExercise === ex.id;
          const hasSets = exLogs.length > 0;

          return (
            <div key={ex.id} className={"border transition-colors " + (hasSets ? "border-white bg-zinc-900" : "border-zinc-800 bg-zinc-900")}>
              <div className="flex items-center justify-between gap-4 px-5 py-4 cursor-pointer"
                onClick={() => setActiveExercise(isActive ? null : ex.id)}>
                <div>
                  <p className="font-black">{ex.name}</p>
                  <p className="text-xs text-zinc-500">{ex.muscleGroup} · {ex.equipment} · {ex.difficulty}</p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  {hasSets && (
                    <span className="border border-zinc-700 px-2 py-0.5 text-xs font-bold text-zinc-400">
                      {exLogs.filter((s) => s.saved).length} sets
                    </span>
                  )}
                  <button onClick={(e) => { e.stopPropagation(); addSet(ex.id); }}
                    className="border border-zinc-600 px-3 py-1.5 text-xs font-black hover:border-white hover:bg-white hover:text-black transition-colors">
                    + Set
                  </button>
                </div>
              </div>

              {(isActive || hasSets) && exLogs.length > 0 && (
                <div className="border-t border-zinc-800 px-5 pb-4 pt-3">
                  <div className="mb-2 grid grid-cols-[2rem_1fr_1fr_2rem] gap-2 text-xs font-semibold uppercase tracking-wider text-zinc-600">
                    <span>#</span><span>Weight (kg)</span><span>Reps</span><span />
                  </div>
                  {exLogs.map((set, idx) => (
                    <div key={idx} className="mb-2 grid grid-cols-[2rem_1fr_1fr_2rem] items-center gap-2">
                      <span className={"text-xs font-black " + (set.saved ? "text-yellow-400" : "text-zinc-600")}>{idx + 1}</span>
                      <input type="number" min="0" step="0.5" placeholder="kg"
                        value={set.weight} onChange={(e) => updateSet(ex.id, idx, "weight", e.target.value)}
                        disabled={set.saved}
                        className="border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-white placeholder-zinc-600 focus:border-white focus:outline-none disabled:opacity-50" />
                      <input type="number" min="0" placeholder="reps"
                        value={set.reps} onChange={(e) => updateSet(ex.id, idx, "reps", e.target.value)}
                        disabled={set.saved}
                        onKeyDown={(e) => e.key === "Enter" && !set.saved && saveSet(ex.id, idx)}
                        className="border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-white placeholder-zinc-600 focus:border-white focus:outline-none disabled:opacity-50" />
                      {set.saved
                        ? <span className="text-center text-yellow-400 text-sm">✓</span>
                        : <button onClick={() => saveSet(ex.id, idx)} className="text-center text-xs text-zinc-500 hover:text-white transition-colors font-black">✓</button>
                      }
                    </div>
                  ))}
                  {setErrMsg
                    ? <p className="mt-1 text-xs font-semibold text-red-400">{setErrMsg}</p>
                    : <p className="mt-1 text-xs text-zinc-600">Press ✓ or hit Enter to save a set</p>
                  }
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Finish */}
      <div className="flex items-center gap-4">
        <button onClick={handleFinish} disabled={finishing || totalSets === 0}
          className="bg-yellow-400 px-10 py-4 text-sm font-black text-black hover:bg-yellow-300 transition-colors disabled:opacity-40">
          {finishing ? "Saving…" : `Finish workout · ${totalSets} sets`}
        </button>
        {totalSets === 0 && <p className="text-xs text-zinc-600">Log at least one set to finish</p>}
      </div>
      </div>
      <MusclePanel sessionMuscles={muscles} logs={logs} sessionExercises={sessionExercises} />
      </div>
    </div>
  );
}

// ── PHASE: done ─────────────────────────────────────────────────────────────
function PhaseDone({ summary, onAgain }) {
  const isRetroactive = summary.date.toDateString() !== new Date().toDateString();
  return (
    <div className="container max-w-2xl py-16 text-center">
      <p className="mb-4 text-6xl">💪</p>
      <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-zinc-500">Session complete</p>
      <h1 className="mb-3 text-5xl font-black">Workout logged.</h1>
      {isRetroactive && (
        <p className="mb-6 text-sm text-yellow-400">
          ✓ Saved to {summary.date.toLocaleDateString([], { weekday: "long", month: "short", day: "numeric" })} on your calendar
        </p>
      )}
      {!isRetroactive && (
        <p className="mb-6 text-sm text-yellow-400">✓ Marked green on today's calendar</p>
      )}
      <div className="mb-10 grid grid-cols-3 gap-px bg-zinc-800">
        {[
          { val: summary.totalSets, label: "Sets logged" },
          { val: summary.exercisesDone, label: "Exercises hit" },
          { val: Math.floor(summary.duration / 60) + "m", label: "Duration" },
        ].map(({ val, label }) => (
          <div key={label} className="bg-zinc-900 px-6 py-8">
            <p className="text-4xl font-black">{val}</p>
            <p className="mt-1 text-xs text-zinc-500">{label}</p>
          </div>
        ))}
      </div>
      <div className="flex flex-wrap justify-center gap-4">
        <button onClick={onAgain}
          className="bg-white px-8 py-3 text-sm font-black text-black hover:bg-zinc-200 transition-colors">
          Log another session
        </button>
        <a href="/calendar"
          className="border border-zinc-700 px-8 py-3 text-sm font-bold text-zinc-400 hover:border-white hover:text-white transition-colors">
          View calendar →
        </a>
        <a href="/dashboard"
          className="border border-zinc-700 px-8 py-3 text-sm font-bold text-zinc-400 hover:border-white hover:text-white transition-colors">
          Dashboard
        </a>
      </div>
    </div>
  );
}

// ── Main ────────────────────────────────────────────────────────────────────
export default function Page() {
  const [userId, setUserId] = useState(null);
  const [phase, setPhase] = useState("start");
  const [session, setSession] = useState(null);
  const [summary, setSummary] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data: { session: s } } = await supabase.auth.getSession();
      if (s?.user?.id) setUserId(s.user.id);
      setAuthLoading(false);
    })();
  }, []);

  const handleStart = async ({ title, scheduleId, notes, date }) => {
    const { data, error } = await supabase.from("workout_sessions").insert({
      user_id: userId,
      schedule_id: scheduleId ?? null,
      title,
      started_at: new Date().toISOString(),
    }).select().single();
    if (error) { console.error(error); return; }
    setSession({ id: data.id, title, scheduleId, notes, date });
    setPhase("session");
  };

  const handleFinish = (summaryData) => {
    setSummary(summaryData);
    setPhase("done");
  };

  if (authLoading) return (
    <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center">
      <p className="text-zinc-500">Loading...</p>
    </div>
  );

  if (!userId) return (
    <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center">
      <p className="text-zinc-500">Please <a href="/login" className="underline text-white">log in</a> first.</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {phase !== "session" && <Navbar1 />}
      {phase === "session" && (
        <div className="border-b border-zinc-800 flex items-center justify-between px-[5%] py-4">
          <span className="text-sm font-black">MyBro</span>
          <span className="text-xs text-zinc-500 uppercase tracking-widest">Session in progress</span>
          <button onClick={() => { if (confirm("End session without saving?")) setPhase("start"); }}
            className="text-xs text-zinc-600 hover:text-red-400 transition-colors">
            Cancel
          </button>
        </div>
      )}
      <div className="px-[5%]">
        {phase === "start"   && <PhaseStart userId={userId} onStart={handleStart} />}
        {phase === "session" && <PhaseSession userId={userId} session={session} onFinish={handleFinish} />}
        {phase === "done"    && <PhaseDone summary={summary} onAgain={() => { setPhase("start"); setSession(null); }} />}
      </div>
      {phase !== "session" && <Footer4 />}
    </div>
  );
}
"use client";

import { Button } from "@relume_io/relume-ui";
import React, { useState, useEffect } from "react";
import { exercises } from "../../data/exercises";
import { supabase } from "../../../lib/supabase";

const MUSCLE_GROUPS = ["Chest", "Back", "Shoulders", "Legs", "Biceps", "Triceps", "Abs"];

export function Event1() {
  const [selectedGroup, setSelectedGroup] = useState("Chest");
  const [userId, setUserId] = useState(null);
  const [loggingId, setLoggingId] = useState(null);
  const [sets, setSets] = useState("");
  const [reps, setReps] = useState("");
  const [weight, setWeight] = useState("");
  const [recentLogs, setRecentLogs] = useState([]);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const filteredExercises = exercises.filter((e) => e.muscleGroup === selectedGroup);

  useEffect(() => {
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user?.id) {
        setUserId(session.user.id);
        await loadRecentLogs(session.user.id);
      }
    })();
  }, []);

  const loadRecentLogs = async (uid) => {
    const { data } = await supabase
      .from("workout_logs")
      .select("id, exercise_name, muscle_group, sets, reps, weight_kg, logged_at")
      .eq("user_id", uid)
      .order("logged_at", { ascending: false })
      .limit(5);
    setRecentLogs(data ?? []);
  };

  const handleLog = async (exercise) => {
    if (!userId) { setErrorMsg("Please log in first."); return; }
    if (!sets && !reps) { setErrorMsg("Enter at least sets or reps."); return; }
    setErrorMsg("");

    const { error } = await supabase.from("workout_logs").insert({
      user_id: userId,
      exercise_name: exercise.name,
      muscle_group: exercise.muscleGroup,
      sets: sets ? parseInt(sets) : null,
      reps: reps ? parseInt(reps) : null,
      weight_kg: weight ? parseFloat(weight) : null,
      logged_at: new Date().toISOString(),
    });

    if (error) { setErrorMsg(error.message); return; }
    setSuccessMsg("✓ " + exercise.name + " logged!");
    setSets(""); setReps(""); setWeight("");
    setLoggingId(null);
    await loadRecentLogs(userId);
    setTimeout(() => setSuccessMsg(""), 3000);
  };

  const today = new Date();

  return (
    <section id="relume" className="px-[5%] py-16 md:py-24 lg:py-28">
      <div className="container">
        <div className="mb-12 md:mb-18 lg:mb-20">
          <div className="max-w-lg">
            <p className="mb-3 font-semibold md:mb-4">Workout Log</p>
            <h1 className="mb-5 text-5xl font-bold md:mb-6 md:text-7xl lg:text-8xl">Pick your target</h1>
            <p className="md:text-md">Select a muscle group then hit Log to record your sets</p>
          </div>
        </div>

        {/* Muscle group tabs */}
        <div className="no-scrollbar mb-12 ml-[-5vw] flex w-screen items-center overflow-auto pl-[5vw] md:ml-0 md:w-full md:overflow-hidden md:pl-0">
          {MUSCLE_GROUPS.map((group) => (
            <button
              key={group}
              onClick={() => { setSelectedGroup(group); setLoggingId(null); }}
              className={"border px-4 py-1.5 text-sm font-semibold transition-colors whitespace-nowrap mr-2 " +
                (selectedGroup === group ? "border-black bg-black text-white" : "border-border-primary hover:border-black")}
            >
              {group}
            </button>
          ))}
        </div>

        {successMsg && <p className="mb-6 text-sm font-medium text-green-700">{successMsg}</p>}
        {errorMsg && <p className="mb-6 text-sm font-medium text-red-600">{errorMsg}</p>}

        <div className="flex flex-col justify-start">
          {filteredExercises.map((exercise) => (
            <div key={exercise.id}>
              <div className="grid grid-cols-1 items-center gap-4 overflow-hidden border-t border-border-primary py-6 last-of-type:border-b md:grid-cols-[max-content_1fr_max-content] md:gap-8 md:py-8">
                <div className="flex min-w-28 flex-col items-center border border-border-primary bg-background-primary px-1 py-3 text-base">
                  <span>{today.toLocaleDateString([], { weekday: "short" })}</span>
                  <span className="text-2xl font-bold md:text-3xl lg:text-4xl">{today.getDate()}</span>
                  <span>{today.toLocaleDateString([], { month: "short", year: "numeric" })}</span>
                </div>
                <div className="flex w-full flex-col items-start justify-start">
                  <div className="mb-2 flex flex-wrap items-center gap-2 sm:mb-0 sm:gap-4">
                    <h2 className="text-xl font-bold md:text-2xl">{exercise.name}</h2>
                    <p className="bg-background-secondary px-2 py-1 text-sm font-semibold">{exercise.muscleGroup}</p>
                    <p className="bg-background-secondary px-2 py-1 text-sm font-semibold">{exercise.equipment}</p>
                    <p className="text-sm text-text-secondary">{exercise.difficulty}</p>
                  </div>
                </div>
                <div className="flex">
                  <Button variant="secondary" size="sm"
                    onClick={() => setLoggingId(loggingId === exercise.id ? null : exercise.id)}>
                    {loggingId === exercise.id ? "Cancel" : "Log"}
                  </Button>
                </div>
              </div>

              {loggingId === exercise.id && (
                <div className="mb-4 grid gap-4 border border-border-primary bg-background-secondary p-5 md:grid-cols-4">
                  <div className="grid gap-1">
                    <label className="text-xs font-semibold uppercase tracking-wide">Sets</label>
                    <input type="number" min="1" placeholder="e.g. 4" value={sets}
                      onChange={(e) => setSets(e.target.value)}
                      className="min-h-10 border border-border-primary bg-background-primary px-3 py-2 text-sm" />
                  </div>
                  <div className="grid gap-1">
                    <label className="text-xs font-semibold uppercase tracking-wide">Reps</label>
                    <input type="number" min="1" placeholder="e.g. 10" value={reps}
                      onChange={(e) => setReps(e.target.value)}
                      className="min-h-10 border border-border-primary bg-background-primary px-3 py-2 text-sm" />
                  </div>
                  <div className="grid gap-1">
                    <label className="text-xs font-semibold uppercase tracking-wide">Weight (kg)</label>
                    <input type="number" min="0" step="0.5" placeholder="e.g. 60" value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      className="min-h-10 border border-border-primary bg-background-primary px-3 py-2 text-sm" />
                  </div>
                  <div className="flex items-end">
                    <button onClick={() => handleLog(exercise)}
                      className="w-full bg-black px-4 py-2.5 text-sm font-semibold text-white hover:opacity-80 transition-opacity">
                      Save Log
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {recentLogs.length > 0 && (
          <div className="mt-16 border-t border-border-primary pt-10">
            <h3 className="mb-6 text-2xl font-bold md:text-3xl">Recent logs</h3>
            <div className="grid gap-3">
              {recentLogs.map((log) => (
                <div key={log.id} className="flex flex-wrap items-center justify-between gap-2 border border-border-primary px-5 py-4">
                  <div>
                    <p className="font-semibold">{log.exercise_name}</p>
                    <p className="text-sm text-text-secondary">{log.muscle_group}</p>
                  </div>
                  <div className="flex gap-4 text-sm">
                    {log.sets && <span>{log.sets} sets</span>}
                    {log.reps && <span>{log.reps} reps</span>}
                    {log.weight_kg && <span>{log.weight_kg} kg</span>}
                    <span className="text-text-secondary">{new Date(log.logged_at).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
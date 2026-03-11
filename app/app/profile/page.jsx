"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { Navbar1 } from "./components/Navbar1";
import { Footer4 } from "./components/Footer4";

const FITNESS_LEVELS = ["Just starting", "Some experience", "Intermediate", "Advanced", "Elite athlete"];
const PROGRAMS = ["PPL (Push Pull Legs)", "Upper/Lower", "Full Body", "Bro Split", "5/3/1", "GZCLP", "Custom"];
const GOALS = ["Build muscle", "Lose fat", "Improve strength", "Improve endurance", "General fitness", "Athletic performance"];

export default function Page() {
  const [userId, setUserId] = useState(null);
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [age, setAge] = useState("");
  const [fitnessLevel, setFitnessLevel] = useState(FITNESS_LEVELS[0]);
  const [program, setProgram] = useState("");
  const [goal, setGoal] = useState(GOALS[0]);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [totalWorkouts, setTotalWorkouts] = useState(null);

  useEffect(() => {
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user?.id) { setLoading(false); return; }
      setUserId(session.user.id);
      setEmail(session.user.email ?? "");

      const [profileRes, logsRes] = await Promise.all([
        supabase.from("profiles").select("*").eq("user_id", session.user.id).single(),
        supabase.from("workout_logs").select("id", { count: "exact" }).eq("user_id", session.user.id),
      ]);

      if (profileRes.data) {
        setFirstName(profileRes.data.first_name ?? "");
        setLastName(profileRes.data.last_name ?? "");
        setAge(profileRes.data.age ?? "");
        setFitnessLevel(profileRes.data.fitness_level ?? FITNESS_LEVELS[0]);
        setProgram(profileRes.data.program ?? "");
        setGoal(profileRes.data.goal ?? GOALS[0]);
        setNotes(profileRes.data.notes ?? "");
      }
      setTotalWorkouts(logsRes.count ?? 0);
      setLoading(false);
    })();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!userId) return;
    setSaving(true); setSuccessMsg(""); setErrorMsg("");
    const { error } = await supabase.from("profiles").upsert({
      user_id: userId, first_name: firstName, last_name: lastName,
      age: age ? parseInt(age) : null, fitness_level: fitnessLevel,
      program, goal, notes, updated_at: new Date().toISOString(),
    }, { onConflict: "user_id" });
    setSaving(false);
    if (error) { setErrorMsg(error.message); return; }
    setSuccessMsg("Saved!");
    setTimeout(() => setSuccessMsg(""), 3000);
  };

  const Field = ({ label, children }) => (
    <div className="grid gap-2">
      <label className="text-xs font-semibold uppercase tracking-widest text-zinc-500">{label}</label>
      {children}
    </div>
  );

  const inputClass = "min-h-11 border border-zinc-700 bg-zinc-800 px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:border-white focus:outline-none transition-colors";
  const selectClass = "min-h-11 border border-zinc-700 bg-zinc-800 px-4 py-2.5 text-sm text-white focus:border-white focus:outline-none transition-colors appearance-none";

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <Navbar1 />

      {/* Header */}
      <section className="border-b border-zinc-800 px-[5%] py-14">
        <div className="container flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-zinc-500">Account</p>
            <h1 className="text-6xl font-black leading-none tracking-tight md:text-8xl">
              {loading ? "..." : (firstName || "Your")} <br />
              <span className="text-zinc-500">Profile</span>
            </h1>
          </div>
          {totalWorkouts !== null && (
            <div className="flex gap-6">
              <div className="border border-zinc-800 bg-zinc-900 px-6 py-4 text-center">
                <p className="text-3xl font-black">{totalWorkouts}</p>
                <p className="mt-1 text-xs text-zinc-500 uppercase tracking-wider">Workouts logged</p>
              </div>
              <div className="border border-zinc-800 bg-zinc-900 px-6 py-4 text-center">
                <p className="text-3xl font-black">{fitnessLevel ? fitnessLevel.split(" ")[0] : "—"}</p>
                <p className="mt-1 text-xs text-zinc-500 uppercase tracking-wider">Level</p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Form */}
      <section className="px-[5%] py-12">
        <div className="container">
          {loading ? (
            <p className="text-zinc-500">Loading profile...</p>
          ) : (
            <form onSubmit={handleSave} className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:gap-16">

              {/* Left col */}
              <div className="grid gap-6">
                <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500 border-b border-zinc-800 pb-3">Personal</p>
                <div className="grid grid-cols-2 gap-4">
                  <Field label="First name">
                    <input className={inputClass} type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="John" />
                  </Field>
                  <Field label="Last name">
                    <input className={inputClass} type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Doe" />
                  </Field>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Email">
                    <input className={inputClass + " opacity-50 cursor-not-allowed"} type="email" value={email} disabled />
                  </Field>
                  <Field label="Age">
                    <input className={inputClass} type="number" min="10" max="100" value={age} onChange={(e) => setAge(e.target.value)} placeholder="25" />
                  </Field>
                </div>

                <p className="mt-2 text-xs font-semibold uppercase tracking-widest text-zinc-500 border-b border-zinc-800 pb-3">Training</p>
                <Field label="Fitness level">
                  <select className={selectClass} value={fitnessLevel} onChange={(e) => setFitnessLevel(e.target.value)}>
                    {FITNESS_LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
                  </select>
                </Field>
                <Field label="Current program">
                  <select className={selectClass} value={program} onChange={(e) => setProgram(e.target.value)}>
                    <option value="">Select a program</option>
                    {PROGRAMS.map((p) => <option key={p} value={p}>{p}</option>)}
                  </select>
                </Field>
                <Field label="Primary goal">
                  <select className={selectClass} value={goal} onChange={(e) => setGoal(e.target.value)}>
                    {GOALS.map((g) => <option key={g} value={g}>{g}</option>)}
                  </select>
                </Field>
              </div>

              {/* Right col */}
              <div className="grid gap-6 content-start">
                <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500 border-b border-zinc-800 pb-3">Notes for AI</p>
                <p className="text-sm text-zinc-400">Tell your Bro anything relevant — injuries, preferences, equipment access. The AI uses this when scheduling.</p>
                <Field label="Notes">
                  <textarea
                    className={inputClass + " min-h-48 resize-none"}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="e.g. Bad left knee, prefer dumbbells over barbells, only have access to a home gym with up to 30kg dumbbells..."
                  />
                </Field>

                {/* Summary card */}
                <div className="border border-zinc-800 bg-zinc-900 p-5">
                  <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-zinc-500">AI context preview</p>
                  <div className="grid gap-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Level</span>
                      <span className="font-semibold">{fitnessLevel}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Program</span>
                      <span className="font-semibold">{program || "Not set"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Goal</span>
                      <span className="font-semibold">{goal}</span>
                    </div>
                  </div>
                </div>

                {/* Save */}
                <div className="flex items-center gap-4">
                  <button type="submit" disabled={saving}
                    className="bg-white px-8 py-3 text-sm font-black text-black transition-colors hover:bg-zinc-200 disabled:opacity-50">
                    {saving ? "Saving..." : "Save profile"}
                  </button>
                  {successMsg && <p className="text-sm font-semibold text-green-400">{successMsg}</p>}
                  {errorMsg && <p className="text-sm font-semibold text-red-400">{errorMsg}</p>}
                </div>
              </div>
            </form>
          )}
        </div>
      </section>

      <Footer4 />
    </div>
  );
}

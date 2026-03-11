"use client";

import React, { useMemo, useState } from "react";
import { exercises } from "../data/exercises";
import { Navbar1 } from "./components/Navbar1";
import { Footer4 } from "./components/Footer4";

const MUSCLE_GROUPS = ["All", "Chest", "Back", "Shoulders", "Legs", "Biceps", "Triceps", "Abs"];

const DIFFICULTY_COLOR = {
  Beginner:     "text-green-400 border-green-800 bg-green-950/40",
  Intermediate: "text-yellow-400 border-yellow-800 bg-yellow-950/40",
  Advanced:     "text-red-400 border-red-800 bg-red-950/40",
};

const MUSCLE_ACCENT = {
  Chest:     "#ffffff",
  Back:      "#3b82f6",
  Shoulders: "#8b5cf6",
  Legs:      "#22c55e",
  Biceps:    "#f59e0b",
  Triceps:   "#f97316",
  Abs:       "#ef4444",
};

export default function Page() {
  const [search, setSearch] = useState("");
  const [muscle, setMuscle] = useState("All");
  const [equipment, setEquipment] = useState("All");
  const [expanded, setExpanded] = useState(null);

  const equipmentOptions = useMemo(() =>
    ["All", ...new Set(exercises.map((e) => e.equipment))], []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return exercises.filter((e) =>
      (muscle === "All" || e.muscleGroup === muscle) &&
      (equipment === "All" || e.equipment === equipment) &&
      (!q || e.name.toLowerCase().includes(q) || e.muscleGroup.toLowerCase().includes(q))
    );
  }, [search, muscle, equipment]);

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <Navbar1 />

      {/* ── Hero ── */}
      <section className="border-b border-zinc-800 px-[5%] py-14">
        <div className="container">
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-zinc-500">Exercise Database</p>
          <h1 className="text-6xl font-black leading-none tracking-tight md:text-8xl">
            Find your<br /><span className="text-zinc-500">movement</span>
          </h1>
          <p className="mt-4 max-w-md text-sm text-zinc-400">
            {exercises.length} exercises across {MUSCLE_GROUPS.length - 1} muscle groups. Filter, search, and build your perfect workout.
          </p>
        </div>
      </section>

      {/* ── Muscle group tabs ── */}
      <section className="border-b border-zinc-800 px-[5%]">
        <div className="container">
          <div className="flex overflow-x-auto">
            {MUSCLE_GROUPS.map((g) => (
              <button key={g} onClick={() => setMuscle(g)}
                className={"shrink-0 border-b-2 px-5 py-4 text-xs font-black uppercase tracking-widest transition-colors " +
                  (muscle === g
                    ? "border-white text-white"
                    : "border-transparent text-zinc-600 hover:text-zinc-400")}>
                {g}
                {g !== "All" && (
                  <span className="ml-2 text-zinc-700">
                    {exercises.filter((e) => e.muscleGroup === g).length}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Search + filter bar ── */}
      <section className="border-b border-zinc-800 px-[5%] py-5">
        <div className="container flex flex-wrap items-center gap-3">
          {/* Search */}
          <div className="relative flex-1 min-w-48">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 text-sm">⌕</span>
            <input
              type="text" value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Search exercises..."
              className="w-full border border-zinc-700 bg-zinc-900 pl-9 pr-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:border-white focus:outline-none transition-colors" />
          </div>

          {/* Equipment filter */}
          <select value={equipment} onChange={(e) => setEquipment(e.target.value)}
            className="border border-zinc-700 bg-zinc-900 px-4 py-2.5 text-sm text-white focus:border-white focus:outline-none transition-colors">
            {equipmentOptions.map((eq) => <option key={eq} value={eq}>{eq === "All" ? "All equipment" : eq}</option>)}
          </select>

          {/* Result count */}
          <p className="text-xs font-semibold text-zinc-500 ml-auto">
            {filtered.length} result{filtered.length !== 1 ? "s" : ""}
          </p>

          {/* Clear filters */}
          {(search || muscle !== "All" || equipment !== "All") && (
            <button onClick={() => { setSearch(""); setMuscle("All"); setEquipment("All"); }}
              className="text-xs text-zinc-600 underline hover:text-zinc-400 transition-colors">
              Clear
            </button>
          )}
        </div>
      </section>

      {/* ── Exercise grid ── */}
      <section className="px-[5%] py-10">
        <div className="container">
          {filtered.length === 0 ? (
            <div className="border border-zinc-800 bg-zinc-900 px-8 py-16 text-center">
              <p className="text-2xl font-black">No results</p>
              <p className="mt-2 text-sm text-zinc-500">Try a different search or filter.</p>
              <button onClick={() => { setSearch(""); setMuscle("All"); setEquipment("All"); }}
                className="mt-4 text-sm text-white underline hover:text-zinc-300">
                Clear filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
              {filtered.map((ex) => {
                const isOpen = expanded === ex.id;
                const accent = MUSCLE_ACCENT[ex.muscleGroup] ?? "#ffffff";
                return (
                  <div key={ex.id}
                    className={"border bg-zinc-900 transition-colors cursor-pointer " + (isOpen ? "border-white" : "border-zinc-800 hover:border-zinc-600")}
                    onClick={() => setExpanded(isOpen ? null : ex.id)}>

                    {/* Accent bar */}
                    <div className="h-0.5 w-full" style={{ background: accent }} />

                    <div className="p-5">
                      {/* Top row */}
                      <div className="mb-3 flex items-start justify-between gap-3">
                        <div>
                          <p className="mb-0.5 text-xs font-semibold uppercase tracking-widest" style={{ color: accent }}>
                            {ex.muscleGroup}
                          </p>
                          <h3 className="text-lg font-black leading-tight">{ex.name}</h3>
                        </div>
                        <span className={"shrink-0 border px-2 py-0.5 text-xs font-bold " + (DIFFICULTY_COLOR[ex.difficulty] ?? "text-zinc-400 border-zinc-700")}>
                          {ex.difficulty}
                        </span>
                      </div>

                      {/* Equipment pill */}
                      <div className="flex items-center gap-2">
                        <span className="border border-zinc-700 px-2.5 py-1 text-xs text-zinc-400">
                          {ex.equipment}
                        </span>
                        <span className="ml-auto text-xs text-zinc-600">{isOpen ? "▲ Less" : "▼ More"}</span>
                      </div>

                      {/* Expanded description */}
                      {isOpen && (
                        <div className="mt-4 border-t border-zinc-800 pt-4">
                          <p className="text-sm leading-relaxed text-zinc-400">{ex.description}</p>
                          <div className="mt-4 grid grid-cols-3 gap-2">
                            {[
                              { label: "Muscle", val: ex.muscleGroup },
                              { label: "Equipment", val: ex.equipment },
                              { label: "Level", val: ex.difficulty },
                            ].map(({ label, val }) => (
                              <div key={label} className="border border-zinc-800 bg-zinc-950 px-3 py-2 text-center">
                                <p className="text-xs text-zinc-600">{label}</p>
                                <p className="mt-0.5 text-xs font-bold">{val}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <Footer4 />
    </div>
  );
}
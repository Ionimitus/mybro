"use client";

import React, { useMemo, useState } from "react";
import { Input, Label } from "@relume_io/relume-ui";
import { exercises } from "../../data/exercises";

export function ExerciseDatabase() {
  const [searchTerm, setSearchTerm] = useState("");
  const [muscleGroup, setMuscleGroup] = useState("All");

  const muscleGroups = useMemo(
    () => ["All", ...new Set(exercises.map((exercise) => exercise.muscleGroup))],
    [],
  );

  const filteredExercises = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return exercises.filter((exercise) => {
      const matchesName = exercise.name.toLowerCase().includes(normalizedSearch);
      const matchesMuscleGroup =
        muscleGroup === "All" || exercise.muscleGroup === muscleGroup;

      return matchesName && matchesMuscleGroup;
    });
  }, [muscleGroup, searchTerm]);

  return (
    <section className="px-[5%] py-16 md:py-24 lg:py-28">
      <div className="container">
        <div className="mb-10 grid gap-4 border border-border-primary p-6 md:mb-12 md:grid-cols-[1fr_16rem] md:items-end md:p-8">
          <div className="grid gap-2">
            <Label htmlFor="exercise-search">Search exercises</Label>
            <Input
              id="exercise-search"
              type="text"
              placeholder="Search by exercise name"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="muscle-group-filter">Muscle group</Label>
            <select
              id="muscle-group-filter"
              value={muscleGroup}
              onChange={(event) => setMuscleGroup(event.target.value)}
              className="min-h-11 border border-border-primary bg-background-primary px-3 py-2"
            >
              {muscleGroups.map((group) => (
                <option key={group} value={group}>
                  {group}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <p className="mb-2 text-sm font-semibold">Database</p>
            <h2 className="text-3xl font-bold md:text-4xl">
              {filteredExercises.length} exercises found
            </h2>
          </div>
        </div>

        {filteredExercises.length === 0 ? (
          <div className="border border-border-primary p-6 md:p-8">
            <p className="text-lg font-semibold">No exercises match your filters.</p>
            <p className="mt-2 text-sm text-text-secondary">
              Try a different name or muscle group.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filteredExercises.map((exercise) => (
              <article
                key={exercise.id}
                className="flex h-full flex-col gap-4 border border-border-primary p-6"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="mb-2 text-sm font-semibold">
                      {exercise.muscleGroup}
                    </p>
                    <h3 className="text-2xl font-bold">{exercise.name}</h3>
                  </div>
                  <span className="border border-border-primary px-3 py-1 text-xs font-semibold uppercase tracking-[0.08em]">
                    {exercise.difficulty}
                  </span>
                </div>

                <div className="grid gap-3 text-sm md:text-base">
                  <div className="flex items-center justify-between gap-4 border-t border-border-primary pt-3">
                    <span className="text-text-secondary">Muscle group</span>
                    <span className="font-medium">{exercise.muscleGroup}</span>
                  </div>
                  <div className="flex items-center justify-between gap-4 border-t border-border-primary pt-3">
                    <span className="text-text-secondary">Difficulty</span>
                    <span className="font-medium">{exercise.difficulty}</span>
                  </div>
                  <div className="flex items-center justify-between gap-4 border-t border-border-primary pt-3">
                    <span className="text-text-secondary">Equipment</span>
                    <span className="font-medium">{exercise.equipment}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

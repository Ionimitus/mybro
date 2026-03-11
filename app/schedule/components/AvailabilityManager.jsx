"use client";

import React, { useEffect, useState } from "react";
import { Button, Input, Label } from "@relume_io/relume-ui";
import { supabase } from "../../../lib/supabase";

const DAYS_OF_WEEK = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const dayOrder = DAYS_OF_WEEK.reduce((acc, day, index) => {
  acc[day] = index;
  return acc;
}, {});

const sortAvailability = (rows) =>
  [...rows].sort((a, b) => {
    const dayDiff = (dayOrder[a.day_of_week] ?? 99) - (dayOrder[b.day_of_week] ?? 99);
    if (dayDiff !== 0) {
      return dayDiff;
    }

    return a.start_time.localeCompare(b.start_time);
  });

export function AvailabilityManager() {
  const [sessionUserId, setSessionUserId] = useState(null);
  const [availability, setAvailability] = useState([]);
  const [dayOfWeek, setDayOfWeek] = useState(DAYS_OF_WEEK[0]);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const loadAvailability = async (userId) => {
    const { data, error } = await supabase
      .from("availability")
      .select("id, day_of_week, start_time, end_time")
      .eq("user_id", userId);

    if (error) {
      throw error;
    }

    setAvailability(sortAvailability(data ?? []));
  };

  useEffect(() => {
    let isMounted = true;

    const initialize = async () => {
      if (!supabase) {
        if (isMounted) {
          setErrorMessage(
            "Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local.",
          );
          setLoading(false);
        }
        return;
      }

      try {
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError) {
          throw sessionError;
        }

        if (!session?.user?.id) {
          if (isMounted) {
            setErrorMessage("You need to log in to manage your availability.");
            setLoading(false);
          }
          return;
        }

        if (isMounted) {
          setSessionUserId(session.user.id);
        }

        await loadAvailability(session.user.id);
      } catch (error) {
        if (isMounted) {
          setErrorMessage(error.message ?? "Failed to load availability.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    initialize();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSuccessMessage("");
    setErrorMessage("");

    if (!sessionUserId) {
      setErrorMessage("You need to log in to manage your availability.");
      return;
    }

    if (!startTime || !endTime) {
      setErrorMessage("Please choose both a start time and an end time.");
      return;
    }

    if (startTime >= endTime) {
      setErrorMessage("End time must be after start time.");
      return;
    }

    setSaving(true);

    try {
      const { error } = await supabase.from("availability").insert({
        user_id: sessionUserId,
        day_of_week: dayOfWeek,
        start_time: startTime,
        end_time: endTime,
      });

      if (error) {
        throw error;
      }

      await loadAvailability(sessionUserId);
      setStartTime("");
      setEndTime("");
      setSuccessMessage("Availability saved.");
    } catch (error) {
      setErrorMessage(error.message ?? "Failed to save availability.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="px-[5%] py-16 md:py-24 lg:py-28">
      <div className="mx-auto grid w-full max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p className="mb-3 font-semibold md:mb-4">Availability</p>
          <h2 className="mb-5 text-5xl font-bold md:mb-6 md:text-7xl lg:text-8xl">
            Set when you can train
          </h2>
          <p className="md:text-md">
            Save your weekly availability so the app can build around your real
            schedule.
          </p>
          {successMessage && (
            <p className="mt-6 text-sm font-medium text-green-700">
              {successMessage}
            </p>
          )}
          {errorMessage && (
            <p className="mt-3 text-sm font-medium text-red-600">
              {errorMessage}
            </p>
          )}
        </div>

        <div className="grid gap-8">
          <form
            onSubmit={handleSubmit}
            className="grid gap-5 border border-border-primary p-6 md:p-8"
          >
            <div className="grid gap-2">
              <Label htmlFor="day_of_week">Day</Label>
              <select
                id="day_of_week"
                className="min-h-11 border border-border-primary bg-background-primary px-3 py-2"
                value={dayOfWeek}
                onChange={(event) => setDayOfWeek(event.target.value)}
                disabled={loading || saving}
              >
                {DAYS_OF_WEEK.map((day) => (
                  <option key={day} value={day}>
                    {day}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid gap-2 md:grid-cols-2 md:gap-4">
              <div className="grid gap-2">
                <Label htmlFor="start_time">Start time</Label>
                <Input
                  id="start_time"
                  type="time"
                  value={startTime}
                  onChange={(event) => setStartTime(event.target.value)}
                  disabled={loading || saving}
                  required={true}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="end_time">End time</Label>
                <Input
                  id="end_time"
                  type="time"
                  value={endTime}
                  onChange={(event) => setEndTime(event.target.value)}
                  disabled={loading || saving}
                  required={true}
                />
              </div>
            </div>

            <div>
              <Button type="submit" disabled={loading || saving || !sessionUserId}>
                {saving ? "Saving..." : "Add availability"}
              </Button>
            </div>
          </form>

          <div className="border border-border-primary p-6 md:p-8">
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <h3 className="text-2xl font-bold md:text-3xl">
                  Saved availability
                </h3>
                <p className="mt-2 text-sm text-text-secondary">
                  Current entries for your account
                </p>
              </div>
            </div>

            {loading ? (
              <p>Loading availability...</p>
            ) : availability.length === 0 ? (
              <p>No availability saved yet.</p>
            ) : (
              <div className="grid gap-3">
                {availability.map((slot) => (
                  <div
                    key={slot.id}
                    className="flex flex-col gap-2 border border-border-primary p-4 md:flex-row md:items-center md:justify-between"
                  >
                    <p className="font-semibold">{slot.day_of_week}</p>
                    <p className="text-sm md:text-base">
                      {slot.start_time.slice(0, 5)} - {slot.end_time.slice(0, 5)}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

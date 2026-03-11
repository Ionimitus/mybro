"use client";

import React, { useEffect, useState } from "react";
import { Button, Input, Label } from "@relume_io/relume-ui";
import Calendar from "@/app/components/Calendar";
import { supabase } from "../../../lib/supabase";

const mapEventsForCalendar = (events) =>
  events.map((event) => ({
    id: event.id,
    title: event.title,
    start: event.start_at,
    end: event.end_at,
  }));

export function BusyEventsManager() {
  const [userId, setUserId] = useState(null);
  const [events, setEvents] = useState([]);
  const [title, setTitle] = useState("");
  const [startAt, setStartAt] = useState("");
  const [endAt, setEndAt] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const loadEvents = async (currentUserId) => {
    const { data, error } = await supabase
      .from("events")
      .select("id, title, start_at, end_at")
      .eq("user_id", currentUserId)
      .order("start_at", { ascending: true });

    if (error) {
      throw error;
    }

    setEvents(data ?? []);
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
            setErrorMessage("You need to log in to manage your schedule.");
            setLoading(false);
          }
          return;
        }

        if (isMounted) {
          setUserId(session.user.id);
        }

        await loadEvents(session.user.id);
      } catch (error) {
        if (isMounted) {
          setErrorMessage(error.message ?? "Failed to load events.");
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

    if (!userId) {
      setErrorMessage("You need to log in to manage your schedule.");
      return;
    }

    if (!title.trim() || !startAt || !endAt) {
      setErrorMessage("Please complete all event fields.");
      return;
    }

    if (startAt >= endAt) {
      setErrorMessage("End time must be after start time.");
      return;
    }

    setSaving(true);

    try {
      const startAtIso = new Date(startAt).toISOString();
      const endAtIso = new Date(endAt).toISOString();

      const { error } = await supabase.from("events").insert({
        user_id: userId,
        title: title.trim(),
        start_at: startAtIso,
        end_at: endAtIso,
        event_type: "busy",
      });

      if (error) {
        throw error;
      }

      await loadEvents(userId);
      setTitle("");
      setStartAt("");
      setEndAt("");
      setSuccessMessage("Busy event saved.");
    } catch (error) {
      setErrorMessage(error.message ?? "Failed to save event.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="px-[5%] py-16 md:py-24">
      <div className="mx-auto grid w-full max-w-7xl gap-8 xl:grid-cols-[24rem_1fr]">
        <div className="border border-border-primary p-6 md:p-8">
          <p className="mb-3 font-semibold md:mb-4">Busy events</p>
          <h2 className="mb-5 text-4xl font-bold md:mb-6 md:text-5xl">
            Block out your time
          </h2>
          <p className="mb-6 md:text-md">
            Add classes, work, travel, or anything else that should count as
            busy time in your schedule.
          </p>

          {successMessage && (
            <p className="mb-3 text-sm font-medium text-green-700">
              {successMessage}
            </p>
          )}
          {errorMessage && (
            <p className="mb-3 text-sm font-medium text-red-600">
              {errorMessage}
            </p>
          )}

          <form onSubmit={handleSubmit} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="busy-title">Title</Label>
              <Input
                id="busy-title"
                type="text"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Work, class, commute"
                disabled={loading || saving}
                required={true}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="busy-start-at">Start</Label>
              <Input
                id="busy-start-at"
                type="datetime-local"
                value={startAt}
                onChange={(event) => setStartAt(event.target.value)}
                disabled={loading || saving}
                required={true}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="busy-end-at">End</Label>
              <Input
                id="busy-end-at"
                type="datetime-local"
                value={endAt}
                onChange={(event) => setEndAt(event.target.value)}
                disabled={loading || saving}
                required={true}
              />
            </div>

            <Button type="submit" disabled={loading || saving || !userId}>
              {saving ? "Saving..." : "Add busy event"}
            </Button>
          </form>
        </div>

        <div className="border border-border-primary p-2 md:p-4">
          {loading ? (
            <div className="p-6">
              <p>Loading calendar...</p>
            </div>
          ) : (
            <Calendar events={mapEventsForCalendar(events)} />
          )}
        </div>
      </div>
    </section>
  );
}

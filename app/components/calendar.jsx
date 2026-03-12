"use client";

import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function CalendarView({ dark = false, refreshKey = 0 }) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session?.user?.id) {
      setLoading(false);
      return;
    }

    const uid = session.user.id;

    const [busyRes, scheduledRes] = await Promise.all([
      supabase.from("events").select("title, start_at, end_at").eq("user_id", uid),
      supabase
        .from("schedules")
        .select("title, start_at, end_at, completed")
        .eq("user_id", uid),
    ]);

    setEvents([
      ...(busyRes.data ?? []).map((event) => ({
        title: event.title,
        start: event.start_at,
        end: event.end_at,
        classNames: ["fc-event-busy"],
        extendedProps: {
          category: "Busy",
          icon: "Blocked",
        },
      })),
      ...(scheduledRes.data ?? []).map((event) =>
        event.completed
          ? {
              title: event.title,
              start: event.start_at,
              end: event.end_at,
              classNames: ["fc-event-completed"],
              extendedProps: {
                category: "Completed",
                icon: "Done",
              },
            }
          : {
              title: event.title,
              start: event.start_at,
              end: event.end_at,
              classNames: ["fc-event-workout"],
              extendedProps: {
                category: "Workout",
                icon: "Train",
              },
            },
      ),
    ]);

    setLoading(false);
  }, []);

  useEffect(() => {
    const loadEvents = async () => {
      await fetchEvents();
    };

    void loadEvents();
  }, [fetchEvents, refreshKey]);

  useEffect(() => {
    const onFocus = () => fetchEvents();
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, [fetchEvents]);

  const summary = {
    total: events.length,
    busy: events.filter((event) => event.extendedProps?.category === "Busy").length,
    workouts: events.filter((event) => event.extendedProps?.category === "Workout").length,
    completed: events.filter((event) => event.extendedProps?.category === "Completed").length,
  };

  if (loading) {
    return (
      <div className={`calendar-shell ${dark ? "calendar-shell-dark" : ""}`}>
        <div className="calendar-loading-grid">
          <div className="calendar-loading-block h-24" />
          <div className="calendar-loading-block h-[28rem]" />
        </div>
      </div>
    );
  }

  return (
    <section className={`calendar-shell ${dark ? "calendar-shell-dark" : ""}`}>
      <div className="calendar-shell__glow" />

      <div className="calendar-shell__header">
        <div>
          <p className="calendar-shell__eyebrow">Training planner</p>
          <h2 className="calendar-shell__title">Your week at a glance</h2>
          <p className="calendar-shell__subtitle">
            Busy blocks, planned sessions, and completed workouts in one view.
          </p>
        </div>

        <button
          onClick={fetchEvents}
          className="calendar-refresh-button"
          title="Refresh calendar"
        >
          Refresh
        </button>
      </div>

      <div className="calendar-summary">
        <div className="calendar-summary__card">
          <span className="calendar-summary__label">Entries</span>
          <strong className="calendar-summary__value">{summary.total}</strong>
        </div>
        <div className="calendar-summary__card">
          <span className="calendar-dot calendar-dot-busy" />
          <span className="calendar-summary__label">Busy</span>
          <strong className="calendar-summary__value">{summary.busy}</strong>
        </div>
        <div className="calendar-summary__card">
          <span className="calendar-dot calendar-dot-workout" />
          <span className="calendar-summary__label">Workout</span>
          <strong className="calendar-summary__value">{summary.workouts}</strong>
        </div>
        <div className="calendar-summary__card">
          <span className="calendar-dot calendar-dot-completed" />
          <span className="calendar-summary__label">Done</span>
          <strong className="calendar-summary__value">{summary.completed}</strong>
        </div>
      </div>

      <div className="calendar-frame">
        <FullCalendar
          plugins={[timeGridPlugin, dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          timeZone="local"
          height="auto"
          events={events}
          nowIndicator
          dayMaxEvents={3}
          expandRows
          dayHeaderFormat={{ weekday: "short", month: "short", day: "numeric" }}
          eventTimeFormat={{ hour: "numeric", minute: "2-digit", meridiem: "short" }}
          slotLabelFormat={{ hour: "numeric", minute: "2-digit", meridiem: "short" }}
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay",
          }}
          eventContent={(arg) => (
            <div className="calendar-event-content">
              <span className="calendar-event-content__meta">
                {arg.event.extendedProps?.icon}
              </span>
              <span className="calendar-event-content__title">{arg.event.title}</span>
            </div>
          )}
        />
      </div>
    </section>
  );
}

"use client";

import React from "react";
import { Navbar1 } from "./components/Navbar1";
import { Footer4 } from "./components/Footer4";
import { ScheduleManager } from "./components/ScheduleManager";

export default function Page() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <Navbar1 />
      <ScheduleManager />
      <Footer4 />
    </div>
  );
}

import React from "react";
import { Navbar1 } from "./components/Navbar1";
import { Login1 } from "./components/Login1";
import { Footer4 } from "./components/Footer4";

export default function Page() {
  return (
    <div className="app-shell">
      <Navbar1 />
      <Login1 />
      <Footer4 />
    </div>
  );
}

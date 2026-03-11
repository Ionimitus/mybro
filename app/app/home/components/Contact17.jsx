"use client";

import React from "react";
import { BiEnvelope, BiMap, BiPhone } from "react-icons/bi";

export function Contact17() {
  return (
    <div className="grid auto-cols-fr grid-cols-1 gap-px bg-zinc-800 md:grid-cols-3">
      <div className="bg-zinc-900 px-8 py-10">
        <div className="mb-5">
          <BiEnvelope className="size-8 text-zinc-500" />
        </div>
        <h3 className="mb-2 text-xl font-black">Email</h3>
        <p className="text-sm text-zinc-400">hello@mybro.com</p>
      </div>
      <div className="bg-zinc-900 px-8 py-10">
        <div className="mb-5">
          <BiPhone className="size-8 text-zinc-500" />
        </div>
        <h3 className="mb-2 text-xl font-black">Phone</h3>
        <p className="text-sm text-zinc-400">(+63) 1234 567 8910</p>
      </div>
      <div className="bg-zinc-900 px-8 py-10">
        <div className="mb-5">
          <BiMap className="size-8 text-zinc-500" />
        </div>
        <h3 className="mb-2 text-xl font-black">Office</h3>
        <p className="text-sm text-zinc-400">Don Julian Rodriguez Avenue, Ma-a Road, Davao City, Philippines</p>
      </div>
    </div>
  );
}

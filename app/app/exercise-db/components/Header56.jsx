"use client";

import { Button } from "@relume_io/relume-ui";
import React from "react";

export function Header56() {
  return (
    <section id="relume" className="relative px-[5%] py-16 md:py-24 lg:py-28">
      <div className="container relative z-10">
        <div className="flex flex-col gap-5 md:flex-row md:gap-12 lg:gap-20">
          <div className="w-full max-w-lg">
            <p className="mb-3 font-semibold text-text-alternative md:mb-4">
              Complete
            </p>
            <h1 className="text-6xl font-bold text-text-alternative md:text-9xl lg:text-10xl">
              Find your exercise
            </h1>
          </div>
          <div className="w-full max-w-lg">
            <p className="text-text-alternative md:text-md">
              Search thousands of movements. Filter by muscle group, equipment,
              or difficulty. Build better workouts.
            </p>
            <div className="mt-6 flex flex-wrap gap-4 md:mt-8">
              <Button title="Search">Search</Button>
              <Button title="Browse" variant="secondary-alt">
                Browse
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute inset-0 z-0">
        <img
          src="https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg"
          className="size-full object-cover"
          alt="Relume placeholder image"
        />
        <div className="absolute inset-0 bg-black/50" />
      </div>
    </section>
  );
}

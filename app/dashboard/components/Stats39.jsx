"use client";

import { Button } from "@relume_io/relume-ui";
import React from "react";
import { RxChevronRight } from "react-icons/rx";

export function Stats39() {
  return (
    <section id="relume" className="px-[5%] py-16 md:py-24 lg:py-28">
      <div className="container">
        <div className="mb-12 max-w-lg md:mb-18 lg:mb-20">
          <p className="mb-3 font-semibold md:mb-4">Metrics</p>
          <h2 className="mb-5 text-5xl font-bold md:mb-6 md:text-7xl lg:text-8xl">
            You've been on a roll!
          </h2>
          <p className="md:text-md">
            Every workout logged builds the picture of your strength. Watch the
            data accumulate and see patterns emerge that matter.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="border border-border-primary p-8">
            <h3 className="mb-8 text-md font-bold leading-[1.4] md:mb-10 md:text-xl lg:mb-12">
              Current program
            </h3>
            <p className="text-right text-10xl font-bold leading-[1.3] md:text-[4rem] lg:text-[5rem]">
              PPL/UL
            </p>
            <div className="my-4 h-px w-full bg-border-primary" />
            <p className="text-right">Days of consistent training</p>
          </div>
          <div className="border border-border-primary p-8">
            <h3 className="mb-8 text-md font-bold leading-[1.4] md:mb-10 md:text-xl lg:mb-12">
              Total workouts
            </h3>
            <p className="text-right text-10xl font-bold leading-[1.3] md:text-[4rem] lg:text-[5rem]">
              67
            </p>
            <div className="my-4 h-px w-full bg-border-primary" />
            <p className="text-right">Sessions completed since you started</p>
          </div>
          <div className="border border-border-primary p-8">
            <h3 className="mb-8 text-md font-bold leading-[1.4] md:mb-10 md:text-xl lg:mb-12">
              Muscle groups hit
            </h3>
            <p className="text-right text-10xl font-bold leading-[1.3] md:text-[4rem] lg:text-[5rem]">
              12
            </p>
            <div className="my-4 h-px w-full bg-border-primary" />
            <p className="text-right">Balanced development across your frame</p>
          </div>
          <div className="border border-border-primary p-8">
            <h3 className="mb-8 text-md font-bold leading-[1.4] md:mb-10 md:text-xl lg:mb-12">
              Frequency
            </h3>
            <p className="text-right text-10xl font-bold leading-[1.3] md:text-[4rem] lg:text-[5rem]">
              4x/week
            </p>
            <div className="my-4 h-px w-full bg-border-primary" />
            <p className="text-right">
              Combined weight across all completed sessions
            </p>
          </div>
          <div className="border border-border-primary p-8">
            <h3 className="mb-8 text-md font-bold leading-[1.4] md:mb-10 md:text-xl lg:mb-12">
              Heaviest PR - Deadlift
            </h3>
            <p className="text-right text-10xl font-bold leading-[1.3] md:text-[4rem] lg:text-[5rem]">
              250 lb
            </p>
            <div className="my-4 h-px w-full bg-border-primary" />
            <p className="text-right">
              Total reps lifted in your training cycle
            </p>
          </div>
          <div className="border border-border-primary p-8">
            <h3 className="mb-8 text-md font-bold leading-[1.4] md:mb-10 md:text-xl lg:mb-12">
              Training consistency
            </h3>
            <p className="text-right text-10xl font-bold leading-[1.3] md:text-[4rem] lg:text-[5rem]">
              78%
            </p>
            <div className="my-4 h-px w-full bg-border-primary" />
            <p className="text-right">
              Workouts completed versus scheduled this month
            </p>
          </div>
        </div>
        <div className="mt-10 flex flex-wrap items-center gap-4 md:mt-14 lg:mt-16">
          <Button title="View" variant="secondary">
            View
          </Button>
          <Button
            title="→"
            variant="link"
            size="link"
            iconRight={<RxChevronRight />}
          >
            →
          </Button>
        </div>
      </div>
    </section>
  );
}

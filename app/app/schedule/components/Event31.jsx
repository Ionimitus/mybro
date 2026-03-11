"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Button,
} from "@relume_io/relume-ui";
import React from "react";

export function Event31() {
  return (
    <section id="relume" className="px-[5%] py-16 md:py-24 lg:py-28">
      <div className="container">
        <div className="mb-12 md:mb-18 lg:mb-20">
          <div className="mx-auto max-w-lg text-center">
            <h4 className="font-semibold">Live</h4>
            <h1 className="mt-3 text-5xl font-bold md:mt-4 md:text-7xl lg:text-8xl">
              Your week, scheduled
            </h1>
            <p className="mt-5 text-base md:mt-6 md:text-md">
              See what the AI built for you this week and start training
            </p>
          </div>
        </div>
        <Accordion type="multiple">
          <AccordionItem value="item-0" className="first:border-t-0">
            <AccordionTrigger className="text-2xl md:py-5 md:text-3xl md:leading-[1.3] lg:text-4xl">
              Monday 11 Feb
            </AccordionTrigger>
            <AccordionContent className="mb-6 pb-0 md:mb-0">
              <div className="grid grid-cols-1 items-center gap-4 border-t border-border-primary py-6 md:grid-cols-[6rem_1fr_max-content] md:gap-8 md:py-8">
                <div className="text-md md:text-lg">6:30 am</div>
                <div className="grid grid-cols-1 items-center gap-2 lg:grid-cols-[1fr_.25fr_.25fr] lg:gap-4">
                  <div className="flex w-full flex-wrap items-center gap-2 sm:gap-4">
                    <h5 className="text-xl font-bold md:text-2xl">
                      Chest and back
                    </h5>
                    <div className="flex items-center gap-2">
                      <div className="bg-background-secondary px-2 py-1 text-sm font-semibold">
                        Strength
                      </div>
                      <div className="bg-background-secondary px-2 py-1 text-sm font-semibold">
                        Home
                      </div>
                    </div>
                  </div>
                  <div>You</div>
                  <div>Home</div>
                </div>
                <div className="flex">
                  <Button
                    variant="secondary"
                    size="sm"
                    title="Start now"
                    asChild={true}
                  >
                    <a href="#">Start now</a>
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-1 items-center gap-4 border-t border-border-primary py-6 md:grid-cols-[6rem_1fr_max-content] md:gap-8 md:py-8">
                <div className="text-md md:text-lg">12:00 pm</div>
                <div className="grid grid-cols-1 items-center gap-2 lg:grid-cols-[1fr_.25fr_.25fr] lg:gap-4">
                  <div className="flex w-full flex-wrap items-center gap-2 sm:gap-4">
                    <h5 className="text-xl font-bold md:text-2xl">Core work</h5>
                    <div className="flex items-center gap-2">
                      <div className="bg-background-secondary px-2 py-1 text-sm font-semibold">
                        Conditioning
                      </div>
                    </div>
                  </div>
                  <div>You</div>
                  <div>Office</div>
                </div>
                <div className="flex">
                  <Button
                    variant="secondary"
                    size="sm"
                    title="Start now"
                    asChild={true}
                  >
                    <a href="#">Start now</a>
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-1 items-center gap-4 border-t border-border-primary py-6 md:grid-cols-[6rem_1fr_max-content] md:gap-8 md:py-8">
                <div className="text-md md:text-lg">5:45 pm</div>
                <div className="grid grid-cols-1 items-center gap-2 lg:grid-cols-[1fr_.25fr_.25fr] lg:gap-4">
                  <div className="flex w-full flex-wrap items-center gap-2 sm:gap-4">
                    <h5 className="text-xl font-bold md:text-2xl">
                      Legs and glutes
                    </h5>
                    <div className="flex items-center gap-2">
                      <div className="bg-background-secondary px-2 py-1 text-sm font-semibold">
                        Strength
                      </div>
                    </div>
                  </div>
                  <div>You</div>
                  <div>Gym</div>
                </div>
                <div className="flex">
                  <Button
                    variant="secondary"
                    size="sm"
                    title="Start now"
                    asChild={true}
                  >
                    <a href="#">Start now</a>
                  </Button>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-1" className="first:border-t-0">
            <AccordionTrigger className="text-2xl md:py-5 md:text-3xl md:leading-[1.3] lg:text-4xl">
              Tuesday 12 Feb
            </AccordionTrigger>
            <AccordionContent className="mb-6 pb-0 md:mb-0">
              <div className="grid grid-cols-1 items-center gap-4 border-t border-border-primary py-6 md:grid-cols-[6rem_1fr_max-content] md:gap-8 md:py-8">
                <div className="text-md md:text-lg">6:00 am</div>
                <div className="grid grid-cols-1 items-center gap-2 lg:grid-cols-[1fr_.25fr_.25fr] lg:gap-4">
                  <div className="flex w-full flex-wrap items-center gap-2 sm:gap-4">
                    <h5 className="text-xl font-bold md:text-2xl">
                      Shoulders and arms
                    </h5>
                    <div className="flex items-center gap-2">
                      <div className="bg-background-secondary px-2 py-1 text-sm font-semibold">
                        Strength
                      </div>
                      <div className="bg-background-secondary px-2 py-1 text-sm font-semibold">
                        Cardio
                      </div>
                    </div>
                  </div>
                  <div>You</div>
                  <div>Gym</div>
                </div>
                <div className="flex">
                  <Button
                    variant="secondary"
                    size="sm"
                    title="Start now"
                    asChild={true}
                  >
                    <a href="#">Start now</a>
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-1 items-center gap-4 border-t border-border-primary py-6 md:grid-cols-[6rem_1fr_max-content] md:gap-8 md:py-8">
                <div className="text-md md:text-lg">1:00 pm</div>
                <div className="grid grid-cols-1 items-center gap-2 lg:grid-cols-[1fr_.25fr_.25fr] lg:gap-4">
                  <div className="flex w-full flex-wrap items-center gap-2 sm:gap-4">
                    <h5 className="text-xl font-bold md:text-2xl">
                      Active recovery
                    </h5>
                    <div className="flex items-center gap-2">
                      <div className="bg-background-secondary px-2 py-1 text-sm font-semibold">
                        Mobility
                      </div>
                    </div>
                  </div>
                  <div>You</div>
                  <div>Home</div>
                </div>
                <div className="flex">
                  <Button
                    variant="secondary"
                    size="sm"
                    title="Start now"
                    asChild={true}
                  >
                    <a href="#">Start now</a>
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-1 items-center gap-4 border-t border-border-primary py-6 md:grid-cols-[6rem_1fr_max-content] md:gap-8 md:py-8">
                <div className="text-md md:text-lg">6:00 pm</div>
                <div className="grid grid-cols-1 items-center gap-2 lg:grid-cols-[1fr_.25fr_.25fr] lg:gap-4">
                  <div className="flex w-full flex-wrap items-center gap-2 sm:gap-4">
                    <h5 className="text-xl font-bold md:text-2xl">
                      Back and biceps
                    </h5>
                    <div className="flex items-center gap-2">
                      <div className="bg-background-secondary px-2 py-1 text-sm font-semibold">
                        Strength
                      </div>
                    </div>
                  </div>
                  <div>You</div>
                  <div>Gym</div>
                </div>
                <div className="flex">
                  <Button
                    variant="secondary"
                    size="sm"
                    title="Start now"
                    asChild={true}
                  >
                    <a href="#">Start now</a>
                  </Button>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2" className="first:border-t-0">
            <AccordionTrigger className="text-2xl md:py-5 md:text-3xl md:leading-[1.3] lg:text-4xl">
              Wednesday 13 Feb
            </AccordionTrigger>
            <AccordionContent className="mb-6 pb-0 md:mb-0">
              <div className="grid grid-cols-1 items-center gap-4 border-t border-border-primary py-6 md:grid-cols-[6rem_1fr_max-content] md:gap-8 md:py-8">
                <div className="text-md md:text-lg">7:00 am</div>
                <div className="grid grid-cols-1 items-center gap-2 lg:grid-cols-[1fr_.25fr_.25fr] lg:gap-4">
                  <div className="flex w-full flex-wrap items-center gap-2 sm:gap-4">
                    <h5 className="text-xl font-bold md:text-2xl">Full body</h5>
                    <div className="flex items-center gap-2">
                      <div className="bg-background-secondary px-2 py-1 text-sm font-semibold">
                        Strength
                      </div>
                      <div className="bg-background-secondary px-2 py-1 text-sm font-semibold">
                        Cardio
                      </div>
                    </div>
                  </div>
                  <div>You</div>
                  <div>Gym</div>
                </div>
                <div className="flex">
                  <Button
                    variant="secondary"
                    size="sm"
                    title="Start now"
                    asChild={true}
                  >
                    <a href="#">Start now</a>
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-1 items-center gap-4 border-t border-border-primary py-6 md:grid-cols-[6rem_1fr_max-content] md:gap-8 md:py-8">
                <div className="text-md md:text-lg">12:30 pm</div>
                <div className="grid grid-cols-1 items-center gap-2 lg:grid-cols-[1fr_.25fr_.25fr] lg:gap-4">
                  <div className="flex w-full flex-wrap items-center gap-2 sm:gap-4">
                    <h5 className="text-xl font-bold md:text-2xl">
                      Stretching
                    </h5>
                    <div className="flex items-center gap-2">
                      <div className="bg-background-secondary px-2 py-1 text-sm font-semibold">
                        Flexibility
                      </div>
                    </div>
                  </div>
                  <div>You</div>
                  <div>Home</div>
                </div>
                <div className="flex">
                  <Button
                    variant="secondary"
                    size="sm"
                    title="Start now"
                    asChild={true}
                  >
                    <a href="#">Start now</a>
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-1 items-center gap-4 border-t border-border-primary py-6 md:grid-cols-[6rem_1fr_max-content] md:gap-8 md:py-8">
                <div className="text-md md:text-lg">5:30 pm</div>
                <div className="grid grid-cols-1 items-center gap-2 lg:grid-cols-[1fr_.25fr_.25fr] lg:gap-4">
                  <div className="flex w-full flex-wrap items-center gap-2 sm:gap-4">
                    <h5 className="text-xl font-bold md:text-2xl">Push day</h5>
                    <div className="flex items-center gap-2">
                      <div className="bg-background-secondary px-2 py-1 text-sm font-semibold">
                        Strength
                      </div>
                    </div>
                  </div>
                  <div>You</div>
                  <div>Gym</div>
                </div>
                <div className="flex">
                  <Button
                    variant="secondary"
                    size="sm"
                    title="Start now"
                    asChild={true}
                  >
                    <a href="#">Start now</a>
                  </Button>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </section>
  );
}

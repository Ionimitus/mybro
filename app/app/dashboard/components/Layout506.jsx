"use client";

import {
  Button,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@relume_io/relume-ui";
import React from "react";
import { RxChevronRight } from "react-icons/rx";

export function Layout506() {
  return (
    <section id="relume" className="px-[5%] py-16 md:py-24 lg:py-28">
      <div className="container">
        <div className="mx-auto mb-12 w-full max-w-lg text-center md:mb-18 lg:mb-20">
          <p className="mb-3 font-semibold md:mb-4">Navigate</p>
          <h1 className="mb-5 text-5xl font-bold md:mb-6 md:text-7xl lg:text-8xl">
            Your training hub
          </h1>
          <p className="md:text-md">
            Everything you need to train smart and track progress. Pick what
            matters most right now.
          </p>
        </div>
        <Tabs
          defaultValue="tab-1"
          orientation="vertical"
          className="relative grid auto-cols-fr grid-cols-1 border border-border-primary md:grid-cols-[1.5fr_1fr]"
        >
          <TabsContent
            value="tab-1"
            className="data-[state=active]:animate-tabs"
          >
            <div className="flex h-full flex-col justify-center p-6 md:p-8 lg:p-16">
              <div className="rb-5 mb-5 md:mb-6">
                <img
                  src="https://d22po4pjz3o32e.cloudfront.net/relume-icon.svg"
                  className="size-12"
                  alt="Relume logo 1"
                />
              </div>
              <h2 className="rb-5 mb-5 text-4xl font-bold leading-[1.2] md:mb-6 md:text-5xl lg:text-6xl">
                Record your sets, reps, and weight
              </h2>
              <p>
                Every session logged builds your training history. The dashboard
                learns from what you do.
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-4 md:mt-8">
                <Button title="Start" variant="secondary">
                  Start
                </Button>
                <Button
                  title="View"
                  variant="link"
                  size="link"
                  iconRight={<RxChevronRight />}
                >
                  View
                </Button>
              </div>
            </div>
          </TabsContent>
          <TabsContent
            value="tab-2"
            className="data-[state=active]:animate-tabs"
          >
            <div className="flex h-full flex-col justify-center p-6 md:p-8 lg:p-16">
              <div className="rb-5 mb-5 md:mb-6">
                <img
                  src="https://d22po4pjz3o32e.cloudfront.net/relume-icon.svg"
                  className="size-12"
                  alt="Relume logo 2"
                />
              </div>
              <h2 className="rb-5 mb-5 text-4xl font-bold leading-[1.2] md:mb-6 md:text-5xl lg:text-6xl">
                Record your sets, reps, and weight
              </h2>
              <p>
                Every session logged builds your training history. The dashboard
                learns from what you do.
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-4 md:mt-8">
                <Button title="Start" variant="secondary">
                  Start
                </Button>
                <Button
                  title="View"
                  variant="link"
                  size="link"
                  iconRight={<RxChevronRight />}
                >
                  View
                </Button>
              </div>
            </div>
          </TabsContent>
          <TabsContent
            value="tab-3"
            className="data-[state=active]:animate-tabs"
          >
            <div className="flex h-full flex-col justify-center p-6 md:p-8 lg:p-16">
              <div className="rb-5 mb-5 md:mb-6">
                <img
                  src="https://d22po4pjz3o32e.cloudfront.net/relume-icon.svg"
                  className="size-12"
                  alt="Relume logo 3"
                />
              </div>
              <h2 className="rb-5 mb-5 text-4xl font-bold leading-[1.2] md:mb-6 md:text-5xl lg:text-6xl">
                Record your sets, reps, and weight
              </h2>
              <p>
                Every session logged builds your training history. The dashboard
                learns from what you do.
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-4 md:mt-8">
                <Button title="Start" variant="secondary">
                  Start
                </Button>
                <Button
                  title="View"
                  variant="link"
                  size="link"
                  iconRight={<RxChevronRight />}
                >
                  View
                </Button>
              </div>
            </div>
          </TabsContent>
          <TabsContent
            value="tab-4"
            className="data-[state=active]:animate-tabs"
          >
            <div className="flex h-full flex-col justify-center p-6 md:p-8 lg:p-16">
              <div className="rb-5 mb-5 md:mb-6">
                <img
                  src="https://d22po4pjz3o32e.cloudfront.net/relume-icon.svg"
                  className="size-12"
                  alt="Relume logo 4"
                />
              </div>
              <h2 className="rb-5 mb-5 text-4xl font-bold leading-[1.2] md:mb-6 md:text-5xl lg:text-6xl">
                Record your sets, reps, and weight
              </h2>
              <p>
                Every session logged builds your training history. The dashboard
                learns from what you do.
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-4 md:mt-8">
                <Button title="Start" variant="secondary">
                  Start
                </Button>
                <Button
                  title="View"
                  variant="link"
                  size="link"
                  iconRight={<RxChevronRight />}
                >
                  View
                </Button>
              </div>
            </div>
          </TabsContent>
          <TabsContent
            value="tab-5"
            className="data-[state=active]:animate-tabs"
          >
            <div className="flex h-full flex-col justify-center p-6 md:p-8 lg:p-16">
              <div className="rb-5 mb-5 md:mb-6">
                <img
                  src="https://d22po4pjz3o32e.cloudfront.net/relume-icon.svg"
                  className="size-12"
                  alt="Relume logo 5"
                />
              </div>
              <h2 className="rb-5 mb-5 text-4xl font-bold leading-[1.2] md:mb-6 md:text-5xl lg:text-6xl">
                Record your sets, reps, and weight
              </h2>
              <p>
                Every session logged builds your training history. The dashboard
                learns from what you do.
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-4 md:mt-8">
                <Button title="Start" variant="secondary">
                  Start
                </Button>
                <Button
                  title="View"
                  variant="link"
                  size="link"
                  iconRight={<RxChevronRight />}
                >
                  View
                </Button>
              </div>
            </div>
          </TabsContent>
          <TabsContent
            value="tab-6"
            className="data-[state=active]:animate-tabs"
          >
            <div className="flex h-full flex-col justify-center p-6 md:p-8 lg:p-16">
              <div className="rb-5 mb-5 md:mb-6">
                <img
                  src="https://d22po4pjz3o32e.cloudfront.net/relume-icon.svg"
                  className="size-12"
                  alt="Relume logo 6"
                />
              </div>
              <h2 className="rb-5 mb-5 text-4xl font-bold leading-[1.2] md:mb-6 md:text-5xl lg:text-6xl">
                Record your sets, reps, and weight
              </h2>
              <p>
                Every session logged builds your training history. The dashboard
                learns from what you do.
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-4 md:mt-8">
                <Button title="Start" variant="secondary">
                  Start
                </Button>
                <Button
                  title="View"
                  variant="link"
                  size="link"
                  iconRight={<RxChevronRight />}
                >
                  View
                </Button>
              </div>
            </div>
          </TabsContent>
          <TabsList className="relative grid h-full auto-cols-fr grid-cols-1 border-t border-border-primary md:border-l md:border-t-0">
            <TabsTrigger
              value="tab-1"
              className="items-start justify-start border-0 border-b border-border-primary px-6 py-6 text-xl font-bold last-of-type:border-0 data-[state=active]:bg-background-primary data-[state=active]:text-text-primary md:px-8 md:text-2xl"
            >
              Workout log
            </TabsTrigger>
            <TabsTrigger
              value="tab-2"
              className="items-start justify-start border-0 border-b border-border-primary px-6 py-6 text-xl font-bold last-of-type:border-0 data-[state=active]:bg-background-primary data-[state=active]:text-text-primary md:px-8 md:text-2xl"
            >
              Exercise database
            </TabsTrigger>
            <TabsTrigger
              value="tab-3"
              className="items-start justify-start border-0 border-b border-border-primary px-6 py-6 text-xl font-bold last-of-type:border-0 data-[state=active]:bg-background-primary data-[state=active]:text-text-primary md:px-8 md:text-2xl"
            >
              AI scheduler
            </TabsTrigger>
            <TabsTrigger
              value="tab-4"
              className="items-start justify-start border-0 border-b border-border-primary px-6 py-6 text-xl font-bold last-of-type:border-0 data-[state=active]:bg-background-primary data-[state=active]:text-text-primary md:px-8 md:text-2xl"
            >
              Progress tracking
            </TabsTrigger>
            <TabsTrigger
              value="tab-5"
              className="items-start justify-start border-0 border-b border-border-primary px-6 py-6 text-xl font-bold last-of-type:border-0 data-[state=active]:bg-background-primary data-[state=active]:text-text-primary md:px-8 md:text-2xl"
            >
              Profile settings
            </TabsTrigger>
            <TabsTrigger
              value="tab-6"
              className="items-start justify-start border-0 border-b border-border-primary px-6 py-6 text-xl font-bold last-of-type:border-0 data-[state=active]:bg-background-primary data-[state=active]:text-text-primary md:px-8 md:text-2xl"
            >
              Account
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
    </section>
  );
}

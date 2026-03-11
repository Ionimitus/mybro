"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Button,
} from "@relume_io/relume-ui";
import React from "react";
import { RxPlus } from "react-icons/rx";

export function Faq11() {
  return (
    <section id="relume" className="px-[5%] py-16 md:py-24 lg:py-28">
      <div className="container">
        <div className="mb-12 md:mb-18 lg:mb-20">
          <div className="mx-auto w-full max-w-lg text-center">
            <h2 className="rb-5 mb-5 text-5xl font-bold md:mb-6 md:text-7xl lg:text-8xl">
              FAQ
            </h2>
            <p className="md:text-md">
              Common questions about MyBro and how it works.
            </p>
          </div>
        </div>
        <Accordion
          type="multiple"
          className="grid w-full grid-cols-1 items-start gap-x-8 gap-y-4 md:grid-cols-2"
        >
          <AccordionItem
            value="item-faq11_accordion"
            className="border border-border-primary px-5 md:px-6"
          >
            <AccordionTrigger
              className="md:py-5 md:text-md [&[data-state=open]>svg]:rotate-45"
              icon={
                <RxPlus className="size-7 shrink-0 text-text-primary transition-transform duration-300 md:size-8" />
              }
            >
              Do I need a membership?
            </AccordionTrigger>
            <AccordionContent className="md:pb-6">
              Yes. MyBro is a member-only platform built for serious lifters.
              You'll need an account to access the workout log, exercise
              database, AI scheduler, and progress tracking.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem
            value="item-faq11_accordion-2"
            className="border border-border-primary px-5 md:px-6"
          >
            <AccordionTrigger
              className="md:py-5 md:text-md [&[data-state=open]>svg]:rotate-45"
              icon={
                <RxPlus className="size-7 shrink-0 text-text-primary transition-transform duration-300 md:size-8" />
              }
            >
              How does the AI scheduler work?
            </AccordionTrigger>
            <AccordionContent className="md:pb-6">
              The AI learns your schedule and goals, then suggests the best
              times for you to train. It adapts as your life changes, so
              training fits around what you're doing, not the other way around.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem
            value="item-faq11_accordion-3"
            className="border border-border-primary px-5 md:px-6"
          >
            <AccordionTrigger
              className="md:py-5 md:text-md [&[data-state=open]>svg]:rotate-45"
              icon={
                <RxPlus className="size-7 shrink-0 text-text-primary transition-transform duration-300 md:size-8" />
              }
            >
              Can I log past workouts?
            </AccordionTrigger>
            <AccordionContent className="md:pb-6">
              Absolutely. You can log workouts from any date. This helps you
              build a complete history of your training and lets the AI give you
              better recommendations based on your full record.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem
            value="item-faq11_accordion-4"
            className="border border-border-primary px-5 md:px-6"
          >
            <AccordionTrigger
              className="md:py-5 md:text-md [&[data-state=open]>svg]:rotate-45"
              icon={
                <RxPlus className="size-7 shrink-0 text-text-primary transition-transform duration-300 md:size-8" />
              }
            >
              What if I miss a workout?
            </AccordionTrigger>
            <AccordionContent className="md:pb-6">
              Life happens. The AI reschedules around missed sessions and keeps
              you on track without judgment. Your progress is what matters, and
              the system adapts to your reality.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem
            value="item-faq11_accordion-5"
            className="border border-border-primary px-5 md:px-6"
          >
            <AccordionTrigger
              className="md:py-5 md:text-md [&[data-state=open]>svg]:rotate-45"
              icon={
                <RxPlus className="size-7 shrink-0 text-text-primary transition-transform duration-300 md:size-8" />
              }
            >
              How many exercises are available?
            </AccordionTrigger>
            <AccordionContent className="md:pb-6">
              The database contains thousands of exercises covering every muscle
              group and movement pattern. You'll find everything from basic
              lifts to specialized variations.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem
            value="item-faq11_accordion-6"
            className="border border-border-primary px-5 md:px-6"
          >
            <AccordionTrigger
              className="md:py-5 md:text-md [&[data-state=open]>svg]:rotate-45"
              icon={
                <RxPlus className="size-7 shrink-0 text-text-primary transition-transform duration-300 md:size-8" />
              }
            >
              Will MyBro recommend muscle groups?
            </AccordionTrigger>
            <AccordionContent className="md:pb-6">
              Yes. The AI tracks which muscle groups you've trained and spots
              gaps in your programming. It pushes you to hit everything and
              build balanced strength.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem
            value="item-faq11_accordion-7"
            className="border border-border-primary px-5 md:px-6"
          >
            <AccordionTrigger
              className="md:py-5 md:text-md [&[data-state=open]>svg]:rotate-45"
              icon={
                <RxPlus className="size-7 shrink-0 text-text-primary transition-transform duration-300 md:size-8" />
              }
            >
              Can I see my progress over time?
            </AccordionTrigger>
            <AccordionContent className="md:pb-6">
              The dashboard shows your progress with clear analytics. You'll see
              strength gains, volume trends, and consistency patterns so you
              know exactly where you stand.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem
            value="item-faq11_accordion-8"
            className="border border-border-primary px-5 md:px-6"
          >
            <AccordionTrigger
              className="md:py-5 md:text-md [&[data-state=open]>svg]:rotate-45"
              icon={
                <RxPlus className="size-7 shrink-0 text-text-primary transition-transform duration-300 md:size-8" />
              }
            >
              Is my data private and secure?
            </AccordionTrigger>
            <AccordionContent className="md:pb-6">
              Your training data is yours alone. We take security seriously and
              never share your information with anyone. You control what you log
              and how it's used.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem
            value="item-faq11_accordion-9"
            className="border border-border-primary px-5 md:px-6"
          >
            <AccordionTrigger
              className="md:py-5 md:text-md [&[data-state=open]>svg]:rotate-45"
              icon={
                <RxPlus className="size-7 shrink-0 text-text-primary transition-transform duration-300 md:size-8" />
              }
            >
              Can I export my workout data?
            </AccordionTrigger>
            <AccordionContent className="md:pb-6">
              You can view and track all your workouts in the dashboard. The
              system keeps a complete record so you always have access to your
              training history.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem
            value="item-faq11_accordion-10"
            className="border border-border-primary px-5 md:px-6"
          >
            <AccordionTrigger
              className="md:py-5 md:text-md [&[data-state=open]>svg]:rotate-45"
              icon={
                <RxPlus className="size-7 shrink-0 text-text-primary transition-transform duration-300 md:size-8" />
              }
            >
              What if I have more questions?
            </AccordionTrigger>
            <AccordionContent className="md:pb-6">
              Reach out anytime. We're here to help you get the most out of
              MyBro and your training.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        <div className="mx-auto mt-12 max-w-md text-center md:mt-18 lg:mt-20">
          <h4 className="mb-3 text-2xl font-bold md:mb-4 md:text-3xl md:leading-[1.3] lg:text-4xl">
            Still have questions?
          </h4>
          <p className="md:text-md">We're ready to help you get started.</p>
          <div className="mt-6 md:mt-8">
            <Button title="Contact" variant="secondary">
              Contact
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

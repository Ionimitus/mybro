"use client";

import {
  Button,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  Input,
} from "@relume_io/relume-ui";
import Autoplay from "embla-carousel-autoplay";
import React, { useEffect, useState } from "react";
import {
  BiLogoApple,
  BiLogoFacebook,
  BiLogoGoogle,
  BiSolidStar,
} from "react-icons/bi";
import { useRouter } from "next/navigation";
import { supabase } from "../../../lib/supabase";

const useForm = (router) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSetEmail = (e) => {
    setEmail(e.target.value);
  };

  const handleSetPassword = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (!supabase) {
        setError(
          "Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local.",
        );
        return;
      }

      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (signUpError) {
        setError(signUpError.message);
        return;
      }

      router.push("/dashboard");
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return {
    email,
    handleSetEmail,
    password,
    handleSetPassword,
    handleSubmit,
    error,
    loading,
  };
};

const useCarousel = () => {
  const [api, setApi] = useState();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) {
      return;
    }
    setCurrent(api.selectedScrollSnap() + 1);
    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  const options = {
    loop: true,
  };

  const plugins = [
    Autoplay({
      delay: 5000,
    }),
  ];

  const handleDotClick = (index) => () => {
    if (api) {
      api.scrollTo(index);
    }
  };

  const dotClassName = (index) => {
    return `mx-[3px] size-2 rounded-full ${current === index + 1 ? "bg-black" : "bg-neutral-darker/40"}`;
  };

  return {
    options,
    plugins,
    api,
    setApi,
    handleDotClick,
    dotClassName,
  };
};

export function Signup6() {
  const carouselState = useCarousel();
  const router = useRouter();
  const formState = useForm(router);
  return (
    <section id="relume">
      <div className="relative grid min-h-screen grid-cols-1 justify-center overflow-auto lg:grid-cols-2">
        <div className="absolute left-0 right-0 top-0 z-10 flex h-16 items-center justify-center px-[5%] md:h-18 lg:justify-start">
          <a href="#">
            <span className="text-2xl font-black tracking-tight text-white">MyBro</span>
          </a>
        </div>
        <div className="relative mx-[5vw] flex items-center justify-center pb-16 pt-20 md:pb-20 md:pt-24 lg:py-20">
          <div className="mx-auto w-full max-w-sm">
            <div className="mx-auto mb-8 w-full max-w-lg text-center md:mb-10 lg:mb-12">
              <h1 className="mb-5 text-5xl font-bold md:mb-6 md:text-7xl lg:text-8xl">
                Join MyBro
              </h1>
              <p className="md:text-md">
                Create your account and start tracking your progress today
              </p>
            </div>
            <form
              className="grid grid-cols-1 gap-4"
              onSubmit={formState.handleSubmit}
            >
              <Input
                type="email"
                id="email"
                placeholder="Email"
                required={true}
                value={formState.email}
                onChange={formState.handleSetEmail}
              />
              <Input
                type="password"
                id="password"
                placeholder="Password"
                required={true}
                value={formState.password}
                onChange={formState.handleSetPassword}
              />
              {formState.error && (
                <p className="text-sm text-red-600">{formState.error}</p>
              )}
              <Button title="Register" disabled={formState.loading}>
                {formState.loading ? "Registering..." : "Register"}
              </Button>
              <div className="my-3 h-px w-full bg-border-primary md:my-4" />
              <Button
                variant="secondary"
                title="Next"
                iconLeft={<BiLogoGoogle className="size-6" />}
                className="gap-x-3"
              >
                Next
              </Button>
              <Button
                variant="secondary"
                title="Tell us about your goals"
                iconLeft={<BiLogoFacebook className="size-6" />}
                className="gap-x-3"
              >
                Tell us about your goals
              </Button>
              <Button
                variant="secondary"
                title="What do you want to achieve with your training?"
                iconLeft={<BiLogoApple className="size-6" />}
                className="gap-x-3"
              >
                What do you want to achieve with your training?
              </Button>
            </form>
            <div className="mt-5 inline-flex w-full items-center justify-center gap-x-1 text-center md:mt-6">
              <p>First name</p>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center bg-background-secondary px-[5vw] pb-20 pt-16 md:py-20">
          <Carousel
            setApi={carouselState.setApi}
            opts={carouselState.options}
            plugins={carouselState.plugins}
            className="overflow-hidden"
          >
            <div className="relative">
              <CarouselContent className="pb-7">
                <CarouselItem className="max-w-full">
                  <div className="mx-auto flex h-full max-w-lg flex-col items-center justify-center text-center">
                    <div className="flex">
                      <BiSolidStar className="size-6" />
                      <BiSolidStar className="size-6" />
                      <BiSolidStar className="size-6" />
                      <BiSolidStar className="size-6" />
                      <BiSolidStar className="size-6" />
                    </div>
                    <blockquote className="my-6 text-xl font-bold md:my-8 md:text-2xl">
                      "It always seems impossible until it's done."
                    </blockquote>
                    <div className="flex w-full flex-col items-center text-center md:w-auto md:flex-row md:text-left">
                      <div className="rb-4 mb-4 md:mb-0 md:mr-5">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-700 text-xs font-bold">MB</div>
                      </div>
                      <div className="rb-4 mb-4 md:mb-0">
                        <p className="font-semibold">Register</p>
                        <p>Already have an account?</p>
                      </div>
                      <div className="mx-5 hidden w-px self-stretch bg-black md:block" />
                      <div>
                        <span className="text-xs font-bold text-zinc-400">★</span>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
                <CarouselItem className="max-w-full">
                  <div className="mx-auto flex h-full max-w-lg flex-col items-center justify-center text-center">
                    <div className="flex">
                      <BiSolidStar className="size-6" />
                      <BiSolidStar className="size-6" />
                      <BiSolidStar className="size-6" />
                      <BiSolidStar className="size-6" />
                      <BiSolidStar className="size-6" />
                    </div>
                    <blockquote className="my-6 text-xl font-bold md:my-8 md:text-2xl">
                      "It always seems impossible until it's done."
                    </blockquote>
                    <div className="flex w-full flex-col items-center text-center md:w-auto md:flex-row md:text-left">
                      <div className="rb-4 mb-4 md:mb-0 md:mr-5">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-700 text-xs font-bold">MB</div>
                      </div>
                      <div className="rb-4 mb-4 md:mb-0">
                        <p className="font-semibold">Register</p>
                        <p>Already have an account?</p>
                      </div>
                      <div className="mx-5 hidden w-px self-stretch bg-black md:block" />
                      <div>
                        <span className="text-xs font-bold text-zinc-400">★</span>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
                <CarouselItem className="max-w-full">
                  <div className="mx-auto flex h-full max-w-lg flex-col items-center justify-center text-center">
                    <div className="flex">
                      <BiSolidStar className="size-6" />
                      <BiSolidStar className="size-6" />
                      <BiSolidStar className="size-6" />
                      <BiSolidStar className="size-6" />
                      <BiSolidStar className="size-6" />
                    </div>
                    <blockquote className="my-6 text-xl font-bold md:my-8 md:text-2xl">
                      "It always seems impossible until it's done."
                    </blockquote>
                    <div className="flex w-full flex-col items-center text-center md:w-auto md:flex-row md:text-left">
                      <div className="rb-4 mb-4 md:mb-0 md:mr-5">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-700 text-xs font-bold">MB</div>
                      </div>
                      <div className="rb-4 mb-4 md:mb-0">
                        <p className="font-semibold">Register</p>
                        <p>Already have an account?</p>
                      </div>
                      <div className="mx-5 hidden w-px self-stretch bg-black md:block" />
                      <div>
                        <span className="text-xs font-bold text-zinc-400">★</span>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              </CarouselContent>
              <div className="flex w-full items-center justify-center gap-12">
                <CarouselPrevious
                  className="static hidden -translate-y-0 bg-transparent md:flex"
                  variant="link"
                />
                <div className="flex items-center justify-center">
                  <button
                    onClick={carouselState.handleDotClick(0)}
                    className={carouselState.dotClassName(0)}
                  />
                  <button
                    onClick={carouselState.handleDotClick(1)}
                    className={carouselState.dotClassName(1)}
                  />
                  <button
                    onClick={carouselState.handleDotClick(2)}
                    className={carouselState.dotClassName(2)}
                  />
                </div>
                <CarouselNext
                  className="static hidden -translate-y-0 bg-transparent md:flex"
                  variant="link"
                />
              </div>
            </div>
          </Carousel>
        </div>
        <footer className="absolute bottom-0 left-0 right-0 flex h-16 items-center justify-center px-[5%] md:h-18 lg:justify-start">
          <p className="text-sm">© 2024 MyBro</p>
        </footer>
      </div>
    </section>
  );
}

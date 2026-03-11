"use client";

import { useMediaQuery } from "@relume_io/relume-ui";
import { AnimatePresence, motion } from "framer-motion";
import React, { useState } from "react";
import { RxChevronDown } from "react-icons/rx";
import Link from "next/link";

function AuthNavbarActions() {
  const [user, setUser] = React.useState(null);
  React.useEffect(() => {
    import("../../../lib/supabase").then(({ supabase }) => {
      supabase.auth.getSession().then(({ data: { session } }) => setUser(session?.user ?? null));
      const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => setUser(s?.user ?? null));
      return () => subscription.unsubscribe();
    });
  }, []);
  const handleLogout = async () => {
    const { supabase } = await import("../../../lib/supabase");
    await supabase.auth.signOut();
    window.location.href = "/home";
  };
  if (user) return (
    <div className="flex items-center gap-3">
      <Link href="/dashboard" className="border border-zinc-700 px-4 py-2 text-sm font-bold text-white hover:border-white transition-colors">Dashboard</Link>
      <button onClick={handleLogout} className="border border-white bg-white px-4 py-2 text-sm font-bold text-black hover:bg-zinc-200 transition-colors">Log Out</button>
    </div>
  );
  return (
    <div className="flex items-center gap-3">
      <Link href="/login" className="border border-zinc-700 px-4 py-2 text-sm font-bold text-white hover:border-white transition-colors">Log In</Link>
      <Link href="/register" className="border border-white bg-white px-4 py-2 text-sm font-bold text-black hover:bg-zinc-200 transition-colors">Sign Up</Link>
    </div>
  );
}


const useRelume = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width: 991px)");
  const toggleMobileMenu = () => setIsMobileMenuOpen((prev) => !prev);
  const openOnMobileDropdownMenu = () => {
    setIsDropdownOpen((prev) => !prev);
  };
  const openOnDesktopDropdownMenu = () => {
    !isMobile && setIsDropdownOpen(true);
  };
  const closeOnDesktopDropdownMenu = () => {
    !isMobile && setIsDropdownOpen(false);
  };
  const animateMobileMenu = isMobileMenuOpen ? "open" : "close";
  const animateMobileMenuButtonSpan = isMobileMenuOpen
    ? ["open", "rotatePhase"]
    : "closed";
  const animateDropdownMenu = isDropdownOpen ? "open" : "close";
  const animateDropdownMenuIcon = isDropdownOpen ? "rotated" : "initial";
  return {
    toggleMobileMenu,
    openOnDesktopDropdownMenu,
    closeOnDesktopDropdownMenu,
    openOnMobileDropdownMenu,
    animateMobileMenu,
    animateMobileMenuButtonSpan,
    animateDropdownMenu,
    animateDropdownMenuIcon,
  };
};

export function Navbar1() {
  const useActive = useRelume();
  return (
    <section
      id="relume"
      className="flex w-full items-center border-b border-border-primary bg-background-primary lg:min-h-18 lg:px-[5%]"
    >
      <div className="size-full lg:flex lg:items-center lg:justify-between">
        <div className="flex min-h-16 items-center justify-between px-[5%] md:min-h-18 lg:min-h-full lg:px-0">
          <a href="/home" className="text-xl font-black tracking-tight text-white">
              MyBro
            </a>
          <button
            className="-mr-2 flex size-12 flex-col items-center justify-center lg:hidden"
            onClick={useActive.toggleMobileMenu}
          >
            <motion.span
              className="my-[3px] h-0.5 w-6 bg-black"
              animate={useActive.animateMobileMenuButtonSpan}
              variants={{
                open: { translateY: 8, transition: { delay: 0.1 } },
                rotatePhase: { rotate: -45, transition: { delay: 0.2 } },
                closed: {
                  translateY: 0,
                  rotate: 0,
                  transition: { duration: 0.2 },
                },
              }}
            />
            <motion.span
              className="my-[3px] h-0.5 w-6 bg-black"
              animate={useActive.animateMobileMenu}
              variants={{
                open: { width: 0, transition: { duration: 0.1 } },
                closed: {
                  width: "1.5rem",
                  transition: { delay: 0.3, duration: 0.2 },
                },
              }}
            />
            <motion.span
              className="my-[3px] h-0.5 w-6 bg-black"
              animate={useActive.animateMobileMenuButtonSpan}
              variants={{
                open: { translateY: -8, transition: { delay: 0.1 } },
                rotatePhase: { rotate: 45, transition: { delay: 0.2 } },
                closed: {
                  translateY: 0,
                  rotate: 0,
                  transition: { duration: 0.2 },
                },
              }}
            />
          </button>
        </div>
        <motion.div
          variants={{
            open: { height: "var(--height-open, 100dvh)" },
            close: { height: "var(--height-closed, 0)" },
          }}
          initial="close"
          exit="close"
          animate={useActive.animateMobileMenu}
          transition={{ duration: 0.4 }}
          className="overflow-hidden px-[5%] lg:flex lg:items-center lg:px-0 lg:[--height-closed:auto] lg:[--height-open:auto]"
        >
          <a
            href="/home#about"
            className="block py-3 text-md first:pt-7 lg:px-4 lg:py-2 lg:text-base first:lg:pt-2"
          >
            About
          </a>
          <a
            href="/home#features"
            className="block py-3 text-md first:pt-7 lg:px-4 lg:py-2 lg:text-base first:lg:pt-2"
          >
            Services
          </a>
          <a
            href="/home#contact"
            className="block py-3 text-md first:pt-7 lg:px-4 lg:py-2 lg:text-base first:lg:pt-2"
          >
            Contact
          </a>
          <div
            onMouseEnter={useActive.openOnDesktopDropdownMenu}
            onMouseLeave={useActive.closeOnDesktopDropdownMenu}
          >
            <button
              className="flex w-full items-center justify-between gap-2 py-3 text-left text-md lg:flex-none lg:justify-start lg:px-4 lg:py-2 lg:text-base"
              onClick={useActive.openOnMobileDropdownMenu}
            >
              <span>Member</span>
              <motion.span
                variants={{ rotated: { rotate: 180 }, initial: { rotate: 0 } }}
                animate={useActive.animateDropdownMenuIcon}
                transition={{ duration: 0.3 }}
              >
                <RxChevronDown />
              </motion.span>
            </button>
            <AnimatePresence>
              <motion.nav
                variants={{
                  open: {
                    visibility: "visible",
                    opacity: "var(--opacity-open, 100%)",
                    display: "block",
                    y: 0,
                  },
                  close: {
                    visibility: "hidden",
                    opacity: "var(--opacity-close, 0)",
                    display: "none",
                    y: "var(--y-close, 0%)",
                  },
                }}
                animate={useActive.animateDropdownMenu}
                initial="close"
                exit="close"
                transition={{ duration: 0.2 }}
                className="bg-background-primary lg:absolute lg:z-50 lg:border lg:border-border-primary lg:p-2 lg:[--y-close:25%]"
              >
                <Link
                  href="/profile"
                  className="block py-3 pl-[5%] text-md lg:px-4 lg:py-2 lg:text-base"
                >
                  Profile
                </Link>
                <Link
                  href="/dashboard"
                  className="block py-3 pl-[5%] text-md lg:px-4 lg:py-2 lg:text-base"
                >
                  Dashboard
                </Link>
                <Link
                  href="/schedule"
                  className="block py-3 pl-[5%] text-md lg:px-4 lg:py-2 lg:text-base"
                >
                  Schedule
                </Link>
                <Link
                  href="/exercise-db"
                  className="block py-3 pl-[5%] text-md lg:px-4 lg:py-2 lg:text-base"
                >
                  Exercise Database
                </Link>
                <Link
                  href="/workout-log"
                  className="block py-3 pl-[5%] text-md lg:px-4 lg:py-2 lg:text-base"
                >
                  Workout Logs
                </Link>
              </motion.nav>
            </AnimatePresence>
          </div>
          <AuthNavbarActions />
        </motion.div>
      </div>
    </section>
  );
}
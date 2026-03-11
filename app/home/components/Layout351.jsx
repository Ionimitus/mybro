"use client";

import { useMediaQuery } from "@relume_io/relume-ui";
import { motion } from "framer-motion";
import React, { useState } from "react";

const useRelume = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const isMobile = useMediaQuery("(max-width: 991px)");
  const CardContent = isMobile ? motion.div : "div";
  const animateWidth = (index) => {
    return isMobile ? "100%" : index === activeIndex ? "100%" : "5rem";
  };
  const animateHeight = (index) => {
    return index === activeIndex ? "auto" : "0px";
  };
  const handleSetIsActive = (index) => () => {
    setActiveIndex((prevIndex) => {
      if (
        prevIndex === index &&
        features.filter((_, i) => i === prevIndex).length === 1
      ) {
        return prevIndex;
      }
      return prevIndex === index ? null : index;
    });
  };
  return {
    handleSetIsActive,
    CardContent,
    animateWidth,
    animateHeight,
  };
};

export function Layout351() {
  const useSctoll = useRelume({
    features: [
      {
        columnText: "01",
        verticalText: "Feature one",
        horizontalText: "Feature one",
        heading: "Short heading goes here",
        description:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla, ut commodo diam libero vitae erat.",
        image: {
          src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image-landscape.svg",
          alt: "Relume placeholder image 1",
        },
      },
      {
        columnText: "02",
        verticalText: "Feature two",
        horizontalText: "Feature two",
        heading: "Short heading goes here",
        description:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla, ut commodo diam libero vitae erat.",
        image: {
          src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image-landscape.svg",
          alt: "Relume placeholder image 2",
        },
      },
      {
        columnText: "03",
        verticalText: "Feature three",
        horizontalText: "Feature three",
        heading: "Short heading goes here",
        description:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla, ut commodo diam libero vitae erat.",
        image: {
          src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image-landscape.svg",
          alt: "Relume placeholder image 3",
        },
      },
      {
        columnText: "04",
        verticalText: "Feature four",
        horizontalText: "Feature four",
        heading: "Short heading goes here",
        description:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla, ut commodo diam libero vitae erat.",
        image: {
          src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image-landscape.svg",
          alt: "Relume placeholder image 4",
        },
      },
    ],
  });
  return (
    <section id="relume" className="px-[5%] py-16 md:py-24 lg:py-28">
      <div className="container">
        <div className="rb-12 mb-12 w-full max-w-lg md:mb-18 lg:mb-20">
          <p className="mb-3 font-semibold md:mb-4">Track</p>
          <h1 className="mb-5 text-5xl font-bold md:mb-6 md:text-7xl lg:text-8xl">
            Record every set and rep you lift
          </h1>
          <p className="md:text-md">01</p>
        </div>
        <div className="flex w-full flex-col overflow-hidden border-b border-l border-r border-border-primary lg:h-[90vh] lg:flex-row lg:border-r-0 lg:border-t">
          <motion.div
            className="flex flex-col justify-start overflow-hidden lg:h-[90vh] lg:min-w-20 lg:flex-row lg:border-r lg:border-border-primary"
            onClick={useSctoll.handleSetIsActive(0)}
            initial={false}
            animate={{ width: useSctoll.animateWidth(0) }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div className="relative flex h-16 w-full min-w-full cursor-pointer items-center justify-center border-t border-border-primary py-8 md:h-20 lg:h-[90vh] lg:w-20 lg:min-w-20 lg:flex-col lg:justify-between lg:border-none">
              <p className="absolute left-6 whitespace-nowrap text-xl font-bold md:left-10 md:text-2xl lg:relative lg:left-0">
                01
              </p>
              <h2 className="hidden [writing-mode:vertical-rl] lg:mx-auto lg:block lg:rotate-180 lg:text-2xl lg:font-bold">
                Log it all
              </h2>
              <p className="text-xl font-bold md:text-2xl lg:hidden">
                Log it all
              </p>
            </div>
            <useSctoll.CardContent
              className="w-full overflow-hidden lg:h-full lg:w-auto lg:min-w-[200vw] lg:overflow-auto"
              animate={{ height: useSctoll.animateHeight(0) }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <div className="flex h-full flex-col px-6 pb-8 pt-4 md:px-10 md:pb-12 md:pt-12 lg:w-[40rem] lg:px-12 lg:pb-16 lg:pt-16">
                <h3 className="mb-5 text-4xl font-bold leading-[1.2] md:mb-6 md:text-5xl lg:text-6xl">
                  See what you've built
                </h3>
                <p className="md:text-md">Exercise database</p>
                <div className="rt-8 mt-8 h-80 md:mt-10 md:h-[25rem] lg:mt-12">
                  <img
                    src="https://d22po4pjz3o32e.cloudfront.net/placeholder-image-landscape.svg"
                    alt="Relume placeholder image 1"
                    className="size-full object-cover"
                  />
                </div>
              </div>
            </useSctoll.CardContent>
          </motion.div>
          <motion.div
            className="flex flex-col justify-start overflow-hidden lg:h-[90vh] lg:min-w-20 lg:flex-row lg:border-r lg:border-border-primary"
            onClick={useSctoll.handleSetIsActive(1)}
            initial={false}
            animate={{ width: useSctoll.animateWidth(1) }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div className="relative flex h-16 w-full min-w-full cursor-pointer items-center justify-center border-t border-border-primary py-8 md:h-20 lg:h-[90vh] lg:w-20 lg:min-w-20 lg:flex-col lg:justify-between lg:border-none">
              <p className="absolute left-6 whitespace-nowrap text-xl font-bold md:left-10 md:text-2xl lg:relative lg:left-0">
                02
              </p>
              <h2 className="hidden [writing-mode:vertical-rl] lg:mx-auto lg:block lg:rotate-180 lg:text-2xl lg:font-bold">
                Find your movement
              </h2>
              <p className="text-xl font-bold md:text-2xl lg:hidden">
                Find your movement
              </p>
            </div>
            <useSctoll.CardContent
              className="w-full overflow-hidden lg:h-full lg:w-auto lg:min-w-[200vw] lg:overflow-auto"
              animate={{ height: useSctoll.animateHeight(1) }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <div className="flex h-full flex-col px-6 pb-8 pt-4 md:px-10 md:pb-12 md:pt-12 lg:w-[40rem] lg:px-12 lg:pb-16 lg:pt-16">
                <h3 className="mb-5 text-4xl font-bold leading-[1.2] md:mb-6 md:text-5xl lg:text-6xl">
                  See what you've built
                </h3>
                <p className="md:text-md">Exercise database</p>
                <div className="rt-8 mt-8 h-80 md:mt-10 md:h-[25rem] lg:mt-12">
                  <img
                    src="https://d22po4pjz3o32e.cloudfront.net/placeholder-image-landscape.svg"
                    alt="Relume placeholder image 2"
                    className="size-full object-cover"
                  />
                </div>
              </div>
            </useSctoll.CardContent>
          </motion.div>
          <motion.div
            className="flex flex-col justify-start overflow-hidden lg:h-[90vh] lg:min-w-20 lg:flex-row lg:border-r lg:border-border-primary"
            onClick={useSctoll.handleSetIsActive(2)}
            initial={false}
            animate={{ width: useSctoll.animateWidth(2) }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div className="relative flex h-16 w-full min-w-full cursor-pointer items-center justify-center border-t border-border-primary py-8 md:h-20 lg:h-[90vh] lg:w-20 lg:min-w-20 lg:flex-col lg:justify-between lg:border-none">
              <p className="absolute left-6 whitespace-nowrap text-xl font-bold md:left-10 md:text-2xl lg:relative lg:left-0">
                03
              </p>
              <h2 className="hidden [writing-mode:vertical-rl] lg:mx-auto lg:block lg:rotate-180 lg:text-2xl lg:font-bold">
                AI scheduler
              </h2>
              <p className="text-xl font-bold md:text-2xl lg:hidden">
                AI scheduler
              </p>
            </div>
            <useSctoll.CardContent
              className="w-full overflow-hidden lg:h-full lg:w-auto lg:min-w-[200vw] lg:overflow-auto"
              animate={{ height: useSctoll.animateHeight(2) }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <div className="flex h-full flex-col px-6 pb-8 pt-4 md:px-10 md:pb-12 md:pt-12 lg:w-[40rem] lg:px-12 lg:pb-16 lg:pt-16">
                <h3 className="mb-5 text-4xl font-bold leading-[1.2] md:mb-6 md:text-5xl lg:text-6xl">
                  See what you've built
                </h3>
                <p className="md:text-md">Exercise database</p>
                <div className="rt-8 mt-8 h-80 md:mt-10 md:h-[25rem] lg:mt-12">
                  <img
                    src="https://d22po4pjz3o32e.cloudfront.net/placeholder-image-landscape.svg"
                    alt="Relume placeholder image 3"
                    className="size-full object-cover"
                  />
                </div>
              </div>
            </useSctoll.CardContent>
          </motion.div>
          <motion.div
            className="flex flex-col justify-start overflow-hidden lg:h-[90vh] lg:min-w-20 lg:flex-row lg:border-r lg:border-border-primary"
            onClick={useSctoll.handleSetIsActive(3)}
            initial={false}
            animate={{ width: useSctoll.animateWidth(3) }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div className="relative flex h-16 w-full min-w-full cursor-pointer items-center justify-center border-t border-border-primary py-8 md:h-20 lg:h-[90vh] lg:w-20 lg:min-w-20 lg:flex-col lg:justify-between lg:border-none">
              <p className="absolute left-6 whitespace-nowrap text-xl font-bold md:left-10 md:text-2xl lg:relative lg:left-0">
                04
              </p>
              <h2 className="hidden [writing-mode:vertical-rl] lg:mx-auto lg:block lg:rotate-180 lg:text-2xl lg:font-bold">
                Progress dashboard
              </h2>
              <p className="text-xl font-bold md:text-2xl lg:hidden">
                Progress dashboard
              </p>
            </div>
            <useSctoll.CardContent
              className="w-full overflow-hidden lg:h-full lg:w-auto lg:min-w-[200vw] lg:overflow-auto"
              animate={{ height: useSctoll.animateHeight(3) }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <div className="flex h-full flex-col px-6 pb-8 pt-4 md:px-10 md:pb-12 md:pt-12 lg:w-[40rem] lg:px-12 lg:pb-16 lg:pt-16">
                <h3 className="mb-5 text-4xl font-bold leading-[1.2] md:mb-6 md:text-5xl lg:text-6xl">
                  See what you've built
                </h3>
                <p className="md:text-md">Exercise database</p>
                <div className="rt-8 mt-8 h-80 md:mt-10 md:h-[25rem] lg:mt-12">
                  <img
                    src="https://d22po4pjz3o32e.cloudfront.net/placeholder-image-landscape.svg"
                    alt="Relume placeholder image 4"
                    className="size-full object-cover"
                  />
                </div>
              </div>
            </useSctoll.CardContent>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

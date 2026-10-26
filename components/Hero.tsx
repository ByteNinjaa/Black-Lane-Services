"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";

const ease = [0.16, 1, 0.3, 1] as const;

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", reduce ? "0%" : "14%"]);
  const scale = useTransform(scrollYProgress, [0, 1], [1.06, reduce ? 1.06 : 1.14]);

  const enter = (delay: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 22 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 1.1, delay, ease },
        };

  return (
    <section
      ref={ref}
      aria-labelledby="hero-title"
      className="on-photo relative isolate flex min-h-[100dvh] items-end overflow-hidden bg-canvas lg:items-start"
    >
      <motion.div className="absolute inset-0 -z-10 will-change-transform" style={{ y, scale }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/hero.jpg"
          alt="A bride and groom beside a white stretch limousine at dusk"
          width={2400}
          height={1600}
          fetchPriority="high"
          className="grade h-full w-full object-cover object-[60%_60%]"
        />
      </motion.div>
      {/* Functional scrim so type keeps AA contrast over any part of the photo */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,rgb(6_6_6/0.9)_0%,rgb(6_6_6/0.7)_28%,rgb(6_6_6/0.15)_55%,transparent_70%),linear-gradient(to_bottom,rgb(6_6_6/0.8)_0%,rgb(6_6_6/0.3)_16%,transparent_30%,transparent_78%,rgb(6_6_6/0.7)_100%)]"
      />

      {/* Phones: text sits low, over a stronger bottom fade */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[linear-gradient(to_top,rgb(6_6_6/0.95)_0%,rgb(6_6_6/0.8)_38%,rgb(6_6_6/0.2)_68%,transparent_85%)] lg:hidden"
      />

      <div className="wrap pb-[clamp(3.5rem,9vh,6.5rem)] pt-32 lg:pb-0 lg:pt-[17vh]">
        <div className="max-w-[46rem]">
          <motion.h1
            id="hero-title"
            className="t-display text-[clamp(2.4rem,4.6vw,4rem)] leading-[1.06] tracking-[-0.01em]"
            {...enter(0.15)}
          >
            Private limousines for
            <br />
            New York’s finest nights
          </motion.h1>
          {/* Three facts a customer actually needs before booking */}
          <motion.ul
            className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-[1.0625rem] text-body-strong"
            {...enter(0.25)}
          >
            <li>Uniformed chauffeurs</li>
            <li aria-hidden="true" className="hidden h-4 w-px bg-ink/30 sm:block" />
            <li>Immaculate late-model fleet</li>
            <li aria-hidden="true" className="hidden h-4 w-px bg-ink/30 sm:block" />
            <li>All-inclusive quotes</li>
          </motion.ul>
          <motion.div className="mt-9 flex flex-wrap items-center gap-4" {...enter(0.35)}>
            <a href="#reserve" className="btn">
              Reserve
            </a>
            <a href="#fleet" className="btn btn-quiet">
              View the fleet
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

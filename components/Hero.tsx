// components/Hero.tsx
"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import "./hero.css";

/* ── Live New York time ─────────────── */
function useNyTime() {
  const [time, setTime] = useState<string>("");

  useEffect(() => {
    const formatter = new Intl.DateTimeFormat("en-GB", {
      timeZone: "America/New_York",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });

    const updateTime = () => setTime(formatter.format(new Date()));
    updateTime(); // Set initial time on mount to avoid SSR mismatch

    const intervalId = window.setInterval(updateTime, 1000);
    return () => window.clearInterval(intervalId);
  }, []);

  return time;
}

export function Hero() {
  const shouldReduceMotion = useReducedMotion();
  const time = useNyTime();

  const fadeInAnimation = {
    initial: shouldReduceMotion ? false : { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { 
      duration: 1, 
      ease: [0.16, 1, 0.3, 1] as const // <-- Fixes the TypeScript tuple type mismatch
    },
  };

  return (
    <section
      aria-labelledby="hero-title"
      className="hero-vip relative isolate grid min-h-[100svh] overflow-hidden bg-[#060606] lg:min-h-[100dvh] lg:grid-cols-[minmax(0,1fr)_minmax(0,1.18fr)]"
    >
      {/* ── ATMOSPHERE BACKGROUND ── */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0">
        <div className="hero-aurora-a absolute -left-[12%] -top-[15%] h-[55vw] w-[55vw] rounded-full blur-[90px]" />
        <div className="hero-aurora-b absolute -bottom-[25%] left-[30%] h-[50vw] w-[50vw] rounded-full blur-[100px]" />
        <div className="absolute bottom-0 top-0 hidden w-px bg-gradient-to-b from-transparent via-[#D4AF78]/10 to-transparent lg:left-[45.87%] lg:block" />
      </div>

      {/* ── MOBILE BACKGROUND IMAGE ── */}
      <div aria-hidden="true" className="absolute inset-0 z-0 lg:hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/hero1.jpg"
          alt=""
          className="h-full w-full object-cover brightness-[0.62] contrast-110 saturate-[0.85]"
        />
        <div
          className="absolute inset-0 bg-[linear-gradient(0deg,#060606_8%,rgba(6,6,6,0.55)_45%,rgba(6,6,6,0.25)_75%,rgba(6,6,6,0.6)_100%)]"
        />
      </div>

      {/* ── LEFT: Content ─────────────────────────────────────── */}
      <motion.div
        {...fadeInAnimation}
        className="relative z-10 flex min-h-[100svh] flex-col justify-end px-6 pb-36 pt-36 lg:min-h-[100dvh] lg:justify-center lg:px-[clamp(2rem,5vw,6rem)] lg:pb-40 lg:pt-28"
      >
        <div>
          {/* Gold eyebrow */}
          <div className="flex items-center gap-4">
            <span className="h-px w-12 bg-gradient-to-r from-[#D4AF78] to-[#D4AF78]/20" />
            <span className="text-[0.72rem] uppercase tracking-[0.34em] text-[#D4AF78]">
              Your VIP Experience Awaits
            </span>
          </div>

          {/* Headline */}
          <h1
            id="hero-title"
            className="hero-serif relative z-20 mt-9 text-[clamp(2.25rem,8vw,4rem)] font-light leading-[0.98] tracking-[-0.015em] text-[#F5F3EE] lg:whitespace-nowrap lg:text-[clamp(3rem,6.5vw,7.5rem)]"
          >
            <span className="block">Private limousines</span>
            <span className="block">for New York&rsquo;s</span>
            <span className="block">
              <em className="hero-gold-text pr-[0.04em] font-normal italic">finest</em> nights.
            </span>
          </h1>

          {/* Subhead */}
          <p className="mt-8 max-w-[27rem] text-[1.0625rem] leading-[1.8] text-[#F5F3EE]/70">
            Uniformed chauffeurs. Immaculate late-model fleet. All-inclusive quotes — for the city&rsquo;s most discerning travellers.
          </p>

          {/* CTAs */}
          <div className="mt-12 flex flex-wrap items-center gap-6">
            <a href="#reserve" className="btn btn-primary">
              Reserve
            </a>
            
            <a href="#fleet" className="btn btn-quiet group inline-flex items-center gap-2">
              View the fleet
              <svg
                aria-hidden="true"
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                className="transition-transform duration-500 group-hover:translate-x-1"
              >
                <path d="M1 7h11M8.5 3.5 12 7l-3.5 3.5" stroke="currentColor" strokeWidth="1.2" />
              </svg>
            </a>
          </div>
        </div>
      </motion.div>

      {/* ── RIGHT: Architectural composition (Desktop) ── */}
      <div className="relative hidden lg:block">
        <div className="absolute inset-0 bottom-[6rem] right-[3.5rem] overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/hero1.jpg"
            alt="A bride and groom beside a white stretch limousine at dusk"
            className="h-full w-full object-cover brightness-[0.82] contrast-110 saturate-[0.85]"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[linear-gradient(90deg,rgba(6,6,6,0.8)_0%,rgba(6,6,6,0.25)_30%,transparent_55%),linear-gradient(0deg,rgba(6,6,6,0.85)_0%,rgba(6,6,6,0.2)_26%,transparent_45%),linear-gradient(180deg,rgba(6,6,6,0.5)_0%,transparent_18%)]"
          />
        </div>

        {/* Framing border accents */}
        <div className="pointer-events-none absolute inset-y-[3.25rem] left-[-3.25rem] right-[6.25rem] z-[5] border border-[#D4AF78]/30">
          <span className="absolute -left-px -top-px h-9 w-9 border-l border-t border-[#D4AF78]" />
          <span className="absolute -bottom-px -right-px h-9 w-9 border-b border-r border-[#D4AF78]" />
        </div>

        {/* Vertical plate label */}
        <div className="absolute right-[1.1rem] top-1/2 z-30 flex -translate-y-1/2 flex-col items-center gap-4">
          <span aria-hidden="true" className="h-10 w-px bg-[#D4AF78]/30" />
          <span className="text-[0.62rem] uppercase tracking-[0.34em] text-[#D4AF78]/70 [writing-mode:vertical-rl]">
            Nº 01 — The Fleet
          </span>
          <span aria-hidden="true" className="h-10 w-px bg-[#D4AF78]/30" />
        </div>
      </div>

      {/* ── BOTTOM STRIP: provenance & clock ── */}
      <div className="absolute inset-x-0 bottom-0 z-30 border-t border-[#D4AF78]/10 bg-[#060606]/55 backdrop-blur-sm">
        <div className="flex flex-col gap-3 px-6 py-5 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-x-8 lg:px-[clamp(2rem,5vw,6rem)]">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[0.62rem] uppercase tracking-[0.28em] text-[#F5F3EE]/55">
            <span>Tri State Area</span>
            <span aria-hidden="true" className="h-3 w-px bg-[#D4AF78]/40" />
            <span>VIP Service</span>
            <span aria-hidden="true" className="h-3 w-px bg-[#D4AF78]/40" />
            <span>24/7 Concierge</span>
          </div>

          <div role="timer" aria-live="off" className="flex items-center gap-3">
            <span aria-hidden="true" className="hero-pulse h-1.5 w-1.5 rounded-full bg-[#8FBF8A]" />
            <span className="text-[0.6rem] uppercase tracking-[0.3em] text-[#F5F3EE]/55">
              NYC
            </span>
            <span className="text-[0.72rem] tracking-[0.22em] text-[#D4AF78] tabular-nums">
              {time || "––:––:––"}
            </span>
          </div>
        </div>
      </div>

      {/* ── FILM GRAIN ── */}
      <div aria-hidden="true" className="hero-grain pointer-events-none absolute inset-0 z-[60] opacity-[0.06] mix-blend-overlay" />
    </section>
  );
}
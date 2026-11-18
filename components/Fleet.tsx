// components/Fleet.tsx
"use client";

import { useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import { ArrowRight } from "@phosphor-icons/react";
import { fleet, type VehicleId } from "@/lib/data";
import { selectVehicle } from "@/lib/events";
import { Reveal } from "./Reveal";
import "./fleet.css";

const EASE_CUSTOM = [0.16, 1, 0.3, 1] as const;

const OCCASIONS = [
  "Weddings",
  "Black-Tie Evenings",
  "Airport Transfers",
  "Corporate Travel",
  "Proms & Formals",
  "City Tours",
] as const;

export function Fleet() {
  const [active, setActive] = useState<VehicleId>("escalade");
  const shouldReduceMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);

  /* Scroll depth — parallax drift */
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  
  const yImages = useTransform(
    scrollYProgress,
    [0, 1],
    [shouldReduceMotion ? "0%" : "-3%", shouldReduceMotion ? "0%" : "3%"]
  );

  const currentIndex = Math.max(0, fleet.findIndex((v) => v.id === active));
  const current = fleet[currentIndex];

  return (
    <section
      ref={sectionRef}
      id="fleet"
      aria-labelledby="fleet-title"
      className="section fleet-vip relative isolate overflow-hidden border-t border-[#D4AF78]/20"
    >
      <div className="wrap relative z-10">
        {/* ── HEADER: asymmetric editorial split ──────────────── */}
        <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-end lg:gap-16">
          <Reveal>
            <div className="flex items-center gap-4">
              <span className="h-px w-12 bg-gradient-to-r from-[#D4AF78] to-[#D4AF78]/20" />
              <span className="text-[0.72rem] uppercase tracking-[0.34em] text-[#D4AF78]">
                The Sanctuary Fleet
              </span>
            </div>
            <h2
              id="fleet-title"
              className="t-display t-display-lg mt-6 text-[#F5F3EE]"
            >
              An immaculate fleet,
              <br />
              <em className="fl-gold-text italic">curated for the VIP.</em>
            </h2>
          </Reveal>

          <Reveal delay={0.1} className="lg:pb-2">
            <p className="t-lead border-l border-[#D4AF78]/25 pl-6 text-[#F5F3EE]/70">
                Pristine vehicles. Meticulously detailed before every departure to guarantee absolute perfection.            
              </p>
            <p className="fl-label mt-6 flex flex-wrap items-center gap-3 pl-6 text-[#F5F3EE]/50">
              All-inclusive <Diamond /> Chauffeur-driven <Diamond /> Uncompromising
            </p>
          </Reveal>
        </div>

        {/* ── OCCASIONS MARQUEE: bolder text & gold borders ───── */}
        <Reveal
          delay={0.15}
          className="fl-marquee mt-16 py-4"
        >
          <div className="fl-marquee-track">
            {[0, 1].map((dup) => (
              <div
                key={dup}
                aria-hidden={dup === 1}
                className="flex items-center gap-10 pr-10"
              >
                {OCCASIONS.map((occasion) => (
                  <span
                    key={occasion}
                    className="fl-label flex items-center gap-10 whitespace-nowrap text-[#F5F3EE]"
                  >
                    {occasion} <Diamond />
                  </span>
                ))}
              </div>
            ))}
          </div>
        </Reveal>

        {/* ── VIEWING RAIL: live readout + direct selection ─────── */}
        <div className="mt-12 hidden items-end justify-between gap-8 lg:flex">
          <div className="flex items-baseline gap-5">
            <span className="fl-label text-[#F5F3EE]/50">Now viewing</span>
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={active}
                initial={shouldReduceMotion ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
                transition={{ duration: shouldReduceMotion ? 0 : 0.35, ease: EASE_CUSTOM }}
                className="fl-serif text-[1.35rem] font-medium italic text-[#D4AF78]"
              >
                {current?.name}
              </motion.span>
            </AnimatePresence>
          </div>

          <div className="flex items-center gap-6">
            <div
              role="group"
              aria-label="Choose a vehicle to view"
              className="flex items-center"
            >
              {fleet.map((v) => (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => setActive(v.id)}
                  aria-pressed={v.id === active}
                  aria-label={`View ${v.name}`}
                  className="group px-1.5 py-3 focus-visible:outline-offset-2"
                >
                  <span
                    className={`block h-[2px] transition-all duration-500 ${
                      v.id === active
                        ? "w-14 bg-[#D4AF78]"
                        : "w-9 bg-[#D4AF78]/25 group-hover:bg-[#D4AF78]/60"
                    }`}
                  />
                </button>
              ))}
            </div>
            <span className="text-[0.72rem] tracking-[0.25em] text-[#F5F3EE]/60 tabular-nums">
              {String(currentIndex + 1).padStart(2, "0")}{" "}
              <span className="text-[#F5F3EE]/30">
                / {String(fleet.length).padStart(2, "0")}
              </span>
            </span>
          </div>
        </div>

        {/* ── DESKTOP: the viewing gallery ──────────────────────── */}
        <motion.div
          className="relative mt-8 hidden h-[max(30rem,min(74vh,46rem))] gap-3 lg:flex"
          initial={shouldReduceMotion ? false : { opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-12%" }}
          transition={{ duration: 1.1, delay: 0.1, ease: EASE_CUSTOM }}
        >
          {fleet.map((v, i) => {
            const isActive = v.id === active;
            return (
              <article
                key={v.id}
                data-active={isActive}
                onMouseEnter={() => setActive(v.id)}
                className="fl-panel group relative isolate min-w-0 overflow-hidden bg-[#0B0A08] transition-[flex-grow] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
                style={{ flexGrow: isActive ? 4.2 : 1, flexBasis: 0 }}
              >
                {/* Photograph */}
                <motion.div style={{ y: yImages }} className="absolute inset-x-0 -inset-y-[6%]">
                  <div className="fl-drift absolute inset-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={v.image}
                      alt={v.alt}
                      width={1600}
                      height={1067}
                      loading="lazy"
                      draggable={false}
                      className={`grade absolute inset-0 h-full w-full object-cover transition-[transform,opacity,filter] duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                        isActive ? "scale-100 opacity-100" : "scale-105 opacity-45"
                      }`}
                      style={{
                        filter: isActive
                          ? "brightness(0.85) contrast(1.08) saturate(0.9)"
                          : "brightness(0.6) contrast(1.1) saturate(0.7)",
                      }}
                    />
                  </div>
                </motion.div>

                {/* Scrim */}
                <div aria-hidden="true" className="fl-scrim absolute inset-0" />

                {/* Gold frame */}
                <div aria-hidden="true" className="pointer-events-none absolute inset-3 z-30">
                  <span className="fl-line fl-line-t" />
                  <span className="fl-line fl-line-r" />
                  <span className="fl-line fl-line-b" />
                  <span className="fl-line fl-line-l" />
                  <span className="fl-corner fl-corner-tl" />
                  <span className="fl-corner fl-corner-br" />
                  <span className="fl-diamond" />
                </div>

                {/* Engraved plate number */}
                <div
                  aria-hidden="true"
                  className="fl-ghostnum fl-serif pointer-events-none absolute left-7 top-5 z-20 select-none leading-none"
                >
                  0{i + 1}
                </div>

                {/* Vertical catalogue label */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute right-5 top-6 z-40 flex flex-col items-center gap-3"
                >
                  <span className="fl-numline h-8 w-px" />
                  <span className="fl-num text-[0.62rem] uppercase tracking-[0.3em] [writing-mode:vertical-rl]">
                    Nº 0{i + 1}
                  </span>
                </div>

                {/* Collapsed spine */}
                <div
                  aria-hidden="true"
                  className="fl-vname pointer-events-none absolute bottom-8 left-6 z-30"
                >
                  <span className="block rotate-180 text-[0.8rem] uppercase tracking-[0.28em] text-[#F5F3EE]/70 [writing-mode:vertical-rl]">
                    {v.name}
                  </span>
                </div>

                {/* Activation surface */}
                <button
                  type="button"
                  onClick={() => setActive(v.id)}
                  onFocus={() => setActive(v.id)}
                  aria-expanded={isActive}
                  aria-controls={`fleet-${v.id}`}
                  className="absolute inset-0 z-20 text-left focus-visible:outline-offset-[-6px]"
                >
                  <span className="sr-only">Show {v.name}</span>
                </button>

                {/* Active plate info */}
                <div
                  className={`absolute inset-x-0 bottom-0 z-30 p-10 ${
                    isActive ? "pointer-events-auto" : "pointer-events-none"
                  }`}
                >
                  <div className="fl-info">
                    <h3 className="t-display t-display-md whitespace-nowrap text-[#F5F3EE]">
                      {v.name}
                    </h3>

                    <div
                      className={`grid transition-[grid-template-rows] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                        isActive ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                      }`}
                    >
                      <div
                        id={`fleet-${v.id}`}
                        {...({ inert: !isActive ? "" : undefined } as Record<string, any>)}
                        className={`min-h-0 overflow-hidden transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                          isActive
                            ? "translate-y-0 opacity-100 delay-200"
                            : "translate-y-3 opacity-0"
                        }`}
                      >
                        <p className="text-body mt-4 max-w-[26rem] text-[#F5F3EE]/80">
                          {v.note}
                        </p>

                        <dl className="mt-8 flex gap-8">
                          <Spec label="Guest Capacity" value={String(v.passengers)} />
                        </dl>

                        <a
                          href="#reserve"
                          onClick={() => selectVehicle(v.id)}
                          className="link-mono fl-reserve group/link relative z-30 mt-8 inline-flex min-h-11 items-center gap-2 text-[#D4AF78] hover:text-[#E4C491]"
                        >
                          Reserve this vehicle
                          <ArrowRight
                            size={14}
                            aria-hidden="true"
                            className="transition-transform duration-500 group-hover/link:translate-x-1"
                          />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </motion.div>

        {/* ── MOBILE & TABLET: catalogue plates ─────────────────── */}
        <ul className="mt-12 grid gap-20 lg:hidden">
          {fleet.map((v, i) => (
            <Reveal as="li" key={v.id} delay={i * 0.05}>
              <div className="mb-5 flex items-center gap-4">
                <span className="fl-label text-[#D4AF78]">Nº 0{i + 1}</span>
                <span aria-hidden="true" className="h-px flex-1 bg-[#D4AF78]/15" />
                <Diamond />
              </div>

              <div className="relative aspect-[4/3] overflow-hidden bg-[#0B0A08]">
                <div className="fl-drift absolute inset-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={v.image}
                    alt={v.alt}
                    width={1600}
                    height={1200}
                    loading="lazy"
                    draggable={false}
                    className="grade h-full w-full object-cover"
                    style={{
                      filter: "brightness(0.85) contrast(1.08) saturate(0.9)",
                    }}
                  />
                </div>
                <div
                  aria-hidden="true"
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(to top, rgba(6,6,6,0.55), transparent 45%)",
                  }}
                />
                <div aria-hidden="true" className="absolute inset-0 border border-[#D4AF78]/40" />
                <div aria-hidden="true" className="absolute left-2 top-2 h-5 w-5 border-l border-t border-[#D4AF78]" />
                <div aria-hidden="true" className="absolute bottom-2 right-2 h-5 w-5 border-b border-r border-[#D4AF78]" />
                <div
                  aria-hidden="true"
                  className="fl-ghostnum fl-ghostnum-static fl-serif absolute left-4 top-3 select-none leading-none"
                >
                  0{i + 1}
                </div>
                <div className="fl-label absolute right-4 top-4 text-[#D4AF78]">
                  Nº 0{i + 1}
                </div>
              </div>

              <h3 className="t-display t-display-sm mt-8 text-[#F5F3EE]">
                {v.name}
              </h3>
              <p className="mt-4 max-w-[30rem] text-[0.95rem] leading-[1.75] text-[#F5F3EE]/70">
                {v.note}
              </p>

              <dl className="mt-6">
                <Spec label="Guest Capacity" value={String(v.passengers)} />
              </dl>

              <a
                href="#reserve"
                onClick={() => selectVehicle(v.id)}
                className="link-mono fl-reserve group mt-6 inline-flex min-h-11 items-center gap-2 text-[#D4AF78] hover:text-[#E4C491]"
              >
                Reserve this vehicle
                <ArrowRight
                  size={14}
                  aria-hidden="true"
                  className="transition-transform duration-500 group-hover:translate-x-1"
                />
              </a>
            </Reveal>
          ))}
        </ul>
      </div>

      {/* ── FILM GRAIN ──────────────────────────────────────────── */}
      <div
        aria-hidden="true"
        className="fl-grain pointer-events-none absolute inset-0 z-[60] opacity-[0.05] mix-blend-overlay"
      />
    </section>
  );
}

function Diamond({ className = "" }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`inline-block h-[5px] w-[5px] rotate-45 border border-[#D4AF78]/60 ${className}`}
    />
  );
}

function Spec({
  label,
  value,
  className = "",
}: {
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <dt className="t-caption fl-label text-[#F5F3EE]/55">{label}</dt>
      <dd className="t-figure mt-2 text-xl font-light text-[#F5F3EE] sm:text-2xl">
        {value}
      </dd>
    </div>
  );
}
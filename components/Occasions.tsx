// components/Occasions.tsx
"use client";

import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import { Reveal } from "./Reveal";
import "./occasions.css";

type Tile = {
  id: string;
  title: string;
  body: string;
  image: string;
  alt: string;
  width: number;
  height: number;
  kicker: string;
  tint: string;
  caption: string;
};

const tiles: Tile[] = [
  {
    id: "weddings",
    title: "Weddings & Ceremonies",
    body: "The couple, the family, and the wedding party—arriving in synchronized elegance with a dedicated reserve limousine waiting on standby.",
    image: "/images/occ-weddings.jpg",
    alt: "A bride and groom raising glasses under a limousine's starlight ceiling",
    width: 1300,
    height: 1598,
    kicker: "The Sacred Union",
    tint: "#C99A8E",
    caption: "Flawless coordination for life's rare milestones",
  },
  {
    id: "airport",
    title: "Airport Transfers & Aviation",
    body: "Seamless coordination and flight-tracked arrivals, ensuring your transition from cabin to terminal is impeccably effortless.",
    image: "/images/occ-airport.jpg",
    alt: "An executive limousine waiting on the tarmac beside a private jet",
    width: 1300,
    height: 1598,
    kicker: "Private Aviation",
    tint: "#8EA8C9",
    caption: "Punctuality and discretion at every major aviation hub",
  },
  {
    id: "business",
    title: "Executive & Corporate",
    body: "High-stakes roadshows, discreet client transits, and late departures handled with absolute confidentiality and precision.",
    image: "/images/occ-business.jpg",
    alt: "A businesswoman on a call in the leather rear seat of a chauffeured car",
    width: 1400,
    height: 875,
    kicker: "The Boardroom",
    tint: "#8FA6C4",
    caption: "Uninterrupted focus between engagements",
  },
  {
    id: "nights",
    title: "Private Soirées",
    body: "Gala openings, private dining, and after-hours city escapes with a fully provisioned cabin at your command.",
    image: "/images/occ-nights.jpg",
    alt: "Inside a stretch limousine: leather bench seating, a lit bar and a starlight ceiling",
    width: 1400,
    height: 875,
    kicker: "The After-Hours",
    tint: "#E0A458",
    caption: "The city unlocked for the discerning few",
  },
];

function TileCard({
  tile,
  index = 0,
}: {
  tile: Tile;
  index?: number;
}) {
  const ref = useRef<HTMLElement>(null);
  const shouldReduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  
  const y = useTransform(
    scrollYProgress,
    [0, 1],
    [shouldReduceMotion ? "0%" : "-4%", shouldReduceMotion ? "0%" : "4%"]
  );

  return (
    <article
      ref={ref}
      id={`occasion-${tile.id}`}
      aria-labelledby={`occasion-${tile.id}-title`}
      className="oc-tile on-photo group relative flex flex-col min-h-[30rem] lg:min-h-[34rem] overflow-hidden bg-[#0B0A08] cursor-default"
    >
      {/* Photograph container */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div style={{ y }} className="absolute inset-x-0 -inset-y-[10%] h-[120%]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={tile.image}
            alt={tile.alt}
            width={tile.width}
            height={tile.height}
            loading="lazy"
            draggable={false}
            className="grade oc-img absolute inset-0 h-full w-full object-cover object-center transition-transform duration-[1.4s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]"
          />
        </motion.div>
      </div>

      {/* Legibility scrim */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(to_top,rgba(6,6,6,0.95)_0%,rgba(6,6,6,0.52)_50%,rgba(6,6,6,0.15)_75%,rgba(6,6,6,0.3)_100%)] z-10"
      />

      {/* Engraved plate number */}
      <div
        aria-hidden="true"
        className="oc-ghostnum oc-serif pointer-events-none absolute left-7 top-5 z-20 select-none leading-none"
      >
        0{index + 1}
      </div>

      {/* Gold frame */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-3 z-30">
        <span className="oc-line oc-line-t" />
        <span className="oc-line oc-line-r" />
        <span className="oc-line oc-line-b" />
        <span className="oc-line oc-line-l" />
        <span className="oc-corner oc-corner-tl" />
        <span className="oc-corner oc-corner-br" />
        <span className="oc-diamond" />
      </div>

      {/* Vertical catalogue label */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-5 top-6 z-30 flex flex-col items-center gap-3"
      >
        <span className="oc-numline h-8 w-px" />
        <span className="oc-num text-[0.62rem] uppercase tracking-[0.3em] [writing-mode:vertical-rl]">
          Nº 0{index + 1}
        </span>
      </div>

      {/* Content */}
      <div className="pointer-events-none relative mt-auto z-30 p-8 sm:p-10 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-1">
        <div
          className="h-px w-8 transition-all duration-700 group-hover:w-16"
          style={{ background: `linear-gradient(90deg, #D4AF78, ${tile.tint})` }}
        />

        <p
          className="oc-label mt-4 flex items-center gap-2"
          style={{ color: tile.tint }}
        >
          <span
            aria-hidden="true"
            className="inline-block h-[5px] w-[5px] rotate-45 border"
            style={{ borderColor: tile.tint }}
          />
          {tile.kicker}
        </p>

        <h3
          id={`occasion-${tile.id}-title`}
          className="t-display mt-2 text-[#F5F3EE] t-display-md"
        >
          {tile.title}
        </h3>

        <p className="text-body mt-3 text-[#F5F3EE]/75 transition-colors duration-700 group-hover:text-[#F5F3EE]/90 max-w-[28rem]">
          {tile.body}
        </p>

        <div className="mt-5 text-[0.7rem] uppercase tracking-[0.25em] text-[#D4AF78]/90 italic opacity-100 transition-all duration-700 lg:opacity-0 lg:group-hover:opacity-100">
          {tile.caption}
        </div>
      </div>
    </article>
  );
}

export function Occasions() {
  const sectionRef = useRef<HTMLElement>(null);

  return (
    <section
      ref={sectionRef}
      id="occasions"
      aria-labelledby="occasions-title"
      className="section occasions-vip relative isolate scroll-mt-20 overflow-hidden border-t border-[#D4AF78]/20"
    >
      <div className="wrap relative z-10">
        {/* HEADER */}
        <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-end lg:gap-16">
          <Reveal>
            <div className="flex items-center gap-4">
              <span className="h-px w-12 bg-gradient-to-r from-[#D4AF78] to-[#D4AF78]/20" />
              <span className="text-[0.72rem] uppercase tracking-[0.34em] text-[#D4AF78]">
                Curated Engagements
              </span>
            </div>
            <h2
              id="occasions-title"
              className="t-display t-display-lg mt-6 text-[#F5F3EE]"
            >
              Designed for life&rsquo;s
              <br />
              <em className="oc-gold-text italic">rarest moments.</em>
            </h2>
          </Reveal>

          <Reveal delay={0.1} className="lg:pb-2">
            <p className="t-lead border-l border-[#D4AF78]/25 pl-6 text-[#F5F3EE]/70">
              Name the occasion. We curate the entire experience — the vehicle, the schedule, and the quiet refinements that make your arrival undeniable.
            </p>
            <p className="oc-label mt-6 flex flex-wrap items-center gap-3 pl-6 text-[#F5F3EE]/50">
              Dedicated Chauffeur <Diamond /> Flawless Itinerary <Diamond /> Absolute Discretion
            </p>
          </Reveal>
        </div>

        {/* 2x2 BALANCED GRID FOR 4 TILES */}
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {tiles.map((t, i) => (
            <Reveal key={t.id} delay={0.1 + i * 0.08}>
              <TileCard tile={t} index={i} />
            </Reveal>
          ))}
        </div>

        {/* CONCIERGE FOOTER */}
        <Reveal className="mt-14 flex flex-col gap-5 border-t border-[#D4AF78]/10 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="flex items-center gap-3 text-[0.8rem] text-[#F5F3EE]/60">
            Every engagement includes a uniformed personal chauffeur, an clean vehicle, and an uncompromising standard of care.
          </p>
          <a
            href="#reserve"
            className="oc-cta group inline-flex min-h-11 items-center gap-2 text-[0.7rem] uppercase tracking-[0.28em] text-[#D4AF78] transition-colors duration-300 hover:text-[#E4C491]"
          >
            Curate your evening
            <span aria-hidden="true">→</span>
          </a>
        </Reveal>
      </div>

      <div
        aria-hidden="true"
        className="oc-grain pointer-events-none absolute inset-0 z-[60] opacity-[0.05] mix-blend-overlay"
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
// components/Faq.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import { Reveal } from "./Reveal";
import "./faq.css"; // App Router: import here. Pages Router: move this import to _app.tsx.

const ease = [0.16, 1, 0.3, 1] as const;

// House policies and guidelines, curated for absolute clarity and refinement.
const faqs = [
  {
    id: "booking",
    tag: "Reservations",
    q: "How far in advance should I book?",
    a: "We recommend booking as early as possible, especially for weddings, special events, and busy dates. For regular rides, 48 hours' notice is preferred. Last-minute requests are always welcome, subject to availability.",
  },
  {
    id: "inclusions",
    tag: "What's Included",
    q: "What's included with my reservation?",
    a: "Every booking includes a professional chauffeur and a clean, comfortable vehicle. Any additional costs, such as tolls and gratuities, will be clearly explained so you know what to expect.",
  },
  {
    id: "minimums",
    tag: "Booking Duration",
    q: "Is there a minimum booking time?",
    a: "Yes. Our standard limousine service has a 3-hour minimum, while SUV reservations require a 4-hour minimum.",
  },
  {
    id: "cancellation",
    tag: "Changes & Cancellations",
    q: "Can I change or cancel my reservation?",
    a: "Yes. You can make changes or cancel your reservation up to 72 hours before your scheduled pickup. Please contact us and we'll be happy to help.",
  },
];


/* ── Live New York time — the desk against which questions are asked ── */
function useNyTime() {
  const [time, setTime] = useState<string | null>(null);
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-GB", {
      timeZone: "America/New_York",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
    const tick = () => setTime(fmt.format(new Date()));
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);
  return time;
}

export function Faq() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const time = useNyTime();

  /* Scroll depth — the photograph sinks, the watermark rises */
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const yImage = useTransform(
    scrollYProgress,
    [0, 1],
    [reduce ? "0%" : "-3%", reduce ? "0%" : "3%"]
  );

  const draw = (delay: number, axis: "scaleX" | "scaleY") => ({
    initial: reduce ? (false as const) : { [axis]: 0 },
    whileInView: { [axis]: 1 },
    viewport: { once: true, margin: "-10%" },
    transition: { duration: 1.2, delay, ease },
  });

  const appear = (delay: number) => ({
    initial: reduce ? (false as const) : { opacity: 0 },
    whileInView: { opacity: 1 },
    viewport: { once: true, margin: "-10%" },
    transition: { duration: 1, delay, ease },
  });

  return (
    <section
      ref={ref}
      id="faq"
      aria-labelledby="faq-title"
      className="faq-vip section relative isolate scroll-mt-20 overflow-hidden border-t border-[#D4AF78]/20"
    >
      {/* ── ATMOSPHERE: steel night warming back to the hearth ──── */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0">
        <div className="fq-glow-a absolute -right-[10%] -top-[12%] h-[42vw] w-[42vw] rounded-full blur-[90px]" />
        <div className="fq-glow-b absolute -bottom-[14%] -left-[8%] h-[40vw] w-[40vw] rounded-full blur-[100px]" />
      </div>

      <div className="wrap relative z-10">
        {/* ── CINEMATIC PLATE: the question, posed in the dark ──── */}
        <Reveal className="on-photo relative isolate flex aspect-[4/3] items-end overflow-hidden bg-[#0B0A08] sm:aspect-[11/5]">
          {/* Photograph — parallax band, slow burn, night grade */}
          <motion.div style={{ y: yImage }} className="absolute inset-x-0 -inset-y-[5%] z-0">
            <div className="fq-drift absolute inset-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/faq-band.jpg"
                alt="A man in a suit with a glass of whisky in the dark rear seat of a chauffeured car"
                width={2400}
                height={1600}
                loading="lazy"
                draggable={false}
                className="grade absolute inset-0 h-full w-full object-cover object-[50%_18%]"
                style={{ filter: "brightness(0.62) contrast(1.1) saturate(0.85)" }}
              />
            </div>
          </motion.div>

          {/* Deep scrim */}
          <div
            aria-hidden="true"
            className="absolute inset-0 z-[1]"
            style={{
              background:
                "linear-gradient(to top, #060606 2%, rgba(6,6,6,0.72) 36%, rgba(6,6,6,0.18) 66%, rgba(6,6,6,0.42) 100%)",
            }}
          />

          {/* Colour grade: amber whisky light, candle gold */}
          <div aria-hidden="true" className="fq-bandglow-a absolute inset-0 z-[2] mix-blend-screen" />
          <div aria-hidden="true" className="fq-bandglow-b absolute inset-0 z-[2] mix-blend-screen" />

          {/* Gold frame — drawn line by line on arrival */}
          <div
            className="pointer-events-none absolute z-[4]"
            style={{ inset: "clamp(0.9rem, 2.5vw, 1.5rem)" }}
          >
            <motion.span
              aria-hidden="true"
              className="absolute left-0 top-0 h-px w-full origin-left bg-gradient-to-r from-transparent via-[#D4AF78]/55 to-[#D4AF78]/25"
              {...draw(0.15, "scaleX")}
            />
            <motion.span
              aria-hidden="true"
              className="absolute right-0 top-0 h-full w-px origin-top bg-gradient-to-b from-[#D4AF78]/45 via-[#D4AF78]/15 to-transparent"
              {...draw(0.3, "scaleY")}
            />
            <motion.span
              aria-hidden="true"
              className="absolute bottom-0 left-0 h-px w-full origin-right bg-gradient-to-l from-transparent via-[#D4AF78]/40 to-[#D4AF78]/20"
              {...draw(0.45, "scaleX")}
            />
            <motion.span
              aria-hidden="true"
              className="absolute bottom-0 left-0 h-full w-px origin-bottom bg-gradient-to-t from-[#D4AF78]/35 to-transparent"
              {...draw(0.6, "scaleY")}
            />
            <motion.span
              aria-hidden="true"
              className="absolute -left-px -top-px h-6 w-6 border-l border-t border-[#D4AF78]/80"
              {...appear(0.85)}
            />
            <motion.span
              aria-hidden="true"
              className="absolute -bottom-px -right-px h-6 w-6 border-b border-r border-[#D4AF78]/80"
              {...appear(0.85)}
            />
            <motion.span
              aria-hidden="true"
              className="absolute -right-[3px] -top-[3px] h-[7px] w-[7px] rotate-45 border border-[#D4AF78] bg-[#060606]"
              {...appear(1)}
            />

            {/* The desk is open — live, on the frame itself */}
            <motion.div
              className="absolute left-4 right-4 top-3 flex items-center justify-between gap-4 sm:left-6 sm:right-6 sm:top-4"
              {...appear(1.05)}
            >
              <span
                role="timer"
                aria-live="off"
                aria-label="New York local time"
                className="flex items-center gap-2.5 text-[0.58rem] uppercase tracking-[0.28em] text-[#F5F3EE]/65"
              >
                NYC
                <span className="text-[0.66rem] tracking-[0.2em] text-[#D4AF78] tabular-nums">
                  {time ?? "––:––:––"}
                </span>
              </span>
            </motion.div>
          </div>

          {/* Vertical plate label */}
          <motion.div
            className="pointer-events-none absolute right-[0.8rem] top-1/2 z-[5] hidden -translate-y-1/2 flex-col items-center gap-3 sm:flex"
            {...appear(1.1)}
          >
            <span aria-hidden="true" className="h-8 w-px bg-[#D4AF78]/30" />
            <span className="text-[0.6rem] uppercase tracking-[0.3em] text-[#D4AF78]/65 [writing-mode:vertical-rl]">
              House Protocol
            </span>
            <span aria-hidden="true" className="h-8 w-px bg-[#D4AF78]/30" />
          </motion.div>

          {/* Heading + standfirst, laid over the dark lower part */}
<div className="relative z-10 flex w-full flex-col gap-8 p-8 sm:flex-row sm:items-end sm:justify-between sm:p-12">
  <div>
    <div className="mb-6 flex items-center gap-4">
      <span className="h-px w-12 bg-gradient-to-r from-[#D4AF78] to-[#D4AF78]/20" />
      <span className="text-[0.72rem] uppercase tracking-[0.34em] text-[#D4AF78]">
        Good to Know
      </span>
    </div>

    <h2 id="faq-title" className="t-display t-display-lg text-[#F5F3EE]">
      Your questions,
      <br className="hidden sm:block" />
      <em className="fq-gold-text italic"> answered.</em>
    </h2>
  </div>

  <p className="max-w-[26rem] border-l border-[#D4AF78]/25 pl-6 text-[0.95rem] leading-[1.8] text-[#F5F3EE]/70">
    Everything you need to know before your ride. From booking and pricing to special requests, we're here to make every step simple.
  </p>
</div>
        </Reveal>

        {/* ── EDITORIAL Q&A: engraved plates, all answers in the open ── */}
        <dl className="mt-16 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {faqs.map((f, i) => (
            <Reveal
              key={f.q}
              delay={i * 0.08}
              className="fq-card group relative border-t border-[#D4AF78]/30 pt-8"
            >
              <span aria-hidden="true" className="fq-card-line" />
              <span aria-hidden="true" className="fq-card-ghost fq-serif">
                0{i + 1}
              </span>

              <div
                id={`faq-${f.id}`}
                className="flex scroll-mt-28 items-center justify-between"
              >
                <span className="flex items-baseline gap-3">
                  <span className="fq-card-num text-[0.65rem] uppercase tracking-[0.3em]">
                    0{i + 1}
                  </span>
                  <span className="fq-label text-[#F5F3EE]/45">{f.tag}</span>
                </span>
                <span
                  aria-hidden="true"
                  className="fq-card-diamond inline-block h-[5px] w-[5px] rotate-45 border border-[#D4AF78]"
                />
              </div>

              <dt className="t-display t-display-sm mt-4 text-[#F5F3EE]">
                {f.q}
              </dt>

              <dd className="text-body mt-4 leading-relaxed text-[#F5F3EE]/70 transition-colors duration-700 group-hover:text-[#F5F3EE]/90">
                {f.a}
              </dd>
            </Reveal>
          ))}
        </dl>
      </div>

      {/* ── FILM GRAIN ──────────────────────────────────────────── */}
      <div
        aria-hidden="true"
        className="fq-grain pointer-events-none absolute inset-0 z-[60] opacity-[0.05] mix-blend-overlay"
      />
    </section>
  );
}
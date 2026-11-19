// components/Reserve.tsx
"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import { ArrowLeft, ArrowRight, Check, CheckCircle, Minus, Plus, WarningCircle } from "@phosphor-icons/react";
import { fleet, type VehicleId } from "@/lib/data";
import { VEHICLE_EVENT } from "@/lib/events";
import { site } from "@/lib/site";
import "./reserve.css"; // App Router: import here. Pages Router: move this import to _app.tsx.

const ease = [0.16, 1, 0.3, 1] as const;

type Field = "date" | "time" | "pickup" | "dropoff" | "name" | "phone" | "email";
type Errors = Partial<Record<Field, string>>;
type Step = 1 | 2;

const STEP_FIELDS: Record<Step, Field[]> = {
  1: ["date", "time", "pickup", "dropoff"],
  2: ["name", "phone", "email"],
};

const today = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

function validate(fd: FormData, fields: Field[]): Errors {
  const get = (k: string) => String(fd.get(k) ?? "").trim();
  const checks: Record<Field, () => string | null> = {
    date: () => (get("date") ? null : "Please select a date for your journey."),
    time: () => (get("time") ? null : "Please specify a pickup time."),
    pickup: () => (get("pickup") ? null : "Where shall we collect you?"),
    dropoff: () => (get("dropoff") ? null : "Please provide your destination."),
    name: () => (get("name") ? null : "May we have your name?"),
    phone: () =>
      get("phone").replace(/\D/g, "").length >= 10
        ? null
        : "Please provide a valid mobile number.",
    email: () => (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(get("email")) ? null : "Please provide a valid email address."),
  };
  const e: Errors = {};
  for (const f of fields) {
    const msg = checks[f]();
    if (msg) e[f] = msg;
  }
  return e;
}

function sendRequest(data: Record<string, string>) {
  const vehicle = fleet.find((v) => v.id === data.vehicle)?.name ?? data.vehicle;
  const lines = [
    `Name: ${data.name}`,
    `Phone: ${data.phone}`,
    `Email: ${data.email}`,
    `Vehicle: ${vehicle}`,
    `Guests: ${data.passengers}`,
    `Date: ${data.date}`,
    `Time: ${data.time}`,
    `Pickup: ${data.pickup}`,
    `Drop-off: ${data.dropoff}`,
    data.notes ? `Notes: ${data.notes}` : "",
  ].filter(Boolean);
  const subject = `Bespoke Reservation: ${vehicle}, ${data.date}`;
  window.location.href = `mailto:${site.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join("\n\n"))}`;
}

function formatTrip(fd: FormData) {
  const date = String(fd.get("date") ?? "");
  const time = String(fd.get("time") ?? "");
  let when = `${date} ${time}`;
  if (date && time) {
    const d = new Date(`${date}T${time}`);
    if (!Number.isNaN(d.getTime())) {
      when = new Intl.DateTimeFormat("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
      }).format(d);
    }
  }
  return {
    vehicle: fleet.find((v) => v.id === fd.get("vehicle"))?.name ?? "",
    guests: String(fd.get("passengers") ?? ""),
    when,
    route: `${String(fd.get("pickup") ?? "")} to ${String(fd.get("dropoff") ?? "")}`,
  };
}

/* ── Live New York time — the dispatch desk never closes ─────────── */
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

/* ── Magnetic hover — the invitation leans toward the cursor ─────── */
function Magnetic({
  children,
  disabled = false,
  strength = 0.22,
}: {
  children: ReactNode;
  disabled?: boolean;
  strength?: number;
}) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 200, damping: 18, mass: 0.5 });
  const sy = useSpring(y, { stiffness: 200, damping: 18, mass: 0.5 });
  return (
    <motion.div
      className="inline-block"
      style={{ x: sx, y: sy }}
      onMouseMove={(e) => {
        if (disabled) return;
        const r = e.currentTarget.getBoundingClientRect();
        x.set((e.clientX - (r.left + r.width / 2)) * strength);
        y.set((e.clientY - (r.top + r.height / 2)) * strength);
      }}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      {children}
    </motion.div>
  );
}

// ── VIP Input Component ─────────────────────────────────────────────
function LuxuryInput({
  label,
  name,
  type = "text",
  placeholder,
  error,
  autoComplete,
  inputMode,
  min,
  className = "",
}: {
  label: string;
  name: Field;
  type?: string;
  placeholder?: string;
  error?: string;
  autoComplete?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  min?: string;
  className?: string;
}) {
  return (
    <div className={`rs-field group relative ${className}`} data-error={error ? "true" : "false"}>
      <label htmlFor={name} className="rs-label mb-3 block text-[#D4AF78]/70">
        {label}
      </label>
      <div className="relative">
        <input
          id={name}
          name={name}
          type={type}
          placeholder={placeholder}
          autoComplete={autoComplete}
          inputMode={inputMode}
          min={min}
          required
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${name}-error` : undefined}
          className="peer w-full bg-transparent py-3 text-[1.0625rem] font-light text-[#F5F3EE] placeholder:text-[#F5F3EE]/20 focus:outline-none transition-colors duration-500 [color-scheme:dark]"
        />
        {/* Animated gold underline */}
        <div className="rs-line-base absolute bottom-0 left-0 h-px w-full bg-[#D4AF78]/20 transition-colors duration-500 peer-focus:bg-[#D4AF78]" />
        <div className="absolute bottom-0 left-1/2 h-px w-0 bg-[#D4AF78] transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] peer-focus:left-0 peer-focus:w-full" />

        {/* Valid check — jade for a field in good order */}
        {type !== "date" && type !== "time" && (
          <Check
            size={16}
            aria-hidden="true"
            className="absolute right-0 top-1/2 -translate-y-1/2 text-[#8FBF8A] opacity-0 transition-opacity duration-500 peer-valid:opacity-100 peer-placeholder-shown:opacity-0"
          />
        )}
      </div>
      {error && (
        <p id={`${name}-error`} role="alert" className="rs-err mt-3 flex items-start gap-2 text-[0.8125rem] text-[#D98A7A]">
          <WarningCircle size={14} className="mt-0.5 shrink-0" aria-hidden="true" />
          {error}
        </p>
      )}
    </div>
  );
}

export function Reserve() {
  const [vehicle, setVehicle] = useState<VehicleId>("suburban");
  const [step, setStep] = useState<Step>(1);
  const [guests, setGuests] = useState(4);
  const maxGuests = fleet.find((v) => v.id === vehicle)?.passengers ?? 14;
  const vehicleName = fleet.find((v) => v.id === vehicle)?.name ?? "";

  const pickVehicle = (id: VehicleId) => {
    setVehicle(id);
    const cap = fleet.find((v) => v.id === id)?.passengers ?? 14;
    setGuests((g) => Math.min(g, cap));
  };

  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [minDate, setMinDate] = useState<string | undefined>(undefined);
  const [trip, setTrip] = useState<ReturnType<typeof formatTrip> | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const moved = useRef(false);

  const sectionRef = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const time = useNyTime();

  /* Scroll depth — the skyline sinks, the watermark rises */
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const yImage = useTransform(scrollYProgress, [0, 1], [reduce ? "0%" : "-3%", reduce ? "0%" : "3%"]);
  const yGhost = useTransform(scrollYProgress, [0, 1], [reduce ? "0%" : "5%", reduce ? "0%" : "-7%"]);

  /* Cursor atmosphere — motion values, zero re-renders per move */
  const mx = useMotionValue(50);
  const my = useMotionValue(50);
  const smx = useSpring(mx, { stiffness: 60, damping: 20 });
  const smy = useSpring(my, { stiffness: 60, damping: 20 });
  const spotlight = useMotionTemplate`radial-gradient(680px circle at ${smx}% ${smy}%, rgba(212,175,120,0.08), transparent 60%)`;

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

  useEffect(() => {
    setMinDate(today());
    const onPick = (e: Event) => pickVehicle((e as CustomEvent<VehicleId>).detail);
    window.addEventListener(VEHICLE_EVENT, onPick);
    return () => window.removeEventListener(VEHICLE_EVENT, onPick);
  }, []);

  useEffect(() => {
    if (!moved.current) return;
    const first = step === 1 ? "vehicle" : "name";
    formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
  }, [step]);

  const focusFirstError = (e: Errors) => {
    const first = Object.keys(e)[0];
    if (first) formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
    return Boolean(first);
  };

  const goToDetails = () => {
    if (!formRef.current) return;
    const fd = new FormData(formRef.current);
    const e = validate(fd, STEP_FIELDS[1]);
    setErrors(e);
    if (focusFirstError(e)) return;
    setTrip(formatTrip(fd));
    moved.current = true;
    setStep(2);
  };

  const backToTrip = () => {
    moved.current = true;
    setErrors({});
    setStep(1);
  };

  const onSubmit = (ev: React.FormEvent<HTMLFormElement>) => {
    ev.preventDefault();
    if (step === 1) {
      goToDetails();
      return;
    }
    const fd = new FormData(ev.currentTarget);
    const e = validate(fd, STEP_FIELDS[2]);
    setErrors(e);
    if (focusFirstError(e)) return;
    setStatus("sending");
    sendRequest(Object.fromEntries(Array.from(fd.entries()).map(([k, v]) => [k, String(v)])));
    setTimeout(() => setStatus("sent"), 800);
  };

  return (
    <section
      ref={sectionRef}
      id="reserve"
      aria-labelledby="reserve-title"
      className="reserve-vip relative isolate scroll-mt-20 overflow-hidden border-t border-[#D4AF78]/20"
      onMouseMove={(e) => {
        if (reduce) return;
        const r = e.currentTarget.getBoundingClientRect();
        mx.set(((e.clientX - r.left) / r.width) * 100);
        my.set(((e.clientY - r.top) / r.height) * 100);
      }}
      onMouseLeave={() => {
        mx.set(50);
        my.set(50);
      }}
    >
      {/* ── ATMOSPHERE: the hearth, at the end of the evening ───── */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0">
        <div className="rs-glow-a absolute -left-[10%] top-[30%] h-[44vw] w-[44vw] rounded-full blur-[90px]" />
        <div className="rs-glow-b absolute -bottom-[10%] -right-[8%] h-[40vw] w-[40vw] rounded-full blur-[100px]" />
      </div>

      {/* ── HEADER BAND: the city, waiting ──────────────────────── */}
      <div className="on-photo relative isolate flex min-h-[min(60vh,34rem)] items-end overflow-hidden">
        <motion.div style={{ y: yImage }} className="absolute inset-x-0 -inset-y-[5%] z-0">
          <div className="rs-drift absolute inset-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/skyline.jpg"
              alt="The Manhattan skyline at night"
              width={2400}
              height={1600}
              loading="lazy"
              draggable={false}
              className="grade absolute inset-0 h-full w-full object-cover"
              style={{ filter: "brightness(0.5) contrast(1.15) saturate(0.8)" }}
            />
          </div>
        </motion.div>
        <div
          aria-hidden="true"
          className="absolute inset-0 z-[1]"
          style={{
            background:
              "linear-gradient(to top, #0c0a06 4%, rgba(12,10,6,0.82) 36%, rgba(12,10,6,0.25) 66%, rgba(12,10,6,0.5) 100%)",
          }}
        />
        <div aria-hidden="true" className="rs-bandglow absolute inset-0 z-[2] mix-blend-screen" />


        {/* Gold frame — drawn line by line on arrival */}
        <div
          className="pointer-events-none absolute z-[4]"
          style={{ inset: "clamp(1rem, 3vw, 2rem)" }}
        >
          <motion.span aria-hidden="true" className="absolute left-0 top-0 h-px w-full origin-left bg-gradient-to-r from-transparent via-[#D4AF78]/50 to-[#D4AF78]/20" {...draw(0.15, "scaleX")} />
          <motion.span aria-hidden="true" className="absolute right-0 top-0 h-full w-px origin-top bg-gradient-to-b from-[#D4AF78]/40 via-[#D4AF78]/15 to-transparent" {...draw(0.3, "scaleY")} />
          <motion.span aria-hidden="true" className="absolute bottom-0 left-0 h-px w-full origin-right bg-gradient-to-l from-transparent via-[#D4AF78]/35 to-[#D4AF78]/15" {...draw(0.45, "scaleX")} />
          <motion.span aria-hidden="true" className="absolute bottom-0 left-0 h-full w-px origin-bottom bg-gradient-to-t from-[#D4AF78]/30 to-transparent" {...draw(0.6, "scaleY")} />
          <motion.span aria-hidden="true" className="absolute -left-px -top-px h-8 w-8 border-l border-t border-[#D4AF78]/70" {...appear(0.85)} />
          <motion.span aria-hidden="true" className="absolute -bottom-px -right-px h-8 w-8 border-b border-r border-[#D4AF78]/70" {...appear(0.85)} />
          <motion.span aria-hidden="true" className="absolute -right-[3px] -top-[3px] h-[7px] w-[7px] rotate-45 border border-[#D4AF78] bg-[#0c0a06]" {...appear(1)} />

          {/* The desk is open — live, on the frame itself */}
          <motion.div className="absolute left-4 right-4 top-3 flex items-center justify-between gap-4 sm:left-6 sm:right-6 sm:top-4" {...appear(1.05)}>
            <div />
            <span role="timer" aria-live="off" aria-label="New York local time" className="flex items-center gap-2.5 text-[0.58rem] uppercase tracking-[0.28em] text-[#F5F3EE]/65">
              NYC
              <span className="text-[0.66rem] tracking-[0.2em] text-[#D4AF78] tabular-nums">
                {time ?? "––:––:––"}
              </span>
            </span>
          </motion.div>
        </div>

        {/* Vertical plate label */}
        <motion.div className="pointer-events-none absolute right-[0.8rem] top-1/2 z-[5] hidden -translate-y-1/2 flex-col items-center gap-3 lg:flex" {...appear(1.1)}>
          <span aria-hidden="true" className="h-8 w-px bg-[#D4AF78]/30" />
          <span className="text-[0.6rem] uppercase tracking-[0.3em] text-[#D4AF78]/65 [writing-mode:vertical-rl]">
            Book Your Ride
          </span>
          <span aria-hidden="true" className="h-8 w-px bg-[#D4AF78]/30" />
        </motion.div>

        <div className="wrap relative z-10 flex w-full flex-col gap-8 pb-20 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-6 flex items-center gap-4">
              <span className="h-px w-12 bg-gradient-to-r from-[#D4AF78] to-[#D4AF78]/20" />
              <span className="text-[0.72rem] uppercase tracking-[0.34em] text-[#D4AF78]">Book Your Ride</span>
            </div>
            <h2 id="reserve-title" className="t-display t-display-xl max-w-[48rem] text-[#F5F3EE]">
                Your VIP experience <br className="hidden sm:block" /><em className="rs-gold-text italic">awaits.</em>
            </h2>
          </div>
          <p className="max-w-[20rem] border-l border-[#D4AF78]/25 pl-6 text-[0.95rem] leading-[1.8] text-[#F5F3EE]/70">
              Let's get you there in style.
          </p>
        </div>
      </div>

      <div className="wrap section relative z-10 !pt-20">
        <div className="grid gap-16 lg:grid-cols-12 lg:gap-20">

          {/* ── LEFT: the concierge, at your elbow ──────────────── */}
          <div className="lg:col-span-4 lg:sticky lg:top-32 lg:self-start">
            <p className="text-[1.125rem] font-light leading-relaxed text-[#F5F3EE]/80">
              Leave the details to us. We'll confirm your ride by email.
            </p>

            <div className="mt-12 border-t border-[#D4AF78]/20 pt-8">
              <p className="rs-label text-[#D4AF78]/70">Prefer to speak directly?</p>
              <a
                href={site.phoneHref}
                className="rs-serif mt-3 block text-3xl font-light text-[#F5F3EE] transition-colors duration-500 hover:text-[#D4AF78] sm:text-4xl"
              >
                {site.phoneDisplay}
              </a>
              <p className="mt-3 text-[0.9375rem] text-[#F5F3EE]/50">{site.hours}</p>
            </div>

            <div className="mt-12 border-t border-[#D4AF78]/20 pt-8">
              <p className="rs-label text-[#D4AF78]/70">The next quarter-hour</p>
              <ol className="mt-6 space-y-5">
                {[
                  "Send the request — no payment details needed.",
                  "Dispatch replies by email.",
                  "Approve the all-inclusive fare; the car is yours.",
                ].map((line, i) => (
                  <li key={line} className="flex items-start gap-4">
                    <span className="rs-serif mt-[-0.15rem] text-[1.15rem] font-light text-[#D4AF78]/70 tabular-nums">
                      0{i + 1}
                    </span>
                    <span className="text-[0.9rem] leading-[1.7] text-[#F5F3EE]/60">{line}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          {/* ── RIGHT: the reservation, in two movements ────────── */}
          <div className="lg:col-span-7 lg:col-start-6">
            {status === "sent" && (
              <div role="status" className="rs-sent relative border-t border-[#D4AF78]/30 pt-16 text-center">
                <span aria-hidden="true" className="absolute left-0 top-0 h-6 w-6 border-l border-t border-[#D4AF78]/60" />
                <span aria-hidden="true" className="absolute right-0 top-0 h-6 w-6 border-r border-t border-[#D4AF78]/60" />
                <div className="rs-seal mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-[#D4AF78]/30 bg-[#D4AF78]/5">
                  <CheckCircle size={32} weight="light" className="text-[#D4AF78]" aria-hidden="true" />
                </div>
                <h3 className="t-display t-display-md mt-8 text-[#F5F3EE]">Request Received</h3>
                {trip && (
                  <p className="rs-label mt-4 text-[#D4AF78]/70">
                    {trip.vehicle} · {trip.when}
                  </p>
                )}
                <p className="mx-auto mt-4 max-w-[34rem] leading-relaxed text-[#F5F3EE]/70">
                  Your email application should have opened with your reservation details pre-filled.
                  Simply press send, and our dispatch team will confirm your itinerary shortly.
                </p>
                <Magnetic disabled={!!reduce}>
                  <button type="button" className="btn btn-quiet mx-auto mt-10" onClick={() => setStatus("idle")}>
                    Arrange another journey
                  </button>
                </Magnetic>
              </div>
            )}

            <div hidden={status === "sent"}>
              {/* Progress rail */}
              <ol className="mb-16 grid grid-cols-2 gap-8" aria-label="Booking progress">
                {[
                  { n: 1, label: "The Journey" },
                  { n: 2, label: "Your Details" },
                ].map((s) => (
                  <li key={s.n} aria-current={step === s.n ? "step" : undefined} className="relative">
                    <span aria-hidden="true" className="relative block h-px w-full bg-[#D4AF78]/20">
                      <span
                        className={`absolute inset-0 origin-left bg-gradient-to-r from-[#D4AF78] to-[#D4AF78]/40 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                          step >= s.n ? "scale-x-100" : "scale-x-0"
                        }`}
                      />
                    </span>
                    <span
                      className={`mt-4 flex items-center gap-3 text-[0.72rem] uppercase tracking-[0.25em] transition-colors duration-700 ${
                        step === s.n ? "text-[#D4AF78]" : "text-[#F5F3EE]/30"
                      }`}
                    >
                      <span
                        aria-hidden="true"
                        className={`inline-block h-[5px] w-[5px] rotate-45 border transition-all duration-700 ${
                          step === s.n ? "border-[#D4AF78] bg-[#D4AF78]/30" : "border-[#D4AF78]/25"
                        }`}
                      />
                      Step 0{s.n} — {s.label}
                    </span>
                  </li>
                ))}
              </ol>

              <form ref={formRef} noValidate onSubmit={onSubmit} className="space-y-12">

                {/* STEP 1: The Journey */}
                <fieldset hidden={step !== 1} data-active={step === 1} className="rs-step space-y-12">
                  <legend className="sr-only">The Journey</legend>

                  {/* Vehicle selection */}
                  <div>
                    <p className="rs-label mb-6 text-[#D4AF78]/70">Select your vehicle</p>
                    <div className="grid gap-5 sm:grid-cols-3">
                      {fleet.map((v, i) => {
                        const selected = vehicle === v.id;
                        return (
                          <label
                            key={v.id}
                            data-selected={selected}
                            className={`rs-vehicle group relative flex cursor-pointer flex-col border transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                              selected
                                ? "border-[#D4AF78] bg-[#0B0A08] shadow-[0_24px_50px_-20px_rgba(0,0,0,0.7)]"
                                : "border-[#D4AF78]/15 bg-transparent hover:border-[#D4AF78]/40 hover:bg-[#0B0A08]/60"
                            }`}
                          >
                            <input type="radio" name="vehicle" value={v.id} checked={selected} onChange={() => pickVehicle(v.id)} className="sr-only" />
                            <span className="relative block aspect-[16/9] w-full overflow-hidden bg-[#060606]">
                              <span className="rs-vdrift absolute inset-0">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                  src={v.image}
                                  alt=""
                                  width={480}
                                  height={270}
                                  loading="lazy"
                                  draggable={false}
                                  className={`h-full w-full object-cover transition-all duration-1000 ${
                                    selected ? "scale-100 opacity-100" : "scale-105 opacity-50 group-hover:scale-100 group-hover:opacity-80"
                                  }`}
                                  style={{ filter: "brightness(0.8) contrast(1.05)" }}
                                />
                              </span>
                              <span aria-hidden="true" className="pointer-events-none absolute inset-2">
                                <span className="rs-vline rs-vline-t" />
                                <span className="rs-vline rs-vline-r" />
                                <span className="rs-vline rs-vline-b" />
                                <span className="rs-vline rs-vline-l" />
                                <span className="rs-vcorner rs-vcorner-tl" />
                                <span className="rs-vcorner rs-vcorner-br" />
                                <span className="rs-vdiamond" />
                              </span>
                              <span aria-hidden="true" className="rs-vghost rs-serif absolute left-3 top-1 select-none leading-none">
                                0{i + 1}
                              </span>
                            </span>
                            <span className="flex flex-1 items-center justify-between gap-3 px-5 py-5">
                              <span className="min-w-0">
                                <span className={`rs-serif block text-[1.05rem] font-medium transition-colors duration-500 ${selected ? "text-[#F5F3EE]" : "text-[#F5F3EE]/60"}`}>
                                  {v.name}
                                </span>
                                <span className="rs-label mt-1.5 block text-[#D4AF78]/70">
                                  Up to {v.passengers} guests
                                </span>
                              </span>
                              <span aria-hidden="true" className="grid h-5 w-5 shrink-0 place-items-center">
                                <span className={`grid h-4 w-4 rotate-45 place-items-center border transition-all duration-700 ${selected ? "border-[#D4AF78] bg-[#D4AF78]/10" : "border-[#D4AF78]/25"}`}>
                                  <span className={`h-1.5 w-1.5 bg-[#D4AF78] transition-transform duration-700 ${selected ? "scale-100" : "scale-0"}`} />
                                </span>
                              </span>
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  {/* Journey details */}
                  <div className="space-y-8">
                    <p className="rs-label text-[#D4AF78]/70">Journey details</p>

                    <div className="grid gap-x-8 gap-y-10 sm:grid-cols-2">
                      {/* Party size */}
                      <div className="sm:col-span-2">
                        <p className="rs-label mb-4 text-[#D4AF78]/70">Party size</p>
                        <input type="hidden" name="passengers" value={guests} />
                        <div className="flex items-center gap-8">
                          <button
                            type="button"
                            onClick={() => setGuests((g) => Math.max(1, g - 1))}
                            disabled={guests <= 1}
                            aria-label="Fewer guests"
                            className="grid h-12 w-12 place-items-center rounded-full border border-[#D4AF78]/30 text-[#F5F3EE] transition-all duration-500 hover:border-[#D4AF78] hover:bg-[#D4AF78]/10 hover:text-[#D4AF78] disabled:cursor-not-allowed disabled:opacity-20"
                          >
                            <Minus size={16} aria-hidden="true" />
                          </button>
                          <output aria-live="polite" className="t-figure min-w-[4ch] text-center text-4xl font-light text-[#F5F3EE] sm:text-5xl">
                            <span key={guests} className="rs-pop inline-block">{guests}</span>
                          </output>
                          <button
                            type="button"
                            onClick={() => setGuests((g) => Math.min(maxGuests, g + 1))}
                            disabled={guests >= maxGuests}
                            aria-label="More guests"
                            className="grid h-12 w-12 place-items-center rounded-full border border-[#D4AF78]/30 text-[#F5F3EE] transition-all duration-500 hover:border-[#D4AF78] hover:bg-[#D4AF78]/10 hover:text-[#D4AF78] disabled:cursor-not-allowed disabled:opacity-20"
                          >
                            <Plus size={16} aria-hidden="true" />
                          </button>
                        </div>
                        <p className="rs-label mt-4 text-[#F5F3EE]/40">
                          Up to {maxGuests} guests in the {vehicleName}
                        </p>
                      </div>

                      <LuxuryInput label="Date of journey" name="date" type="date" min={minDate} error={errors.date} />
                      <LuxuryInput label="Preferred pickup time" name="time" type="time" error={errors.time} />
                      <LuxuryInput label="Pickup Location" name="pickup" placeholder="e.g., The Plaza, 768 5th Ave" error={errors.pickup} />
                      <LuxuryInput label="Destination" name="dropoff" placeholder="e.g., Cipriani Wall Street" error={errors.dropoff} />
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-6 pt-4">
                    <button type="submit" className="btn btn-primary group">
                      Continue to details
                      <ArrowRight size={16} className="transition-transform duration-500 group-hover:translate-x-1" aria-hidden="true" />
                    </button>
                  </div>
                </fieldset>

                {/* STEP 2: Your Details */}
                <fieldset hidden={step !== 2} data-active={step === 2} className="rs-step space-y-12">
                  <legend className="sr-only">Your Details</legend>

                  {/* The itinerary dossier */}
                  {trip && (
                    <div className="relative border border-[#D4AF78]/20 bg-[#0B0A08]/80 p-8 sm:p-10">
                      <span aria-hidden="true" className="absolute left-0 top-0 h-6 w-6 border-l border-t border-[#D4AF78]/60" />
                      <span aria-hidden="true" className="absolute bottom-0 right-0 h-6 w-6 border-b border-r border-[#D4AF78]/60" />
                      <span aria-hidden="true" className="absolute -right-[3px] -top-[3px] h-[7px] w-[7px] rotate-45 border border-[#D4AF78] bg-[#0c0a06]" />

                      <div className="flex flex-wrap items-start justify-between gap-6">
                        <div className="min-w-0 space-y-3">
                          <p className="rs-label text-[#D4AF78]/80">The Itinerary</p>
                          <p className="rs-serif text-[1.35rem] font-light text-[#F5F3EE]">
                            {trip.vehicle}
                          </p>
                          <div className="flex flex-col gap-2 text-[0.9375rem] text-[#F5F3EE]/70 sm:flex-row sm:items-center sm:gap-6">
                            <span>{trip.guests} guests</span>
                            <span aria-hidden="true" className="hidden h-3 w-px bg-[#D4AF78]/30 sm:inline-block" />
                            <span>{trip.when}</span>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={backToTrip}
                          className="rs-label group/edit inline-flex items-center gap-2 text-[#D4AF78] transition-colors duration-300 hover:text-[#E4C491]"
                        >
                          <ArrowLeft size={14} className="transition-transform duration-500 group-hover/edit:-translate-x-1" aria-hidden="true" />
                          Modify trip
                        </button>
                      </div>

                      <div className="mt-8 border-t border-[#D4AF78]/15 pt-6 text-[0.9375rem] text-[#F5F3EE]/60">
                        Route: <strong className="font-normal text-[#F5F3EE]">{trip.route}</strong>
                      </div>
                    </div>
                  )}

                  <div className="space-y-8">
                    <p className="rs-label text-[#D4AF78]/70">Contact Information</p>
                    <div className="grid gap-x-8 gap-y-10 sm:grid-cols-2">
                      <LuxuryInput label="Full Name" name="name" placeholder="e.g., Alexander Wright" autoComplete="name" error={errors.name} />
                      <LuxuryInput label="Mobile Phone" name="phone" type="tel" placeholder="e.g., +1 (555) 019-2834" autoComplete="tel" inputMode="tel" error={errors.phone} />
                      <div className="sm:col-span-2">
                        <LuxuryInput label="Email Address" name="email" type="email" placeholder="e.g., alexander@example.com" autoComplete="email" inputMode="email" error={errors.email} />
                      </div>
                      <div className="sm:col-span-2">
                        <div className="rs-field group relative">
                          <label htmlFor="notes" className="rs-label mb-3 block text-[#D4AF78]/70">
                              Additional Requests (Optional)                          ]
                            </label>
                          <textarea
                            id="notes"
                            name="notes"
                            rows={3}
                            placeholder="e.g., Champagne preference, specific luggage requirements, or multiple stops..."
                            className="peer w-full bg-transparent py-3 text-[1.0625rem] font-light text-[#F5F3EE] placeholder:text-[#F5F3EE]/20 focus:outline-none transition-colors duration-500 resize-none [color-scheme:dark]"
                          />
                          <div className="rs-line-base absolute bottom-0 left-0 h-px w-full bg-[#D4AF78]/20 transition-colors duration-500 peer-focus:bg-[#D4AF78]" />
                          <div className="absolute bottom-0 left-1/2 h-px w-0 bg-[#D4AF78] transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] peer-focus:left-0 peer-focus:w-full" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-6 pt-4">
                    <button
                      type="button"
                      onClick={backToTrip}
                      className="btn btn-quiet group inline-flex items-center gap-2"
                    >
                      <ArrowLeft size={16} className="transition-transform duration-500 group-hover:-translate-x-1" aria-hidden="true" />
                      Back
                    </button>
                    <Magnetic disabled={!!reduce}>
                      <button type="submit" disabled={status === "sending"} className="btn btn-primary group">
                        {status === "sending" ? "Preparing request..." : "Send reservation request"}
                      </button>
                    </Magnetic>
                  </div>
                </fieldset>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* ── FILM GRAIN ──────────────────────────────────────────── */}
      <div
        aria-hidden="true"
        className="rs-grain pointer-events-none absolute inset-0 z-[60] opacity-[0.05] mix-blend-overlay"
      />
    </section>
  );
}
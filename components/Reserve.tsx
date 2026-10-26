"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, CheckCircle, Minus, Plus, WarningCircle } from "@phosphor-icons/react";
import { fleet, type VehicleId } from "@/lib/data";
import { VEHICLE_EVENT } from "@/lib/events";
import { site } from "@/lib/site";

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
    date: () => (get("date") ? null : "Choose a pickup date."),
    time: () => (get("time") ? null : "Choose a pickup time."),
    pickup: () => (get("pickup") ? null : "Enter a pickup address."),
    dropoff: () => (get("dropoff") ? null : "Enter a drop-off address, or write “as directed”."),
    name: () => (get("name") ? null : "Enter the name for the booking."),
    phone: () =>
      get("phone").replace(/\D/g, "").length >= 10
        ? null
        : "Enter a phone number with area code, so the chauffeur can reach you.",
    email: () => (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(get("email")) ? null : "Enter an email like name@company.com."),
  };
  const e: Errors = {};
  for (const f of fields) {
    const msg = checks[f]();
    if (msg) e[f] = msg;
  }
  return e;
}

/*
  No backend is connected yet. On submit, the request opens the visitor's email app
  addressed to reservations, with every detail filled in.
  To go live, replace sendRequest() with a POST to your booking system or a form service.
*/
function sendRequest(data: Record<string, string>) {
  const vehicle = fleet.find((v) => v.id === data.vehicle)?.name ?? data.vehicle;
  const lines = [
    `Name: ${data.name}`,
    `Phone: ${data.phone}`,
    `Email: ${data.email}`,
    `Limousine: ${vehicle}`,
    `Guests: ${data.passengers}`,
    `Date: ${data.date}`,
    `Time: ${data.time}`,
    `Pickup: ${data.pickup}`,
    `Drop-off: ${data.dropoff}`,
    data.notes ? `Notes: ${data.notes}` : "",
  ].filter(Boolean);
  const subject = `Reservation request: ${vehicle}, ${data.date} ${data.time}`;
  window.location.href = `mailto:${site.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join("\n"))}`;
}

function formatTrip(fd: FormData) {
  const date = String(fd.get("date") ?? "");
  const time = String(fd.get("time") ?? "");
  let when = `${date} ${time}`;
  if (date && time) {
    const d = new Date(`${date}T${time}`);
    if (!Number.isNaN(d.getTime())) {
      when = new Intl.DateTimeFormat("en-US", {
        weekday: "short",
        month: "short",
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

export function Reserve() {
  const [vehicle, setVehicle] = useState<VehicleId>("stretch");
  const [step, setStep] = useState<Step>(1);
  const [guests, setGuests] = useState(4);
  const maxGuests = fleet.find((v) => v.id === vehicle)?.passengers ?? 14;

  // Picking a smaller limousine caps the guest count at its capacity.
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

  useEffect(() => {
    setMinDate(today());
    const onPick = (e: Event) => pickVehicle((e as CustomEvent<VehicleId>).detail);
    window.addEventListener(VEHICLE_EVENT, onPick);
    return () => window.removeEventListener(VEHICLE_EVENT, onPick);
  }, []);

  // Move focus to the first field of the step the visitor just opened.
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
    setTimeout(() => setStatus("sent"), 600);
  };

  const err = (k: Field) =>
    errors[k] ? (
      <p id={`err-${k}`} className="mt-2 flex items-start gap-2 text-sm text-danger">
        <WarningCircle size={16} className="mt-0.5 shrink-0" aria-hidden="true" />
        {errors[k]}
      </p>
    ) : null;

  const a11y = (k: Field) => ({
    "aria-invalid": errors[k] ? (true as const) : undefined,
    "aria-describedby": errors[k] ? `err-${k}` : undefined,
  });

  const steps: { n: Step; label: string }[] = [
    { n: 1, label: "Your trip" },
    { n: 2, label: "Your details" },
  ];

  return (
    <section id="reserve" aria-labelledby="reserve-title" className="relative border-t border-hairline">
      <div className="on-photo relative isolate flex min-h-[min(60vh,34rem)] items-end overflow-hidden bg-canvas">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/skyline.jpg"
          alt="The Manhattan skyline at night"
          width={2400}
          height={1600}
          loading="lazy"
          className="grade absolute inset-0 -z-10 h-full w-full object-cover"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-[linear-gradient(to_top,var(--color-canvas)_0%,rgb(6_6_6/0.55)_45%,rgb(6_6_6/0.25)_100%)]"
        />
        <div className="wrap pb-14">
          <h2 id="reserve-title" className="t-display t-display-xl max-w-[52rem]">
            Your limousine is waiting
          </h2>
        </div>
      </div>

      <div className="wrap section !pt-12">
        <div className="grid gap-16 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-4">
            <p className="t-lead">
              Two short steps. Dispatch confirms your limousine, chauffeur and fare by email, usually within 15
              minutes.
            </p>
            <div className="mt-10">
              <p className="t-caption">Prefer to talk</p>
              <a
                href={site.phoneHref}
                className="t-figure mt-2 inline-block text-3xl tabular transition-colors hover:text-link"
              >
                {site.phoneDisplay}
              </a>
              <p className="mt-3 text-muted">{site.hours}</p>
            </div>
          </div>

          <div className="lg:col-span-7 lg:col-start-6">
            {status === "sent" && (
              <div role="status" className="border-t border-hairline-strong pt-10">
                <CheckCircle size={32} weight="light" className="text-success" aria-hidden="true" />
                <h3 className="t-display t-display-md mt-6">Almost done</h3>
                <p className="mt-4 max-w-[34rem] text-body">
                  Your email app should have opened with the reservation filled in. Press send and dispatch
                  will confirm by reply. If nothing opened, call {site.phoneDisplay} or write to{" "}
                  <a className="text-link underline underline-offset-4" href={`mailto:${site.email}`}>
                    {site.email}
                  </a>
                  .
                </p>
                <button type="button" className="btn btn-quiet mt-10" onClick={() => setStatus("idle")}>
                  Edit request
                </button>
              </div>
            )}

            <div hidden={status === "sent"}>
              {/* Progress */}
              <ol className="grid grid-cols-2 gap-3" aria-label="Booking progress">
                {steps.map((s) => (
                  <li key={s.n} aria-current={step === s.n ? "step" : undefined}>
                    <span
                      aria-hidden="true"
                      className={`block h-px transition-colors duration-500 ${
                        step >= s.n ? "bg-ink" : "bg-hairline-strong"
                      }`}
                    />
                    <span
                      className={`t-mono mt-3 block transition-colors duration-500 ${
                        step === s.n ? "text-ink" : "text-muted"
                      }`}
                    >
                      {s.label}
                    </span>
                  </li>
                ))}
              </ol>
              <p className="sr-only" aria-live="polite">
                Step {step} of 2, {steps[step - 1].label}
              </p>

              <form ref={formRef} noValidate onSubmit={onSubmit} className="mt-10">
                {/* Step 1: the trip */}
                <fieldset hidden={step !== 1} className="step-in grid gap-x-10 gap-y-9 sm:grid-cols-6">
                  <legend className="sr-only">Your trip</legend>

                  {/* Limousine choice: three selectable tiles instead of a dropdown */}
                  <div className="sm:col-span-6" role="radiogroup" aria-labelledby="r-vehicle-label">
                    <p id="r-vehicle-label" className="field-label leading-[1.744rem]">
                      Limousine
                    </p>
                    <div className="mt-3 grid gap-3 sm:grid-cols-3">
                      {fleet.map((v) => {
                        const selected = vehicle === v.id;
                        return (
                          <label
                            key={v.id}
                            className={`group relative flex cursor-pointer border sm:block transition-[border-color,background-color] duration-300 has-[input:focus-visible]:outline has-[input:focus-visible]:outline-1 has-[input:focus-visible]:outline-offset-4 has-[input:focus-visible]:outline-link ${
                              selected ? "border-ink bg-surface-card" : "border-hairline-strong hover:border-muted"
                            }`}
                          >
                            <input
                              type="radio"
                              name="vehicle"
                              value={v.id}
                              checked={selected}
                              onChange={() => pickVehicle(v.id)}
                              className="sr-only"
                            />
                            <span className="block aspect-[4/3] w-28 shrink-0 overflow-hidden bg-surface sm:aspect-[16/9] sm:w-auto">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={v.image}
                                alt=""
                                width={480}
                                height={270}
                                loading="lazy"
                                className={`grade h-full w-full object-cover transition-opacity duration-300 ${
                                  selected ? "opacity-100" : "opacity-55 group-hover:opacity-80"
                                }`}
                              />
                            </span>
                            <span className="flex flex-1 items-center justify-between gap-3 px-4 py-3.5 sm:items-start">
                              <span>
                                <span className={`block ${selected ? "text-ink" : "text-body"}`}>{v.name}</span>
                                <span className="t-caption mt-0.5 block">Up to {v.passengers} guests</span>
                              </span>
                              <span
                                aria-hidden="true"
                                className={`mt-1.5 grid h-4 w-4 shrink-0 place-items-center rounded-full border transition-colors ${
                                  selected ? "border-ink" : "border-hairline-strong"
                                }`}
                              >
                                <span
                                  className={`h-2 w-2 rounded-full bg-ink transition-transform duration-300 ${
                                    selected ? "scale-100" : "scale-0"
                                  }`}
                                />
                              </span>
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  {/* Guests: a stepper instead of a number box */}
                  <div className="sm:col-span-2">
                    <p id="r-pax-label" className="field-label leading-[1.744rem]">
                      Guests
                    </p>
                    <input type="hidden" name="passengers" value={guests} />
                    <div
                      className="mt-1 flex min-h-[2.875rem] items-center justify-between border-b border-hairline-strong"
                      role="group"
                      aria-labelledby="r-pax-label"
                    >
                      <button
                        type="button"
                        onClick={() => setGuests((g) => Math.max(1, g - 1))}
                        disabled={guests <= 1}
                        aria-label="Fewer guests"
                        className="grid h-9 w-9 place-items-center rounded-full border border-hairline-strong text-ink transition-colors hover:border-ink disabled:opacity-30"
                      >
                        <Minus size={14} aria-hidden="true" />
                      </button>
                      <output aria-live="polite" className="t-figure text-xl tabular">
                        {guests}
                      </output>
                      <button
                        type="button"
                        onClick={() => setGuests((g) => Math.min(maxGuests, g + 1))}
                        disabled={guests >= maxGuests}
                        aria-label="More guests"
                        className="grid h-9 w-9 place-items-center rounded-full border border-hairline-strong text-ink transition-colors hover:border-ink disabled:opacity-30"
                      >
                        <Plus size={14} aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                  <div className="sm:col-span-2">
                    <label htmlFor="r-date" className="field-label">
                      Date
                    </label>
                    <input
                      id="r-date"
                      name="date"
                      type="date"
                      min={minDate}
                      autoComplete="off"
                      className="field mt-1"
                      {...a11y("date")}
                    />
                    {err("date")}
                  </div>
                  <div className="sm:col-span-2">
                    <label htmlFor="r-time" className="field-label">
                      Pickup time
                    </label>
                    <input
                      id="r-time"
                      name="time"
                      type="time"
                      autoComplete="off"
                      className="field mt-1"
                      {...a11y("time")}
                    />
                    {err("time")}
                  </div>
                  <div className="sm:col-span-3">
                    <label htmlFor="r-pickup" className="field-label">
                      Pickup
                    </label>
                    <input
                      id="r-pickup"
                      name="pickup"
                      type="text"
                      autoComplete="off"
                      placeholder="The Plaza, 768 5th Ave…"
                      className="field mt-1"
                      {...a11y("pickup")}
                    />
                    {err("pickup")}
                  </div>
                  <div className="sm:col-span-3">
                    <label htmlFor="r-dropoff" className="field-label">
                      Drop-off
                    </label>
                    <input
                      id="r-dropoff"
                      name="dropoff"
                      type="text"
                      autoComplete="off"
                      placeholder="Cipriani Wall Street…"
                      className="field mt-1"
                      {...a11y("dropoff")}
                    />
                    {err("dropoff")}
                  </div>
                  <div className="flex flex-wrap items-center gap-6 pt-2 sm:col-span-6">
                    <button type="submit" className="btn">
                      Continue <ArrowRight size={16} aria-hidden="true" />
                    </button>
                    <p className="text-sm text-muted-soft">Next: where we can reach you.</p>
                  </div>
                </fieldset>

                {/* Step 2: contact details */}
                <fieldset hidden={step !== 2} className="step-in grid gap-x-10 gap-y-9 sm:grid-cols-2">
                  <legend className="sr-only">Your details</legend>
                  {trip && (
                    <div className="flex flex-wrap items-start justify-between gap-4 border border-hairline bg-surface px-6 py-5 sm:col-span-2">
                      <div className="min-w-0">
                        <p className="text-ink">
                          {trip.vehicle}, {trip.guests} guests
                        </p>
                        <p className="mt-1 break-words text-muted">
                          {trip.when}. {trip.route}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={backToTrip}
                        className="link-mono shrink-0"
                      >
                        Edit trip
                      </button>
                    </div>
                  )}
                  <div className="sm:col-span-2">
                    <label htmlFor="r-name" className="field-label">
                      Name
                    </label>
                    <input
                      id="r-name"
                      name="name"
                      type="text"
                      autoComplete="name"
                      className="field mt-1"
                      {...a11y("name")}
                    />
                    {err("name")}
                  </div>
                  <div>
                    <label htmlFor="r-phone" className="field-label">
                      Mobile
                    </label>
                    <input
                      id="r-phone"
                      name="phone"
                      type="tel"
                      inputMode="tel"
                      autoComplete="tel"
                      placeholder="(917) 555-0142…"
                      className="field mt-1 tabular"
                      {...a11y("phone")}
                    />
                    {err("phone")}
                  </div>
                  <div>
                    <label htmlFor="r-email" className="field-label">
                      Email
                    </label>
                    <input
                      id="r-email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      spellCheck={false}
                      placeholder="name@company.com…"
                      className="field mt-1"
                      {...a11y("email")}
                    />
                    {err("email")}
                  </div>
                  <div className="sm:col-span-2">
                    <label htmlFor="r-notes" className="field-label">
                      Notes for your chauffeur (optional)
                    </label>
                    <textarea
                      id="r-notes"
                      name="notes"
                      rows={2}
                      autoComplete="off"
                      placeholder="Extra stops, a song for the ride, champagne on ice…"
                      className="field mt-1 resize-y"
                    />
                  </div>
                  <div className="flex flex-wrap items-center gap-4 pt-2 sm:col-span-2">
                    <button type="submit" className="btn" disabled={status === "sending"}>
                      {status === "sending" ? "Opening email…" : "Reserve"}
                    </button>
                    <button type="button" onClick={backToTrip} className="btn btn-quiet">
                      <ArrowLeft size={16} aria-hidden="true" /> Back
                    </button>
                    <p className="w-full text-sm text-muted-soft sm:w-auto">
                      No payment now. You approve the final fare first.
                    </p>
                  </div>
                </fieldset>

                <div aria-live="polite" className="sr-only">
                  {Object.keys(errors).length ? `${Object.keys(errors).length} fields need attention.` : ""}
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

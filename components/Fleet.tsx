"use client";

import { useState } from "react";
import { ArrowRight } from "@phosphor-icons/react";
import { fleet, usd, type VehicleId } from "@/lib/data";
import { selectVehicle } from "@/lib/events";
import { Reveal } from "./Reveal";

export function Fleet() {
  const [active, setActive] = useState<VehicleId>("stretch");

  return (
    <section id="fleet" aria-labelledby="fleet-title" className="section border-t border-hairline">
      <div className="wrap">
        <Reveal className="max-w-[40rem]">
          <h2 id="fleet-title" className="t-display t-display-lg">
            The fleet
          </h2>
          <p className="t-lead mt-6">
            Three limousines, all black, all late-model. Each one is detailed before every trip.
          </p>
        </Reveal>

        {/* Desktop: hover accordion. The expanding width is a deliberate layout
            transition on four panels only; contents fade with opacity/transform. */}
        <div className="mt-16 hidden h-[min(72vh,44rem)] gap-2 lg:flex">
          {fleet.map((v) => {
            const isActive = v.id === active;
            return (
              <article
                key={v.id}
                className="on-photo group relative min-w-0 overflow-hidden bg-surface transition-[flex-grow] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
                style={{ flexGrow: isActive ? 4.2 : 1, flexBasis: 0 }}
                onMouseEnter={() => setActive(v.id)}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={v.image}
                  alt={v.alt}
                  width={1600}
                  height={1067}
                  loading="lazy"
                  className={`grade absolute inset-0 h-full w-full object-cover transition-[transform,opacity] duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                    isActive ? "scale-100 opacity-100" : "scale-105 opacity-45"
                  }`}
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-[linear-gradient(to_top,rgb(6_6_6/0.9),rgb(6_6_6/0.2)_55%,transparent)]"
                />

                <button
                  type="button"
                  onClick={() => setActive(v.id)}
                  onFocus={() => setActive(v.id)}
                  aria-expanded={isActive}
                  aria-controls={`fleet-${v.id}`}
                  className="absolute inset-0 z-10 text-left focus-visible:outline-offset-[-6px]"
                >
                  <span className="sr-only">Show {v.name}</span>
                </button>

                <div className={`absolute inset-x-0 bottom-0 z-20 ${isActive ? "p-8" : "p-5"}`}>
                  <h3
                    className={`t-display ${
                      isActive ? "t-display-md whitespace-nowrap" : "text-base text-body"
                    }`}
                  >
                    {v.name}
                  </h3>
                  <div
                    className={`grid transition-[grid-template-rows] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                      isActive ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                    }`}
                  >
                  <div
                    id={`fleet-${v.id}`}
                    inert={!isActive}
                    className={`min-h-0 overflow-hidden transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                      isActive ? "translate-y-0 opacity-100 delay-200" : "translate-y-3 opacity-0"
                    }`}
                  >
                    <p className="t-caption mt-3">{v.model}</p>
                    <p className="mt-4 max-w-[26rem] text-body">{v.note}</p>
                    <dl className="mt-7 flex gap-10">
                      <Spec label="Passengers" value={String(v.passengers)} />
                      <Spec label="Minimum" value={`${v.minHours} hours`} />
                      <Spec label="From, per hour" value={usd.format(v.hourly)} />
                    </dl>
                    <a
                      href="#reserve"
                      onClick={() => selectVehicle(v.id)}
                      className="link-mono relative z-30 mt-6 inline-flex min-h-11 items-center gap-2"
                    >
                      Reserve <ArrowRight size={14} aria-hidden="true" />
                    </a>
                  </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* Mobile and tablet: stacked */}
        <ul className="mt-12 grid gap-14 lg:hidden">
          {fleet.map((v, i) => (
            <Reveal as="li" key={v.id} delay={i * 0.05}>
              <div className="aspect-[4/3] overflow-hidden bg-surface">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={v.image}
                  alt={v.alt}
                  width={1600}
                  height={1200}
                  loading="lazy"
                  className="grade h-full w-full object-cover"
                />
              </div>
              <h3 className="t-display t-display-sm mt-6">{v.name}</h3>
              <p className="t-caption mt-2">{v.model}</p>
              <dl className="mt-5 flex gap-8">
                <Spec label="Passengers" value={String(v.passengers)} />
                <Spec label="Minimum" value={`${v.minHours} hours`} />
                <Spec label="From, per hour" value={usd.format(v.hourly)} />
              </dl>
              <a
                href="#reserve"
                onClick={() => selectVehicle(v.id)}
                className="link-mono mt-4 inline-flex min-h-11 items-center gap-2"
              >
                Reserve <ArrowRight size={14} aria-hidden="true" />
              </a>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Spec({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="t-caption">{label}</dt>
      <dd className="t-figure mt-1 text-2xl">{value}</dd>
    </div>
  );
}

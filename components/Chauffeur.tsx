import { Reveal } from "./Reveal";

const standards = [
  { title: "Licensed and vetted", body: "TLC-licensed and background-checked." },
  { title: "Quiet by default", body: "Conversation only if you want it." },
  { title: "The cabin, ready", body: "Ice, chargers and your temperature, set." },
];

// Full-bleed cinematic photo with the heading and promises laid over its dark lower part.
export function Chauffeur() {
  return (
    <section
      aria-labelledby="chauffeur-title"
      className="on-photo relative isolate flex min-h-[min(100dvh,56rem)] items-end overflow-hidden border-t border-hairline bg-canvas"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/chauffeur-band.jpg"
        alt="A chauffeur holding the rear door of a black limousine at night"
        width={2400}
        height={1350}
        loading="lazy"
        className="grade absolute inset-0 -z-10 h-full w-full object-cover"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[linear-gradient(to_top,rgb(6_6_6/0.96)_0%,rgb(6_6_6/0.75)_32%,rgb(6_6_6/0.15)_65%,rgb(6_6_6/0.35)_100%)]"
      />

      <div className="wrap w-full pb-[clamp(3rem,7vh,5.5rem)] pt-40">
        <Reveal>
          <h2 id="chauffeur-title" className="t-display t-display-xl max-w-[14ch]">
            The chauffeur makes the evening
          </h2>
        </Reveal>

        <ul className="mt-12 grid gap-8 md:grid-cols-3 md:gap-10">
          {standards.map((s, i) => (
            <Reveal as="li" key={s.title} delay={0.1 + i * 0.08} className="border-t border-ink/25 pt-6">
              <h3 className="t-display t-display-sm">{s.title}</h3>
              <p className="mt-2 text-body">{s.body}</p>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}

import { Reveal } from "./Reveal";

// Policies are PLACEHOLDERS reflecting common NYC practice. Confirm with real terms.
const faqs = [
  { q: "How far ahead should I book?", a: "Weddings and proms: as early as possible. Other nights: 48 hours." },
  { q: "What is included?", a: "Chauffeur, fuel, water and ice. Gratuity and tolls are itemized on your quote." },
  { q: "Is there a minimum?", a: "3 hours, or 4 for the SUV limousine." },
  { q: "Can we cancel?", a: "Free up to 72 hours before pickup." },
];

// Wide photo band with the heading on it, then every answer visible in one row.
export function Faq() {
  return (
    <section id="faq" aria-labelledby="faq-title" className="section border-t border-hairline">
      <div className="wrap">
        <Reveal className="on-photo relative isolate flex aspect-[4/3] items-end overflow-hidden bg-surface sm:aspect-[11/5]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/faq-band.jpg"
            alt="A man in a suit with a glass of whisky in the dark rear seat of a chauffeured car"
            width={2400}
            height={1600}
            loading="lazy"
            className="grade absolute inset-0 -z-10 h-full w-full object-cover object-[50%_18%]"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 -z-10 bg-[linear-gradient(to_top,rgb(6_6_6/0.85)_0%,rgb(6_6_6/0.25)_55%,transparent_100%)]"
          />
          <h2 id="faq-title" className="t-display t-display-lg p-8 sm:p-10">
            Questions, answered
          </h2>
        </Reveal>

        <dl className="mt-12 grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {faqs.map((f, i) => (
            <Reveal key={f.q} delay={i * 0.06} className="border-t border-hairline pt-6">
              <dt className="t-display t-display-sm">{f.q}</dt>
              <dd className="mt-3 text-muted">{f.a}</dd>
            </Reveal>
          ))}
        </dl>
      </div>
    </section>
  );
}

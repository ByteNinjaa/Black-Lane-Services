import { nav, site } from "@/lib/site";
import { Wordmark } from "./Wordmark";

const areas = ["Manhattan", "Brooklyn & Queens", "The Hamptons", "Westchester", "Northern New Jersey"];

export function Footer() {
  return (
    <footer className="border-t border-hairline pb-[max(2.5rem,env(safe-area-inset-bottom))] pt-20 text-muted">
      <div className="wrap">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="t-caps text-body">Sovereign</p>
            <p className="mt-4 max-w-[18rem] text-[0.9375rem]">
              Chauffeured limousine service for New York City and beyond.
            </p>
          </div>
          <nav aria-label="Footer">
            <p className="t-caps text-body">Explore</p>
            <ul className="mt-3 flex flex-col text-[0.9375rem]">
              {nav.map((n) => (
                <li key={n.href}>
                  <a href={n.href} className="inline-flex min-h-10 items-center transition-colors hover:text-ink">
                    {n.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div>
            <p className="t-caps text-body">Contact</p>
            <ul className="mt-3 flex flex-col text-[0.9375rem]">
              <li>
                <a href={site.phoneHref} className="inline-flex min-h-10 items-center tabular transition-colors hover:text-ink">
                  {site.phoneDisplay}
                </a>
              </li>
              <li>
                <a href={`mailto:${site.email}`} className="inline-flex min-h-10 items-center break-all transition-colors hover:text-ink">
                  {site.email}
                </a>
              </li>
              <li className="py-2">
                {site.addressLine1}
                <br />
                {site.addressLine2}
              </li>
            </ul>
          </div>
          <div>
            <p className="t-caps text-body">Service Area</p>
            <ul className="mt-3 flex flex-col text-[0.9375rem]">
              {areas.map((a) => (
                <li key={a} className="py-2">{a}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-24 flex justify-center overflow-hidden text-[clamp(1.25rem,5.4vw,4.5rem)]">
          <Wordmark />
        </div>

        <div className="mt-14 flex flex-col justify-between gap-3 border-t border-hairline pt-8 text-sm text-muted-soft sm:flex-row">
          <p>&copy; {new Date().getFullYear()} Sovereign. All rights reserved.</p>
          <p>Rates shown are estimates.</p>
        </div>
      </div>
    </footer>
  );
}

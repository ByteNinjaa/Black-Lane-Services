"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { List, X } from "@phosphor-icons/react";
import { Wordmark } from "./Wordmark";
import { ThemeToggle } from "./ThemeToggle";
import { nav, site } from "@/lib/site";

export function SiteNav() {
  const [open, setOpen] = useState(false);
  const [solid, setSolid] = useState(false);
  const reduce = useReducedMotion();
  const menuBtn = useRef<HTMLButtonElement>(null);
  const firstLink = useRef<HTMLAnchorElement>(null);

  // Nav turns solid once the top sentinel leaves the viewport (no scroll listener).
  useEffect(() => {
    const sentinel = document.getElementById("top-sentinel");
    if (!sentinel) return;
    const io = new IntersectionObserver(([entry]) => setSolid(!entry.isIntersecting));
    io.observe(sentinel);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    firstLink.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
      menuBtn.current?.focus();
    };
  }, [open]);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-40 transition-[background-color,border-color] duration-500 border-b ${
          solid && !open
            ? "bg-canvas/95 border-hairline"
            : `bg-transparent border-transparent ${open ? "" : "on-photo"}`
        }`}
        style={{ paddingTop: "env(safe-area-inset-top)" }}
      >
        <div className="wrap grid h-[var(--nav-h)] grid-cols-[1fr_auto_1fr] items-center">
          <div>
            <button
              ref={menuBtn}
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="site-menu"
              className="t-mono -ml-2 inline-flex min-h-11 items-center gap-3 px-2 text-ink transition-colors hover:text-link"
            >
              {open ? (
                <X size={18} weight="light" aria-hidden="true" />
              ) : (
                <List size={18} weight="light" aria-hidden="true" />
              )}
              <span className="hidden sm:inline">{open ? "Close" : "Menu"}</span>
              <span className="sr-only sm:hidden">{open ? "Close menu" : "Open menu"}</span>
            </button>
          </div>

          <a href="#top" aria-label="Sovereign, back to top" className="inline-flex min-h-11 items-center px-2 text-[0.8125rem] sm:text-sm">
            <Wordmark />
          </a>

          <div className="flex items-center justify-end gap-4 sm:gap-6">
            <a
              href={site.phoneHref}
              className="t-mono hidden text-muted transition-colors hover:text-ink lg:inline tabular"
            >
              {site.phoneDisplay}
            </a>
            <a href="#reserve" className="btn btn-quiet !min-h-10 !px-5 !py-2 !text-[0.875rem] hidden sm:inline-flex">
              Reserve
            </a>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="site-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Site menu"
            className="fixed inset-0 z-30 overflow-y-auto overscroll-contain bg-canvas"
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduce ? { opacity: 0, transition: { duration: 0 } } : { opacity: 0 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          >
            <nav aria-label="Primary" className="wrap flex min-h-[100dvh] flex-col justify-center gap-12 pb-12 pt-28">
              <ul className="flex flex-col gap-3">
                {[...nav, { href: "#reserve", label: "Reserve" }].map((item, i) => (
                  <motion.li
                    key={item.href}
                    initial={reduce ? false : { opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.08 + i * 0.05, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <a
                      ref={i === 0 ? firstLink : undefined}
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className="t-display t-display-lg inline-block py-1 text-ink/90 transition-colors hover:text-link"
                    >
                      {item.label}
                    </a>
                  </motion.li>
                ))}
              </ul>
              <div className="grid gap-6 border-t border-hairline pt-8 sm:grid-cols-3">
                <div>
                  <p className="t-caption">Telephone</p>
                  <a href={site.phoneHref} className="mt-2 block text-ink tabular">
                    {site.phoneDisplay}
                  </a>
                </div>
                <div>
                  <p className="t-caption">Email</p>
                  <a href={`mailto:${site.email}`} className="mt-2 block break-words text-ink">
                    {site.email}
                  </a>
                </div>
                <div>
                  <p className="t-caption">Dispatch</p>
                  <p className="mt-2 text-ink">{site.hours}</p>
                </div>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

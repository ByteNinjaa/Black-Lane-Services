"use client";

import { useEffect, useState } from "react";
import { CarProfile } from "@phosphor-icons/react";
import { THEME_KEY as KEY } from "@/lib/theme";

// Night mode = headlights on. Day mode = the car drives over and the lights go off.
export function ThemeToggle() {
  const [dark, setDark] = useState(true);

  useEffect(() => {
    setDark(document.documentElement.dataset.theme !== "light");
  }, []);

  const toggle = () => {
    const next = !dark;
    setDark(next);
    const root = document.documentElement;
    if (next) delete root.dataset.theme;
    else root.dataset.theme = "light";
    try {
      localStorage.setItem(KEY, next ? "dark" : "light");
    } catch {
      // Storage can be unavailable (private mode); the switch still works for this visit.
    }
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute("content", next ? "#060606" : "#f4f4f2");
  };

  return (
    <button
      type="button"
      role="switch"
      aria-checked={dark}
      aria-label={dark ? "Night mode, headlights on. Switch to day mode" : "Day mode, headlights off. Switch to night mode"}
      title={dark ? "Headlights on" : "Headlights off"}
      onClick={toggle}
      className="headlight-switch shrink-0"
    >
      <span aria-hidden="true" className="beam" />
      <span aria-hidden="true" className="car">
        <CarProfile size={16} weight="fill" />
      </span>
    </button>
  );
}


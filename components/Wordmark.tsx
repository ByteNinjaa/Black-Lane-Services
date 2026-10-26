// The SOVEREIGN wordmark: display face, widest tracking in the system.
export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span
      translate="no"
      className={`font-display uppercase text-ink whitespace-nowrap ${className}`}
      style={{ fontStretch: "75%", letterSpacing: "0.42em", marginRight: "-0.42em" }}
    >
      Sovereign
    </span>
  );
}

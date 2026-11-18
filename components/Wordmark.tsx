// The Black Lane Services wordmark: display face, widest tracking in the system.
export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span
      translate="no"
      className={`font-display uppercase text-ink whitespace-nowrap ${className}`}
      style={{ fontStretch: "0%", letterSpacing: "0.2em", marginRight: "-0.42em" }}
    >
      Black Lane Services
    </span>
  );
}

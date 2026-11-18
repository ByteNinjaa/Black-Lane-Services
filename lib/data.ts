// Rates are ESTIMATES for the landing page.
// Replace with the company's real rate card before launch.

export type VehicleId = "escalade" | "suburban";
export type Vehicle = {
  id: VehicleId;
  name: string;
  passengers: number;
  image: string;
  alt: string;
  note: string;
};

export const fleet: Vehicle[] = [
{
    id: "escalade",
    name: "Cadillac Escalade",
    passengers: 6,
    image: "/images/fleet-escalade.jpg",
    alt: "Black Cadillac Escalade SUV parked in front of a luxury Manhattan hotel",
    note: "Unmatched SUV presence. Exceptional legroom, discreet privacy glass, and effortless power for airport transfers and executive city travel.",
  },
{
    id: "suburban",
    name: "Chevrolet Suburban",
    passengers: 6,
    image: "/images/fleet-suburban.jpg",
    alt: "Black Chevrolet Suburban luxury SUV parked outside a New York City private aviation terminal",
    note: "The industry standard for executive transport. Massive luggage capacity, refined leather interior, and supreme highway stability.",
  },
];

export const usd = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

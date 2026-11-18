// Rates are ESTIMATES for the landing page.
// Replace with the company's real rate card before launch.

export type VehicleId = "suburban";
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
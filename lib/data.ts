// Rates are ESTIMATES for the landing page.
// Replace with the company's real rate card before launch.

export type VehicleId = "stretch" | "suv" | "sprinter";

export type Vehicle = {
  id: VehicleId;
  name: string;
  model: string;
  passengers: number;
  hourly: number; // USD per hour, before gratuity
  minHours: number;
  image: string;
  alt: string;
  note: string;
};

export const fleet: Vehicle[] = [
  {
    id: "stretch",
    name: "Stretch Limousine",
    model: "Lincoln stretch or similar",
    passengers: 8,
    hourly: 195,
    minHours: 3,
    image: "/images/fleet-stretch.jpg",
    alt: "Black stretch limousine under lit arches at night",
    note: "The classic. Weddings, anniversaries and the dinners worth dressing for.",
  },
  {
    id: "suv",
    name: "SUV Limousine",
    model: "Hummer or Escalade stretch",
    passengers: 14,
    hourly: 285,
    minHours: 4,
    image: "/images/fleet-suv.jpg",
    alt: "Black stretch Hummer limousine dressed with wedding flowers",
    note: "More room, more presence. Bachelor parties, proms and big arrivals.",
  },
  {
    id: "sprinter",
    name: "Sprinter Limousine",
    model: "Mercedes-Benz Sprinter limo coach",
    passengers: 12,
    hourly: 245,
    minHours: 3,
    image: "/images/fleet-sprinter.jpg",
    alt: "Lounge cabin of a Sprinter limousine with quilted leather captain’s chairs",
    note: "Standing headroom, lounge seating and a bar for the whole group.",
  },
];

export const usd = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

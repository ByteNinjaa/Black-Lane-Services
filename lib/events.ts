import type { VehicleId } from "./data";

// Lets any "Reserve" link preselect a vehicle in the estimator and booking form.
export const VEHICLE_EVENT = "hp:vehicle";

export function selectVehicle(id: VehicleId) {
  window.dispatchEvent(new CustomEvent<VehicleId>(VEHICLE_EVENT, { detail: id }));
}

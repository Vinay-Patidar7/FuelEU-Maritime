import { Route, VesselType, FuelType } from "../core/domain/types";

export const TARGET_GHG_INTENSITY = 89.3368; // 2% below 91.16

export const MOCK_ROUTES: Route[] = [
  {
    routeId: "R001",
    vesselType: VesselType.Container,
    fuelType: FuelType.HFO,
    year: 2024,
    ghgIntensity: 91.0,
    fuelConsumption: 5000,
    distance: 12000,
    totalEmissions: 4500,
    isBaseline: true,
  },
  {
    routeId: "R002",
    vesselType: VesselType.BulkCarrier,
    fuelType: FuelType.LNG,
    year: 2024,
    ghgIntensity: 88.0,
    fuelConsumption: 4800,
    distance: 11500,
    totalEmissions: 4200,
  },
  {
    routeId: "R003",
    vesselType: VesselType.Tanker,
    fuelType: FuelType.MGO,
    year: 2024,
    ghgIntensity: 93.5,
    fuelConsumption: 5100,
    distance: 12500,
    totalEmissions: 4700,
  },
  {
    routeId: "R004",
    vesselType: VesselType.RoRo,
    fuelType: FuelType.HFO,
    year: 2025,
    ghgIntensity: 89.2,
    fuelConsumption: 4900,
    distance: 11800,
    totalEmissions: 4300,
  },
  {
    routeId: "R005",
    vesselType: VesselType.Container,
    fuelType: FuelType.LNG,
    year: 2025,
    ghgIntensity: 90.5,
    fuelConsumption: 4950,
    distance: 11900,
    totalEmissions: 4400,
  },
];

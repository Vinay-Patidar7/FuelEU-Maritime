export enum VesselType {
  Container = "Container",
  BulkCarrier = "BulkCarrier",
  Tanker = "Tanker",
  RoRo = "RoRo",
}

export enum FuelType {
  HFO = "HFO",
  LNG = "LNG",
  MGO = "MGO",
}

export interface Route {
  routeId: string;
  vesselType: VesselType;
  fuelType: FuelType;
  year: number;
  ghgIntensity: number;
  fuelConsumption: number; // in tonnes
  distance: number; // in km
  totalEmissions: number; // in tonnes
  isBaseline?: boolean;
}

export interface ComparisonRoute extends Route {
  percentDiff: number;
  compliant: boolean;
}

export interface ComparisonData {
  baseline: Route | null;
  comparisonRoutes: ComparisonRoute[];
}

export interface BankingInfo {
  shipId: string;
  year: number;
  complianceBalance: number;
  bankedSurplus: number;
}

export interface PoolMember {
  shipId: string;
  cb_before: number;
  cb_after?: number;
}

export interface Pool {
  id: string;
  year: number;
  members: PoolMember[];
}

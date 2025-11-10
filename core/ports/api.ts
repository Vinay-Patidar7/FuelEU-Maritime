import {
  Route,
  ComparisonData,
  BankingInfo,
  PoolMember,
} from "../domain/types";

export interface IRouteApi {
  getRoutes: () => Promise<Route[]>;
  setBaseline: (routeId: string) => Promise<Route | undefined>;
  getComparison: () => Promise<ComparisonData>;
}

export interface IComplianceApi {
  getBankingInfo: (year: number) => Promise<BankingInfo>;
  bankSurplus: () => Promise<BankingInfo>;
  applyBanked: (amount: number) => Promise<BankingInfo>;
  getAdjustedCbForPooling: (year: number) => Promise<PoolMember[]>;
  createPool: (
    members: PoolMember[]
  ) => Promise<{ success: boolean; pool?: PoolMember[]; message: string }>;
}

import { MOCK_ROUTES, TARGET_GHG_INTENSITY } from "../../shared/constants";
import {
  Route,
  ComparisonData,
  BankingInfo,
  PoolMember,
  ComparisonRoute,
  VesselType,
  FuelType,
} from "../../core/domain/types";
import { IRouteApi, IComplianceApi } from "../../core/ports/api";

class MockApiService implements IRouteApi, IComplianceApi {
  private routes: Route[] = JSON.parse(JSON.stringify(MOCK_ROUTES));
  private bankingInfo: BankingInfo = {
    shipId: "S001",
    year: 2025,
    complianceBalance: -5000,
    bankedSurplus: 12000,
  };

  private delay = <T>(data: T, ms = 300): Promise<T> => {
    return new Promise((resolve) => setTimeout(() => resolve(data), ms));
  };

  // --- IRouteApi ---
  async getRoutes(): Promise<Route[]> {
    return this.delay([...this.routes]);
  }

  async setBaseline(routeId: string): Promise<Route | undefined> {
    this.routes.forEach((r) => (r.isBaseline = r.routeId === routeId));
    const newBaseline = this.routes.find((r) => r.routeId === routeId);
    return this.delay(newBaseline ? { ...newBaseline } : undefined);
  }

  async getComparison(): Promise<ComparisonData> {
    const baseline = this.routes.find((r) => r.isBaseline);
    if (!baseline) {
      return this.delay({ baseline: null, comparisonRoutes: [] });
    }

    const comparisonRoutes: ComparisonRoute[] = this.routes
      .filter((r) => !r.isBaseline)
      .map((r) => {
        const percentDiff = (r.ghgIntensity / baseline.ghgIntensity - 1) * 100;
        const compliant = r.ghgIntensity <= TARGET_GHG_INTENSITY;
        return { ...r, percentDiff, compliant };
      });

    return this.delay({ baseline: { ...baseline }, comparisonRoutes });
  }

  // --- IComplianceApi ---
  async getBankingInfo(year: number): Promise<BankingInfo> {
    // A simple mock logic to change CB based on year
    if (year === 2024) {
      this.bankingInfo.complianceBalance = 8500;
    } else {
      this.bankingInfo.complianceBalance = -5000;
    }
    return this.delay({ ...this.bankingInfo, year });
  }

  async bankSurplus(): Promise<BankingInfo> {
    if (this.bankingInfo.complianceBalance > 0) {
      this.bankingInfo.bankedSurplus += this.bankingInfo.complianceBalance;
      this.bankingInfo.complianceBalance = 0;
    }
    return this.delay({ ...this.bankingInfo });
  }

  async applyBanked(amount: number): Promise<BankingInfo> {
    const amountToApply = Math.min(
      amount,
      this.bankingInfo.bankedSurplus,
      Math.abs(this.bankingInfo.complianceBalance)
    );
    if (this.bankingInfo.complianceBalance < 0 && amountToApply > 0) {
      this.bankingInfo.bankedSurplus -= amountToApply;
      this.bankingInfo.complianceBalance += amountToApply;
    }
    return this.delay({ ...this.bankingInfo });
  }

  async getAdjustedCbForPooling(year: number): Promise<PoolMember[]> {
    const mockMembers: PoolMember[] = [
      { shipId: "S001", cb_before: 15000 },
      { shipId: "S002", cb_before: -8000 },
      { shipId: "S003", cb_before: -12000 },
      { shipId: "S004", cb_before: 7000 },
      { shipId: "S005", cb_before: -2000 },
    ];
    return this.delay(mockMembers);
  }

  async createPool(
    members: PoolMember[]
  ): Promise<{ success: boolean; pool?: PoolMember[]; message: string }> {
    const totalCB = members.reduce((sum, m) => sum + m.cb_before, 0);

    if (totalCB < 0) {
      return this.delay({
        success: false,
        message: "Pool sum must be non-negative.",
      });
    }

    // This is a simplified greedy allocation for simulation
    const deficits = members
      .filter((m) => m.cb_before < 0)
      .sort((a, b) => a.cb_before - b.cb_before);
    const surpluses = members
      .filter((m) => m.cb_before > 0)
      .sort((a, b) => b.cb_before - a.cb_before);

    const pool_after = JSON.parse(JSON.stringify(members)) as PoolMember[];

    for (const deficitShip of deficits) {
      let needed = Math.abs(deficitShip.cb_before);
      for (const surplusShip of surpluses) {
        if (needed === 0) break;
        const available = surplusShip.cb_before;
        const transfer = Math.min(needed, available);

        const deficitAfter = pool_after.find(
          (p) => p.shipId === deficitShip.shipId
        )!;
        const surplusAfter = pool_after.find(
          (p) => p.shipId === surplusShip.shipId
        )!;

        deficitAfter.cb_before += transfer;
        surplusAfter.cb_before -= transfer;
        needed -= transfer;
      }
    }

    const finalPool = members.map((m) => {
      const finalState = pool_after.find((p) => p.shipId === m.shipId)!;
      return { ...m, cb_after: finalState.cb_before };
    });

    // Final validation
    for (const member of finalPool) {
      const original = members.find((m) => m.shipId === member.shipId)!;
      if (original.cb_before < 0 && member.cb_after! < original.cb_before) {
        return this.delay({
          success: false,
          message: `Deficit ship ${member.shipId} cannot exit worse.`,
        });
      }
      if (original.cb_before > 0 && member.cb_after! < 0) {
        return this.delay({
          success: false,
          message: `Surplus ship ${member.shipId} cannot exit negative.`,
        });
      }
    }

    return this.delay({
      success: true,
      pool: finalPool,
      message: "Pool created successfully.",
    });
  }
}

export const mockApiService = new MockApiService();

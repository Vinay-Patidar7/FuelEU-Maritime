import React, { useState, useEffect, useMemo } from "react";
import Table from "../components/Table";
import Button from "../components/Button";
import Select from "../components/Select";
import { Route, VesselType, FuelType } from "../../../core/domain/types";
import { mockApiService } from "../../infrastructure/mockApi";

const RoutesView: React.FC = () => {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<{
    vesselType: string;
    fuelType: string;
    year: string;
  }>({
    vesselType: "All",
    fuelType: "All",
    year: "All",
  });
  const [feedbackMessage, setFeedbackMessage] = useState("");

  useEffect(() => {
    fetchRoutes();
  }, []);

  const fetchRoutes = async () => {
    setIsLoading(true);
    const data = await mockApiService.getRoutes();
    setRoutes(data);
    setIsLoading(false);
  };

  const handleSetBaseline = async (routeId: string) => {
    setFeedbackMessage(`Setting ${routeId} as baseline...`);
    await mockApiService.setBaseline(routeId);
    await fetchRoutes(); // Refetch to update the UI with the new baseline status
    setFeedbackMessage(`Route ${routeId} is now the baseline.`);
    setTimeout(() => setFeedbackMessage(""), 3000);
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const filteredRoutes = useMemo(() => {
    return routes.filter((route) => {
      const { vesselType, fuelType, year } = filters;
      return (
        (vesselType === "All" || route.vesselType === vesselType) &&
        (fuelType === "All" || route.fuelType === fuelType) &&
        (year === "All" || route.year.toString() === year)
      );
    });
  }, [routes, filters]);

  const columns = [
    { header: "Route ID", accessor: (item: Route) => item.routeId },
    { header: "Vessel Type", accessor: (item: Route) => item.vesselType },
    { header: "Fuel Type", accessor: (item: Route) => item.fuelType },
    { header: "Year", accessor: (item: Route) => item.year },
    {
      header: "GHG Intensity (gCO₂e/MJ)",
      accessor: (item: Route) => item.ghgIntensity.toFixed(2),
    },
    {
      header: "Fuel Cons. (t)",
      accessor: (item: Route) => item.fuelConsumption.toLocaleString(),
    },
    {
      header: "Distance (km)",
      accessor: (item: Route) => item.distance.toLocaleString(),
    },
    {
      header: "Total Emissions (t)",
      accessor: (item: Route) => item.totalEmissions.toLocaleString(),
    },
    {
      header: "Baseline",
      accessor: (item: Route) =>
        item.isBaseline ? (
          <span className="text-cyan-400 font-semibold">Yes</span>
        ) : (
          "No"
        ),
    },
    {
      header: "Actions",
      accessor: (item: Route) => (
        <Button
          onClick={() => handleSetBaseline(item.routeId)}
          disabled={item.isBaseline}
        >
          Set Baseline
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="p-4 bg-navy-900 rounded-lg shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Select
            label="Filter by Vessel Type"
            name="vesselType"
            value={filters.vesselType}
            onChange={handleFilterChange}
          >
            <option>All</option>
            {Object.values(VesselType).map((v) => (
              <option key={v}>{v}</option>
            ))}
          </Select>
          <Select
            label="Filter by Fuel Type"
            name="fuelType"
            value={filters.fuelType}
            onChange={handleFilterChange}
          >
            <option>All</option>
            {Object.values(FuelType).map((f) => (
              <option key={f}>{f}</option>
            ))}
          </Select>
          <Select
            label="Filter by Year"
            name="year"
            value={filters.year}
            onChange={handleFilterChange}
          >
            <option>All</option>
            {[...new Set(routes.map((r) => r.year))].sort().map((y) => (
              <option key={y}>{y}</option>
            ))}
          </Select>
        </div>
      </div>

      {feedbackMessage && (
        <div className="p-3 bg-green-900/50 text-green-300 rounded-md">
          {feedbackMessage}
        </div>
      )}

      <Table columns={columns} data={filteredRoutes} isLoading={isLoading} />
    </div>
  );
};

export default RoutesView;

import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  ComparisonData,
  ComparisonRoute,
  Route,
} from "../../../core/domain/types";
import { mockApiService } from "../../infrastructure/mockApi";
import { TARGET_GHG_INTENSITY } from "../../../shared/constants";
import Table from "../components/Table";
import CheckIcon from "../components/icons/CheckIcon";
import XCircleIcon from "../components/icons/XCircleIcon";
import Card from "../components/Card";

const CompareView: React.FC = () => {
  const [data, setData] = useState<ComparisonData>({
    baseline: null,
    comparisonRoutes: [],
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const comparisonData = await mockApiService.getComparison();
      setData(comparisonData);
      setIsLoading(false);
    };
    fetchData();
  }, []);

  const chartData = data.baseline
    ? [data.baseline, ...data.comparisonRoutes].map((r) => ({
        name: r.routeId,
        "GHG Intensity": r.ghgIntensity,
      }))
    : [];

  const columns = [
    { header: "Route ID", accessor: (item: ComparisonRoute) => item.routeId },
    {
      header: "GHG Intensity (gCO₂e/MJ)",
      accessor: (item: ComparisonRoute) => item.ghgIntensity.toFixed(2),
    },
    {
      header: "% Difference from Baseline",
      accessor: (item: ComparisonRoute) => {
        const diff = item.percentDiff;
        const color = diff > 0 ? "text-red-400" : "text-green-400";
        return <span className={color}>{diff.toFixed(2)}%</span>;
      },
    },
    {
      header: `Compliant (Target: ${TARGET_GHG_INTENSITY} gCO₂e/MJ)`,
      accessor: (item: ComparisonRoute) => (
        <div className="flex items-center space-x-2">
          {item.compliant ? (
            <CheckIcon className="text-green-400" />
          ) : (
            <XCircleIcon className="text-red-400" />
          )}
          <span>{item.compliant ? "Yes" : "No"}</span>
        </div>
      ),
    },
  ];

  if (isLoading) {
    return <div className="text-center p-10">Loading comparison data...</div>;
  }

  if (!data.baseline) {
    return (
      <div className="text-center p-10 text-yellow-400">
        Please set a baseline route in the 'Routes' tab first.
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <Card title="Baseline Route Information">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <span className="font-semibold text-gray-400">Route ID:</span>{" "}
            {data.baseline.routeId}
          </div>
          <div>
            <span className="font-semibold text-gray-400">GHG Intensity:</span>{" "}
            {data.baseline.ghgIntensity.toFixed(2)} gCO₂e/MJ
          </div>
          <div>
            <span className="font-semibold text-gray-400">Vessel:</span>{" "}
            {data.baseline.vesselType}
          </div>
          <div>
            <span className="font-semibold text-gray-400">Fuel:</span>{" "}
            {data.baseline.fuelType}
          </div>
        </div>
      </Card>

      <Card title="GHG Intensity Comparison Chart">
        <div style={{ width: "100%", height: 400 }}>
          <ResponsiveContainer>
            <BarChart
              data={chartData}
              margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="name" stroke="#9ca3af" />
              <YAxis
                stroke="#9ca3af"
                label={{
                  value: "gCO₂e/MJ",
                  angle: -90,
                  position: "insideLeft",
                  fill: "#9ca3af",
                }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(31, 41, 55, 0.8)",
                  borderColor: "#4b5563",
                  color: "#e5e7eb",
                }}
              />
              <Legend wrapperStyle={{ color: "#d1d5db" }} />
              <Bar dataKey="GHG Intensity" fill="#22d3ee" />
              <Bar dataKey="Target" fill="#f87171" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card title="Comparison Routes Table">
        <Table
          columns={columns}
          data={data.comparisonRoutes}
          isLoading={isLoading}
        />
      </Card>
    </div>
  );
};

export default CompareView;
